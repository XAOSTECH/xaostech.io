import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';
import { getSecurityHeaders } from '../shared/types/security';
import { relaxCspForInline } from '../shared/types/csp';

const securityMiddleware: MiddlewareHandler = async (_context, next) => {
  const res = await next();
  const sec = getSecurityHeaders();
  for (const k of Object.keys(sec)) {
    res.headers.set(k, sec[k]);
  }
  relaxCspForInline(res.headers);
  return res;
};

export const onRequest = sequence(securityMiddleware);
