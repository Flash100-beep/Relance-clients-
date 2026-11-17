import { defineRouting } from 'next-intl/routing';

/**
 * Configuration i18n.
 * `localePrefix: 'always'` → /fr/… et /en/… sont deux jeux d'URL distincts,
 * indexables séparément avec des hreflang corrects.
 */
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
});
