import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container, Section, SectionHeading, FeatureItem, Card, Badge } from '@/components/ui/primitives';
import { LinkButton } from '@/components/ui/button';
import { DashboardPreview } from '@/components/marketing/dashboard-preview';
import { CtaSection } from '@/components/marketing/cta-section';
import { Faq } from '@/components/marketing/faq';
import {
  IconArrowRight,
  IconChart,
  IconLink,
  IconShield,
  IconTarget,
  IconUsers,
  IconWallet,
} from '@/components/icons';
import { pageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { site } from '@/lib/site';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const meta = await getTranslations({ locale, namespace: 'meta' });
  const base = await pageMetadata({
    title: t('heroTitle'),
    description: meta('defaultDescription'),
    path: '',
    locale,
  });
  // La page d'accueil partage son segment avec le layout racine : le
  // `title.template` du layout ne s'y applique donc pas (Next.js ne l'applique
  // qu'aux segments enfants). Le suffixe est posé explicitement ici.
  return { ...base, title: { absolute: `${t('heroTitle')} — ${site.name}` } };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const aff = await getTranslations({ locale, namespace: 'affiliates' });
  const adv = await getTranslations({ locale, namespace: 'advertisers' });

  const values = [
    { icon: <IconLink size={22} />, title: t('value1Title'), body: t('value1Body') },
    { icon: <IconShield size={22} />, title: t('value2Title'), body: t('value2Body') },
    { icon: <IconTarget size={22} />, title: t('value3Title'), body: t('value3Body') },
  ];

  const steps = [
    {
      title: adv('benefit1Title'),
      body: adv('benefit1Body'),
      icon: <IconUsers size={22} />,
    },
    {
      title: aff('benefit2Title'),
      body: aff('benefit2Body'),
      icon: <IconLink size={22} />,
    },
    {
      title: aff('benefit4Title'),
      body: aff('benefit4Body'),
      icon: <IconWallet size={22} />,
    },
  ];

  const faqItems = [
    { question: adv('benefit3Title'), answer: adv('benefit3Body') },
    { question: aff('benefit3Title'), answer: aff('benefit3Body') },
    { question: t('value2Title'), answer: t('value2Body') },
  ];

  const url = `${site.url.replace(/\/$/, '')}/${locale}`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url,
    description: t('heroSubtitle'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.contactEmail,
      availableLanguage: ['fr', 'en'],
    },
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: 0,
      highPrice: 79,
      offerCount: 6,
    },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={software} />
      <JsonLd data={faq} />

      {/* ── Héro ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-0 h-[420px] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(124,58,237,0.14),transparent)]"
        />
        <Container size="wide" className="relative py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge tone="brand">{t('heroBadge')}</Badge>
              <h1 className="text-balance mt-5 text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
                {t('heroTitle')}
              </h1>
              <p className="text-pretty mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
                {t('heroSubtitle')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/inscription" size="lg">
                  {common('ctaStart')}
                  <IconArrowRight size={18} />
                </LinkButton>
                <LinkButton href="/fonctionnalites" size="lg" variant="outline">
                  {common('ctaFeatures')}
                </LinkButton>
              </div>
              <p className="mt-5 text-sm text-fg-muted">{t('heroNote')}</p>
            </div>

            <DashboardPreview />
          </div>
        </Container>
      </section>

      {/* ── Proposition de valeur ────────────────────────────── */}
      <Section>
        <Container>
          <SectionHeading title={t('valueTitle')} subtitle={t('valueSubtitle')} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <FeatureItem key={value.title} {...value} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Deux personas ────────────────────────────────────── */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading title={t('personasTitle')} subtitle={t('personasSubtitle')} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="flex flex-col">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <IconChart size={22} />
              </div>
              <h3 className="text-xl font-bold text-fg">{t('affiliateTitle')}</h3>
              <p className="text-pretty mt-2 text-sm leading-relaxed text-fg-muted">
                {t('affiliateBody')}
              </p>
              <Link
                href="/affilies"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {common('learnMore')}
                <IconArrowRight size={16} />
              </Link>
            </Card>

            <Card className="flex flex-col">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-700/25 dark:text-success-400">
                <IconUsers size={22} />
              </div>
              <h3 className="text-xl font-bold text-fg">{t('advertiserTitle')}</h3>
              <p className="text-pretty mt-2 text-sm leading-relaxed text-fg-muted">
                {t('advertiserBody')}
              </p>
              <Link
                href="/annonceurs"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {common('learnMore')}
                <IconArrowRight size={16} />
              </Link>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ── Étapes ───────────────────────────────────────────── */}
      <Section>
        <Container>
          <SectionHeading title={t('stepsTitle')} subtitle={t('stepsSubtitle')} />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card as="li" key={step.title} className="relative h-full">
                <span className="text-sm font-bold text-brand-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-fg-muted">
                    {step.icon}
                  </span>
                  <h3 className="text-base font-semibold text-fg">{step.title}</h3>
                </div>
                <p className="text-pretty mt-3 text-sm leading-relaxed text-fg-muted">
                  {step.body}
                </p>
              </Card>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading title={t('faqTitle')} subtitle={t('faqSubtitle')} />
          <div className="mt-10">
            <Faq items={faqItems} label={t('faqTitle')} />
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
