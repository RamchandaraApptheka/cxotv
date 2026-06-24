'use strict';

/**
 * Rate Limiting Middleware
 *
 * Wraps koa2-ratelimit for use as a Strapi v4 custom middleware.
 * Config is injected from config/middlewares.js so limits can be
 * adjusted per environment without code changes.
 *
 * Default: 300 requests per minute per IP.
 * Storage: in-memory (resets on restart). For multi-instance prod,
 *          swap to a Redis store via the `store` option.
 */

const { RateLimit } = require('koa2-ratelimit');

module.exports = (config, { strapi }) => {
  const limiter = RateLimit.middleware({
    interval: config.interval || { min: 1 },
    max: config.max || 300,
    prefixKey: config.prefixKey || 'strapi_rate',
    message: 'Too many requests — please slow down and try again shortly.',
    headers: true,             // send X-RateLimit-* headers to client
  });

  return async (ctx, next) => {
    return limiter(ctx, next);
  };
};
