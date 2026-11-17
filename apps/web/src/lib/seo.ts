import { site } from '@/lib/site';

interface SeoInput {
  title: string;
  description: string;
  /** Chemin sans préfixe de locale, ex. `/tarifs`. Pour l'accueil : `''`. */
  path: string;
  locale: string;
}

/**
 * Construit les métadonnées d'une page : titre, description, canonical,
 * hreflang (fr/en/x-default), Open Graph et Twitter Card.
 *
 * Les URL sont construites à partir de `NEXT_PUBLIC_SITE_URL` : en
 * développement elles pointent vers localhost, en production vers le domaine
 * réel, sans qu'aucune URL ne soit codée en dur dans les pages.
 */
export async function pageMetadata({ title, description, path, locale }: SeoInput) {
  const urlFor = (loc: string) =>
    `${site.url.replace(/\/$/, '')}/${loc}${path === '/' ? '' : path}`;

  const canonical = urlFor(locale);

  return {
    // Titre nu : c'est le `title.template` du layout racine qui ajoute
    // « — AffiliateOS ». L'ajouter aussi ici produisait un suffixe doublé.
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: urlFor('fr'),
        en: urlFor('en'),
        'x-default': urlFor(site.defaultLocale),
      },
    },
    openGraph: {
      type: 'website' as const,
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url: canonical,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${title} — ${site.name}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
