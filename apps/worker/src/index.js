function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase();
}

function cacheKeyFor(query) {
  return new Request(`https://edgewatch.cache/search:${encodeURIComponent(query)}`);
}

function jsonResponse(body, { status = 200, cacheStatus }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      "X-Cache-Status": cacheStatus,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/search") {
      return new Response("Not Found", { status: 404 });
    }

    const query = normalizeQuery(url.searchParams.get("q"));
    const cache = caches.default;
    const cacheKey = cacheKeyFor(query);

    const cached = await cache.match(cacheKey);
    if (cached) {
      const hit = new Response(cached.body, cached);
      hit.headers.set("X-Cache-Status", "HIT");
      return hit;
    }

    const originUrl = `${env.ORIGIN_URL}/search?q=${encodeURIComponent(query)}`;
    const originRes = await fetch(originUrl);
    const body = await originRes.json();

    const miss = jsonResponse(body, {
      status: originRes.status,
      cacheStatus: "MISS",
    });

    await cache.put(cacheKey, miss.clone());
    return miss;
  },
};