'use strict';

/**
 * Plugins Configuration
 *
 * Upload:  10 MB size cap, explicit allowed MIME types.
 *          S3 provider config is activated when AWS_S3_BUCKET is set.
 *          Falls back to local filesystem when bucket is not configured.
 *
 * Email:   nodemailer via SMTP. Set SMTP_* env vars on the server.
 *          Supported providers: SendGrid (smtp.sendgrid.net:587),
 *          AWS SES (email-smtp.<region>.amazonaws.com:587),
 *          Mailgun, or any standard SMTP host.
 */

module.exports = ({ env }) => {
  const s3Bucket = env('AWS_S3_BUCKET');

  // ─── Upload Plugin ────────────────────────────────────────────────────────
  const uploadConfig = s3Bucket
    ? {
        // S3 provider (active when AWS_S3_BUCKET is set)
        provider: '@strapi/provider-upload-aws-s3',
        providerOptions: {
          s3Options: {
            credentials: {
              accessKeyId:     env('AWS_ACCESS_KEY_ID'),
              secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
            },
            region: env('AWS_REGION', 'ap-south-1'),
            params: {
              Bucket: s3Bucket,
            },
          },
        },
        actionOptions: {
          upload:       {},
          uploadStream: {},
          delete:       {},
        },
        sizeLimit: 10 * 1024 * 1024, // 10 MB
      }
    : {
        // Local filesystem (development / pre-S3 migration fallback)
        sizeLimit: 10 * 1024 * 1024, // 10 MB
      };

  return {
    upload: {
      config: uploadConfig,
    },

    // ─── Email Plugin ────────────────────────────────────────────────────────
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST', 'smtp.gmail.com'),
          port: env.int('SMTP_PORT', 587),
          secure: env.bool('SMTP_SECURE', false), // true for port 465, false for 587
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
        },
        settings: {
          defaultFrom:    env('SMTP_FROM',     'noreply@cxotv.techplusmedia.com'),
          defaultReplyTo: env('SMTP_REPLY_TO', 'noreply@cxotv.techplusmedia.com'),
        },
      },
    },

    // ─── REST Cache Plugin ───────────────────────────────────────────────────
    'rest-cache': {
      config: {
        provider: {
          name: 'memory',
          options: {
            max: 32768,
            maxAge: 60000, // 60 seconds (matches Next.js cache duration)
          },
        },
        strategy: {
          contentTypes: [
            'api::category.category',
            'api::navbar.navbar',
            'api::single-news.single-news',
            'api::shorts.shorts',
            'api::single-costom-ads.single-costom-ads',
            'api::social-media-link.social-media-link',
            'api::subcategory.subcategory',
            'api::tag.tag',
          ],
        },
      },
    },
  };
};
