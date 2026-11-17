import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage, LegalSections } from '@/components/legal/legal-page';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  const meta = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    title: t('cookiesTitle'),
    description: `${meta('defaultDescription')} ${t('cookiesTitle')}.`,
    path: '/cookies',
    locale,
  });
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale === 'en' ? 'en' : 'fr';
  return (
    <>
      <LegalPage docKey="cookies" locale={loc} />
      <LegalSections docKey="cookies" locale={loc} />
    </>
  );
}
