import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Section, FeatureItem } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { CtaSection } from '@/components/marketing/cta-section';
import { IconChart, IconLink, IconTarget, IconWallet } from '@/components/icons';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'affiliates' });
  return pageMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/affilies',
    locale,
  });
}

export default async function AffiliatesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'affiliates' });

  const benefits = [
    { icon: <IconTarget size={22} />, title: t('benefit1Title'), body: t('benefit1Body') },
    { icon: <IconLink size={22} />, title: t('benefit2Title'), body: t('benefit2Body') },
    { icon: <IconChart size={22} />, title: t('benefit3Title'), body: t('benefit3Body') },
    { icon: <IconWallet size={22} />, title: t('benefit4Title'), body: t('benefit4Body') },
  ];

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <FeatureItem key={benefit.title} {...benefit} />
            ))}
          </ul>
        </Container>
      </Section>

      <CtaSection title={t('ctaTitle')} body={t('ctaBody')} />
    </>
  );
}
