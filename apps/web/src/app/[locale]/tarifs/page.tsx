import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Section, SectionHeading, Card } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { CtaSection } from '@/components/marketing/cta-section';
import { Pricing } from '@/components/marketing/pricing';
import { Faq } from '@/components/marketing/faq';
import { IconCheck, IconInfo } from '@/components/icons';
import { pageMetadata } from '@/lib/seo';
import { advertiserPlans, affiliatePlans, type ResolvedPlan } from '@/lib/site';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return pageMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/tarifs',
    locale,
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const common = await getTranslations({ locale, namespace: 'common' });

  const faqItems = [
    { question: t('compareTitle'), answer: t('compareBody') },
    { question: t('affiliateProName'), answer: t('affiliateProF2') },
    { question: t('advertiserBusinessName'), answer: t('advertiserBusinessF3') },
  ];

  const compareItems = (t.raw('compareItems') as string[]);

  // Traduction résolue côté serveur : on ne transmet au composant client
  // que des données sérialisables, jamais de fonction.
  const resolve = (
    plans: readonly {
      code: string;
      nameKey: string;
      featureKeys: string[];
      monthlyUsd: number | null;
      annualDiscountPercent: number;
      highlighted?: boolean;
    }[],
  ): ResolvedPlan[] =>
    plans.map((plan) => ({
      code: plan.code,
      name: t(plan.nameKey),
      features: plan.featureKeys.map((key) => t(key)),
      monthlyUsd: plan.monthlyUsd,
      annualDiscountPercent: plan.annualDiscountPercent,
      highlighted: plan.highlighted,
      isCustom: plan.monthlyUsd === null,
    }));

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <Container size="wide">
          <Pricing
            locale={locale}
            affiliatePlans={resolve(affiliatePlans)}
            advertiserPlans={resolve(advertiserPlans)}
            labels={{
              affiliatesTab: t('affiliatesTab'),
              advertisersTab: t('advertisersTab'),
              included: t('included'),
              monthly: common('monthly'),
              annual: common('annual'),
              annualSave: common('annualSave'),
              popular: common('popular'),
              custom: common('custom'),
              perMonth: common('perMonth'),
              ctaStart: common('ctaStart'),
              ctaContact: common('ctaContact'),
            }}
          />

          <div className="mt-8 flex gap-3 rounded-xl border border-line bg-surface-raised p-4 text-sm text-fg-muted">
            <IconInfo size={18} className="mt-0.5 shrink-0 text-brand-500" />
            <div className="space-y-1">
              <p className="text-pretty">{common('pricingDisclaimer')}</p>
              <p className="text-pretty">{common('billingCurrencyNote')}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <SectionHeading title={t('compareTitle')} subtitle={t('compareBody')} />
          <Card className="mx-auto mt-10 max-w-3xl">
            <ul className="grid gap-3 sm:grid-cols-2">
              {compareItems.map((item) => (
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
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title={t('faqTitle')} />
          <div className="mt-10">
            <Faq items={faqItems} label={t('faqTitle')} />
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
