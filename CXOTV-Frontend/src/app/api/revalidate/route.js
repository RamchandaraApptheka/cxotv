/**
 * On-demand ISR Revalidation Webhook
 *
 * Strapi calls this endpoint via webhook on article publish/update/unpublish.
 * It calls revalidatePath() for the affected article and its category index,
 * invalidating the Next.js cache so the next visitor gets fresh content.
 *
 * Setup in Strapi Admin → Settings → Webhooks:
 *   URL:     https://cxotv.techplusmedia.com/api/revalidate
 *   Method:  POST
 *   Header:  x-webhook-secret: <same value as WEBHOOK_SECRET env var>
 *   Events:  entry.publish, entry.update, entry.unpublish
 *   Filter:  api::single-news.single-news (news content type)
 *
 * Security: request is rejected with 401 unless x-webhook-secret matches.
 */

import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/** Route segment config — this route must always be dynamic (no caching) */
export const dynamic = 'force-dynamic';

export async function POST(request) {
  // ─── Secret verification ────────────────────────────────────────────────
  const secret = request.headers.get('x-webhook-secret');
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error('[revalidate] WEBHOOK_SECRET is not set — rejecting all requests');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ─── Parse Strapi webhook payload ───────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const model  = body?.model;       // e.g. "single-news"
  const slug   = body?.entry?.slug; // article slug
  const revalidated = [];

  try {
    if (model === 'single-news' && slug) {
      // Revalidate the article across all layout route patterns
      const articlePatterns = [
        `/m/[categoryName]/${slug}`,
        `/c/[categoryName]/${slug}`,
        `/h/[categoryName]/${slug}`,
        `/e/[categoryName]/${slug}`,
        `/apac/${slug}`,
        `/emea/${slug}`,
        `/india/${slug}`,
        `/usa/${slug}`,
      ];

      for (const path of articlePatterns) {
        revalidatePath(path, 'page');
        revalidated.push(path);
      }

      // Revalidate category index pages (they list articles)
      revalidatePath('/m/[categoryName]', 'page');
      revalidatePath('/c/[categoryName]', 'page');
      revalidatePath('/h/[categoryName]', 'page');
      revalidatePath('/e/[categoryName]', 'page');
      revalidated.push('/[categoryName] index pages');

      console.log(`[revalidate] Revalidated ${revalidated.length} paths for slug: ${slug}`);
    } else if (model === 'category') {
      // Category name/meta changed — revalidate all category indexes
      revalidatePath('/m/[categoryName]', 'page');
      revalidatePath('/c/[categoryName]', 'page');
      revalidatePath('/h/[categoryName]', 'page');
      revalidatePath('/e/[categoryName]', 'page');
      revalidated.push('all category indexes');
      console.log('[revalidate] Revalidated all category index pages');
    } else {
      // Unknown model — revalidate everything via tag
      revalidateTag('strapi');
      revalidated.push('global strapi tag');
      console.log('[revalidate] Full revalidation triggered via strapi tag');
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      ts: Date.now(),
    });
  } catch (err) {
    console.error('[revalidate] Error during revalidation:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
