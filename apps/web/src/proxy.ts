import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Ajoute le préfixe de locale et sert la bonne langue.
 *
 * Next.js 16 remplace la convention `middleware.ts` par `proxy.ts` (même API).
 *
 * Le matcher exclut volontairement :
 *  - `api`        → API publique et webhooks (aucune locale)
 *  - `r`          → liens de tracking `/r/<code>`, publics et non localisés
 *  - `_next`, `_vercel`, et toute URL contenant un point (fichiers statiques,
 *    `sitemap.xml`, `robots.txt`)
 */
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|r/|.*\\..*).*)',
};
