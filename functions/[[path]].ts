import { handleQwik } from "../workers-site/build";

export const onRequest = ({ request, next, waitUntil }) => {
  const url = new URL(request.url);

  if (/\.\w+$/.test(url.pathname)) {
    // If path ends with extension, serve static file
    return next();
  }

  // Otherwise Server side render qwik
  return handleQwik({ waitUntil }, request);
};
