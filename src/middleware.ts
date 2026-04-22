import type { MiddlewareHandler } from 'astro';
import { sequence } from 'astro:middleware';
import { getSecurityHeaders } from '../shared/types/security';
import { relaxCspForInline } from '../shared/types/csp';

const securityMiddleware: MiddlewareHandler = async (_context, next) => {
  const res = await next();
  // skipCsp: Astro emits its own CSP via security.csp in astro.config.mjs.
  const sec = getSecurityHeaders({ skipCsp: true });
  for (const k of Object.keys(sec)) {
    res.headers.set(k, sec[k]);
  }
  // relaxCspForInline becomes a no-op now (no CSP header from us); kept
  // for safety in case Astro emits one we still want to mutate.
  relaxCspForInline(res.headers);
  return res;
};

export const onRequest = sequence(securityMiddleware);
