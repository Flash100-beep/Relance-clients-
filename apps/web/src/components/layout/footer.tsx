import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/primitives';
import { Logo } from './logo';
import { site } from '@/lib/site';

/** Pied de page commun : liens produit, solutions, ressources et mentions légales. */
export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t('product'),
      links: [
        { href: '/fonctionnalites', label: nav('features') },
        { href: '/tarifs', label: nav('pricing') },
        { href: '/comment-ca-marche', label: nav('howItWorks') },
      ],
    },
    {
      title: t('solutions'),
      links: [
        { href: '/affilies', label: nav('affiliates') },
        { href: '/annonceurs', label: nav('advertisers') },
      ],
    },
    {
      title: t('resources'),
      links: [
        { href: '/aide', label: t('helpCenter') },
        { href: '/a-propos', label: t('about') },
        { href: '/contact', label: t('contact') },
      ],
    },
    {
      title: t('legal'),
      links: [
        { href: '/cgu', label: t('terms') },
        { href: '/confidentialite', label: t('privacy') },
        { href: '/cookies', label: t('cookies') },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-surface">
      <Container size="wide" className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" aria-label="AffiliateOS">
              <Logo />
            </Link>
            <p className="text-pretty mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {t('tagline')}
            </p>
            <p className="mt-4 text-xs text-fg-muted">{t('statusNote')}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-fg">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {t('rights')}
          </p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="transition-colors hover:text-fg"
          >
            {site.contactEmail}
          </a>
        </div>
      </Container>
    </footer>
  );
}
