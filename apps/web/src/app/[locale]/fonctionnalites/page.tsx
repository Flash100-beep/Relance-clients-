import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHeading, FeatureItem, Card, Badge } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { CtaSection } from '@/components/marketing/cta-section';
import {
  IconChart,
  IconCheck,
  IconCode,
  IconLink,
  IconShield,
  IconSparkles,
  IconUsers,
  IconWallet,
} from '@/components/icons';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'features' });
  return pageMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/fonctionnalites',
    locale,
  });
}

interface FeatureBlock {
  title: string;
  body: string;
}

export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'features' });
  const common = await getTranslations({ locale, namespace: 'common' });

  const blocks: {
    key: string;
    heading: string;
    body: string;
    icon: ReactNode;
    items: FeatureBlock[];
  }[] = [
    {
      key: 'tracking',
      heading: t('trackingTitle'),
      body: t('trackingBody'),
      icon: <IconLink size={22} />,
      items: (t.raw('tracking') as FeatureBlock[]),
    },
    {
      key: 'commissions',
      heading: t('commissionsTitle'),
      body: t('commissionsBody'),
      icon: <IconChart size={22} />,
      items: (t.raw('commissions') as FeatureBlock[]),
    },
    {
      key: 'payments',
      heading: t('paymentsTitle'),
      body: t('paymentsBody'),
      icon: <IconWallet size={22} />,
      items: (t.raw('payments') as FeatureBlock[]),
    },
    {
      key: 'ai',
      heading: t('aiTitle'),
      body: t('aiBody'),
      icon: <IconSparkles size={22} />,
      items: (t.raw('ai') as FeatureBlock[]),
    },
    {
      key: 'admin',
      heading: t('adminTitle'),
      body: t('adminBody'),
      icon: <IconUsers size={22} />,
      items: (t.raw('admin') as FeatureBlock[]),
    },
    {
      key: 'api',
      heading: t('apiTitle'),
      body: t('apiBody'),
      icon: <IconCode size={22} />,
      items: (t.raw('api') as FeatureBlock[]),
    },
  ];

  const security = (t.raw('security') as FeatureBlock[]);
  const available = (t.raw('roadmapAvailable') as string[]);
  const planned = (t.raw('roadmapPlanned') as string[]);

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {blocks.map((block, index) => (
        <Section key={block.key} className={index % 2 === 1 ? 'bg-surface' : undefined}>
          <Container>
            <div className="mb-10 flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                {block.icon}
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                  {block.heading}
                </h2>
                <p className="text-pretty mt-2 max-w-2xl text-fg-muted">{block.body}</p>
              </div>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {block.items.map((item) => (
                <FeatureItem
                  key={item.title}
                  icon={<IconCheck size={18} />}
                  title={item.title}
                  body={item.body}
                />
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {/* Sécurité */}
      <Section className="bg-ink-900">
        <Container>
          <div className="mb-10 max-w-2xl">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-brand-300">
              <IconShield size={22} />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t('securityTitle')}
            </h2>
            <p className="text-pretty mt-2 text-ink-200">{t('securityBody')}</p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {security.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-pretty mt-2 text-sm leading-relaxed text-ink-200">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Feuille de route — transparence sur le périmètre réel */}
      <Section>
        <Container>
          <SectionHeading title={t('roadmapTitle')} subtitle={t('roadmapBody')} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card>
              <Badge tone="success">{common('availableLabel')}</Badge>
              <ul className="mt-5 space-y-3">
                {available.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-fg">
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-success-600 dark:text-success-400"
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <Badge tone="neutral">{common('roadmapLabel')}</Badge>
              <ul className="mt-5 space-y-3">
                {planned.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fg-muted" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
