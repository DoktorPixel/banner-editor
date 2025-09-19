// src/api/fetchDynamicFeed.ts
import { feedApiClient } from "../api/feedApiClient";

export async function fetchDynamicFeed(targetUrl: string): Promise<string> {
  if (!targetUrl) throw new Error("fetchDynamicFeed: targetUrl is required");

  try {
    // Supabase function ожидает POST с { url: "..." }
    const resp = await feedApiClient.post("", { url: targetUrl });

    // ожидаем формат: { success: true, xmlContent: xmlText, contentLength: number }
    const data = resp.data;
    if (data && data.success && typeof data.xmlContent === "string") {
      return data.xmlContent;
    }

    throw new Error(
      "Unexpected response from feed-proxy: " + JSON.stringify(data)
    );
  } catch (err: unknown) {
    let msg = "Unknown error";

    if (typeof err === "object" && err !== null) {
      // axios error
      const axiosErr = err as {
        response?: { data?: unknown };
        message?: string;
      };
      msg = axiosErr.response?.data
        ? JSON.stringify(axiosErr.response.data)
        : axiosErr.message || msg;
    } else if (typeof err === "string") {
      msg = err;
    }

    throw new Error(`Failed to fetch feed from feed-proxy: ${msg}`);
  }
}
