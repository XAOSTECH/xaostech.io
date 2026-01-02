import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';

// Handle subdomain routing only (API proxying moved to src/pages/api/[...path].ts)
const subdomainMiddleware: MiddlewareHandler = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Direct subdomain navigation
  if (pathname.startsWith('/portfolio')) {
    const newUrl = new URL(request.url);
    newUrl.pathname = pathname.replace(/^\/portfolio/, '') || '/';
    newUrl.hostname = 'portfolio.xaostech.io';
    return fetch(new Request(newUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    }));
  }

  // Pass to next middleware or Astro
  return next();
};

export const onRequest = sequence(subdomainMiddleware);
