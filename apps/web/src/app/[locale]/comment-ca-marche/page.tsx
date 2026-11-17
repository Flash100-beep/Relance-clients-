import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Section, Card, SectionHeading } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { CtaSection } from '@/components/marketing/cta-section';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howItWorks' });
  return pageMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/comment-ca-marche',
    locale,
  });
}

interface Step {
  title: string;
  body: string;
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howItWorks' });

  const advertiserSteps = (t.raw('advertiserSteps') as Step[]);
  const affiliateSteps = (t.raw('affiliateSteps') as Step[]);
  const trackingSteps = (t.raw('trackingSteps') as string[]);

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-fg">{t('advertiserTrackTitle')}</h2>
              <ol className="mt-6 space-y-4 border-l-2 border-brand-200 pl-6 dark:border-brand-800">
                {advertiserSteps.map((step, index) => (
                  <li key={step.title} className="relative">
                    <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-fg">{step.title}</h3>
                    <p className="text-pretty mt-1 text-sm leading-relaxed text-fg-muted">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-bold text-fg">{t('affiliateTrackTitle')}</h2>
              <ol className="mt-6 space-y-4 border-l-2 border-success-100 pl-6 dark:border-success-700/40">
                {affiliateSteps.map((step, index) => (
                  <li key={step.title} className="relative">
                    <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-success-600 text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-fg">{step.title}</h3>
                    <p className="text-pretty mt-1 text-sm leading-relaxed text-fg-muted">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <SectionHeading
            title={t('trackingTitle')}
            subtitle={t('trackingBody')}
          />
          <ol className="mx-auto mt-10 max-w-3xl space-y-3">
            {trackingSteps.map((step, index) => (
              <Card as="li" key={index} className="flex items-start gap-4 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-fg-muted tabular-nums">
                  {index + 1}
                </span>
                <p className="text-pretty pt-1 text-sm leading-relaxed text-fg">{step}</p>
              </Card>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
