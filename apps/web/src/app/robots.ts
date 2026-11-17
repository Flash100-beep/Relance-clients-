import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * robots.txt généré.
 * Les espaces authentifiés et l'API sont explicitement fermés à l'indexation.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/advertiser', '/admin', '/onboarding'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
