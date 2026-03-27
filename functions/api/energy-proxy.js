export async function onRequest({ request }) {
    const url = new URL(request.url);
    let target = url.searchParams.get("target");

    if (!target) {
        return new Response("Missing target parameter", { status: 400 });
    }

    // 1. Check Cloudflare's Edge Cache first
    const cache = caches.default;
    const cacheKey = new Request(target, request);
    let cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
        // Return cached response instantly without hitting Energy-Charts
        return cachedResponse;
    }

    try {
        const targetUrl = new URL(target);
        url.searchParams.forEach((val, key) => {
            if (key !== 'target') targetUrl.searchParams.append(key, val);
        });

        // 2. Add a User-Agent so Energy-Charts doesn't block you as a generic bot
        const response = await fetch(targetUrl.toString(), {
            headers: {
                "User-Agent": "AstroEnergyDashboard/1.0 (Contact: your@email.com)",
                "Accept": "application/json"
            }
        });

        // If it's a 429, pass it back immediately so the frontend retry logic can handle it
        if (response.status === 429) {
            return new Response("Rate Limited", { status: 429, headers: { "Access-Control-Allow-Origin": "*" }});
        }

        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Access-Control-Allow-Origin", "*");
        newResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");

        // 3. Cache successful responses in Cloudflare
        if (response.ok) {
            const isHistorical = target.includes("start=") && target.includes("end=");
            const cacheTime = isHistorical ? 604800 : 7200; // 7 days for historical, 2 hours for today

            newResponse.headers.set("Cache-Control", `public, max-age=${cacheTime}`);

            // Store it in the Edge Cache for the next visitor!
            await cache.put(cacheKey, newResponse.clone());
        }

        return newResponse;

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Access-Control-Allow-Origin": "*" }
        });
    }
}