/**
 * Cloudflare Worker: Key-Value Caching Service
 *
 * This worker provides a simple REST API to interact with a Cloudflare KV namespace.
 * It assumes a KV binding named `REDIS` is configured.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;

    // Helper for JSON responses
    const jsonResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    };

    try {
      if (!env.REDIS) {
        return jsonResponse({ error: "KV namespace REDIS not bound" }, 500);
      }

      switch (method) {
        case "GET": {
          const key = url.searchParams.get("key");
          if (!key) {
            return jsonResponse({ error: "Missing 'key' parameter" }, 400);
          }

          const value = await env.REDIS.get(key);
          if (value === null) {
            return jsonResponse({ error: "Key not found" }, 404);
          }

          // Try to parse as JSON if possible, otherwise return as string
          try {
            return jsonResponse({ key, value: JSON.parse(value) });
          } catch {
            return jsonResponse({ key, value });
          }
        }

        case "POST":
        case "PUT": {
          const body = await request.json();
          const { key, value, ttl } = body;

          if (!key || value === undefined) {
            return jsonResponse(
              { error: "Missing 'key' or 'value' in body" },
              400,
            );
          }

          const options = {};
          if (ttl) {
            options.expirationTtl = parseInt(ttl);
          }

          const valueToStore =
            typeof value === "string" ? value : JSON.stringify(value);
          await env.REDIS.put(key, valueToStore, options);

          return jsonResponse({ message: "Value stored successfully", key });
        }

        case "DELETE": {
          const key = url.searchParams.get("key");
          if (!key) {
            return jsonResponse({ error: "Missing 'key' parameter" }, 400);
          }

          await env.REDIS.delete(key);
          return jsonResponse({ message: "Key deleted successfully", key });
        }

        default:
          return jsonResponse({ error: `Method ${method} not allowed` }, 405);
      }
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  },
};
