import axios from 'axios';
import { BACKEND_URL } from '@/utils/env';

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API request timed out:', error.config?.url);
    } else if (!error.response) {
      console.error('Network error:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// Cache map and Inflight map for GET request caching & deduplication
const cache = new Map();
const inflight = new Map();
const CACHE_TTL = 60000; // 60 seconds

const originalGet = apiClient.get;

apiClient.get = function (url, config) {
  const cacheKey = JSON.stringify({ url, params: config?.params });

  // 1. Check if cache exists and is fresh
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      return Promise.resolve(data);
    }
    cache.delete(cacheKey);
  }

  // 2. Check if request is already in flight (deduplication)
  if (inflight.has(cacheKey)) {
    return inflight.get(cacheKey);
  }

  // 3. Make request, cache result, and clean up inflight list
  const promise = originalGet.call(this, url, config)
    .then((response) => {
      cache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });
      return response;
    })
    .finally(() => {
      inflight.delete(cacheKey);
    });

  inflight.set(cacheKey, promise);
  return promise;
};

export default apiClient;
