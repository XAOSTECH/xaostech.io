import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';
import { applySecurityHeaders } from '../shared/types/security';
import { relaxCspForInline } from '../shared/types/csp';

const securityMiddleware: MiddlewareHandler = async (_context, next) => {
  const res = await next();
  const secured = applySecurityHeaders(res as unknown as Response);
  const headers = new Headers(secured.headers);
  relaxCspForInline(headers);
  return new Response(secured.body, {
    status: (secured as any).status || 200,
    statusText: (secured as any).statusText || undefined,
    headers,
  });
};

export const onRequest = sequence(securityMiddleware);
