import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('Missing MICROCMS_SERVICE_DOMAIN env');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('Missing MICROCMS_API_KEY env');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});
