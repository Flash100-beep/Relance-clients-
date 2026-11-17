import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { site } from '@/lib/site';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Programmes d'affiliation, tracking et commissions`,
    template: `%s — ${site.name}`,
  },
  description:
    'AffiliateOS est la plateforme SaaS qui permet aux annonceurs de lancer leur programme d\'affiliation et aux affiliés de suivre chaque clic, chaque conversion et chaque commission.',
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Rendu statique par locale.
  setRequestLocale(locale);

  return (
    // `suppressHydrationWarning` : next-themes applique la classe de thème
    // avant l'hydratation, ce qui provoque sinon un avertissement React.
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-surface-muted text-fg antialiased">
        <ThemeProvider>
          {/* Fournit le contexte de locale aux composants client (navigation,
              bascule de langue). Les traductions restent côté serveur. */}
          <NextIntlClientProvider locale={locale} messages={{}}>
            <a
              href="#contenu"
              className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              {locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}
            </a>
            <Header />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
