import { purgeCache } from "@netlify/functions";
import { revalidateTag } from "next/cache";

// Netlify only helper to purge cache. Initiated by Airtable.
export async function GET() {
  try {
    revalidateTag('power-stations')
    revalidateTag('entities')
    revalidateTag('data-sources')
    revalidateTag('about')
    await purgeCache({ tags: ["power-stations", "entities", "data-sources", "about"] });
    return new Response("Cache Purged.", { status: 202 })
  } catch (e: any) {
    const message = e?.description || e?.message || "Unknown error";
    const status = e?.status || 500;
    return new Response(`Cache Not Purged: ${message}`, { status });
  }
}
