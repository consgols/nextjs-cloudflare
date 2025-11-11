import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getDB() {
  const { env } = getCloudflareContext();
  return env.cvs as D1Database; // or env.DB
}
