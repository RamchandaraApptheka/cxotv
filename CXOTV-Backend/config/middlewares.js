module.exports = ({ env }) => [
  // Rate Limiting: 300 requests per minute per IP
  {
    name: 'global::rate-limit',
    config: {
      interval: { min: 1 },
      max: 300,
      prefixKey: 'strapi_rate',
    },
  },
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env('CORS_ORIGINS', 'http://localhost:3000,http://localhost:1337,https://cxotv.techplusmedia.com,https://uatcxotv.techplusmedia.com').split(','),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
