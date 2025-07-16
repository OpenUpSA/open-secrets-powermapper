import { purgeCache } from "@netlify/functions";

// Netlify only helper to purge cache. Initiated by Airtable.
export async function GET() {
  try {
    await purgeCache();
    return new Response("Cache Purged.", { status: 202 })
  } catch (e: any) {
    const message = e?.description || e?.message || "Unknown error";
    const status = e?.status || 500;
    return new Response(`Cache Not Purged: ${message}`, { status });
  }
}
