import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * Sitemap XML généré.
 *
 * Ne contient que des pages publiques réellement rendues : les espaces
 * authentifiés (tableau de bord, annonceur, administration) et l'API en sont
 * exclus, conformément à `robots.ts`.
 *
 * Quand les programmes publiés existeront en base (étape 5), leurs fiches
 * publiques seront ajoutées ici dynamiquement.
 */

const PUBLIC_PATHS = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/fonctionnalites', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/tarifs', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/affilies', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/annonceurs', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/comment-ca-marche', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/aide', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/a-propos', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/inscription', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: '/connexion', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/cgu', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/confidentialite', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, '');
  const lastModified = new Date();

  return site.locales.flatMap((locale) =>
    PUBLIC_PATHS.map((entry) => ({
      url: `${base}/${locale}${entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          site.locales.map((other) => [other, `${base}/${other}${entry.path}`]),
        ),
      },
    })),
  );
}
