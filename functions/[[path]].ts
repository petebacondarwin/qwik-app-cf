import { renderApp } from "../build/index.server";
import symbols from "../build/q-symbols.json";

const CACHING = true;

export function onRequest({ request, next, waitUntil }) {
  // If path ends with extension, serve static file
  const url = new URL(request.url);
  if (/\.\w+$/.test(url.pathname)) {
    return next();
  }

  // Otherwise render the request on the server (SSR).
  return handleQwik({ waitUntil }, request);
}

async function handleQwik(event: any, request: Request) {
  const cache = await caches.open("custom:qwik");
  if (CACHING) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  const ssrResult = await renderApp({
    url: new URL(request.url),
    symbols,
  });

  const response = new Response(ssrResult.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": `max-age=${60}`,
    },
  });
  if (CACHING) {
    event.waitUntil(cache.put(request, response.clone()));
  }
  return response;
}
