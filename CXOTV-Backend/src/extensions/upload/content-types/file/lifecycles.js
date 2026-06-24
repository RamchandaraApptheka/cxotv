'use strict';

/**
 * CloudFront Cache Invalidation Lifecycle Hook
 *
 * Triggers a CloudFront invalidation whenever a media file is
 * created, updated, or deleted in the Strapi upload plugin.
 *
 * Requirements:
 *   - AWS_CLOUDFRONT_DISTRIBUTION_ID must be set in .env
 *   - IAM user/role must have cloudfront:CreateInvalidation permission
 *   - @aws-sdk/client-cloudfront must be installed (npm install @aws-sdk/client-cloudfront)
 *
 * Behaviour:
 *   - Invalidates the specific file path (not /* wildcard) to minimise
 *     CloudFront API costs (first 1,000 paths/month are free).
 *   - Errors are logged but never thrown — a failed invalidation must
 *     never crash Strapi or block the upload response.
 *   - No-ops silently when AWS_CLOUDFRONT_DISTRIBUTION_ID is not set
 *     (safe for local development and pre-migration environments).
 */

let cfClient = null;

function getCFClient() {
  if (cfClient) return cfClient;
  if (!process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID) return null;

  try {
    const { CloudFrontClient } = require('@aws-sdk/client-cloudfront');
    cfClient = new CloudFrontClient({
      region: process.env.AWS_REGION || 'ap-south-1',
    });
    return cfClient;
  } catch (err) {
    strapi.log.warn('[CloudFront] @aws-sdk/client-cloudfront not installed — skipping invalidation');
    return null;
  }
}

async function invalidate(filePath) {
  const client = getCFClient();
  if (!client || !filePath) return;

  // Normalise path to start with /
  const path = filePath.startsWith('/') ? filePath : `/${filePath}`;

  try {
    const { CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
    await client.send(
      new CreateInvalidationCommand({
        DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `strapi-upload-${Date.now()}`,
          Paths: { Quantity: 1, Items: [path] },
        },
      })
    );
    strapi.log.info(`[CloudFront] Invalidated: ${path}`);
  } catch (err) {
    // Never block upload operations — log only
    strapi.log.error(`[CloudFront] Invalidation failed for ${path}: ${err.message}`);
  }
}

module.exports = {
  async afterCreate(event) {
    await invalidate(event.result?.url);
  },

  async afterUpdate(event) {
    await invalidate(event.result?.url);
  },

  async afterDelete(event) {
    await invalidate(event.result?.url);
  },
};
