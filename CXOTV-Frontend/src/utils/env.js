/**
 * Environment and URL configurations for CXOTV
 */

export const isUAT = (() => {
  if (typeof window !== 'undefined') {
    return window.location.hostname.includes('uatcxotv.techplusmedia.com') ||
           window.location.hostname.includes('uatapicxotv.techplusmedia.com');
  }
  // Server-side check
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const apiURL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_API_URL || process.env.STRAPI_URL || process.env.API_URL || '';
  return siteUrl.includes('uatcxotv') || 
         apiURL.includes('uatapi') || 
         process.env.NEXT_PUBLIC_ENV === 'uat' || 
         process.env.NODE_ENV === 'uat';
})();

export const getBackendUrl = () => {
  if (isUAT) {
    return 'https://uatapicxotv.techplusmedia.com';
  }
  // Support custom configured environment variables (including local development localhost:1337)
  const envUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 
                 process.env.NEXT_PUBLIC_API_URL || 
                 process.env.STRAPI_API_URL || 
                 process.env.STRAPI_URL || 
                 process.env.API_URL;
  if (envUrl) return envUrl;
  
  // Production fallback
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'https://apicxotv.techplusmedia.com';
};

export const getFrontendUrl = () => {
  if (isUAT) {
    return 'https://uatcxotv.techplusmedia.com';
  }
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl;
  
  // Production fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://cxotv.techplusmedia.com';
};

export const BACKEND_URL = getBackendUrl();
export const FRONTEND_URL = getFrontendUrl();
