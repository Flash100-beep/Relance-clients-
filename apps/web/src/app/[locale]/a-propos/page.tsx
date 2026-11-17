import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Section, Card, SectionHeading } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { LinkButton } from '@/components/ui/button';
import { IconCheck } from '@/components/icons';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  // Titre SEO distinct du H1 : « À propos d'AffiliateOS — AffiliateOS »
  // serait redondant une fois le suffixe du layout appliqué.
  const shortTitle = locale === 'en' ? 'About' : 'À propos';
  return pageMetadata({
    title: shortTitle,
    description: t('intro'),
    path: '/a-propos',
    locale,
  });
}

interface Principle {
  title: string;
  body: string;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const contact = await getTranslations({ locale, namespace: 'contact' });
  const principles = (t.raw('principles') as Principle[]);

  return (
    <>
      <PageHeader title={t('title')} />

      <Section>
        <Container size="narrow">
          <p className="text-pretty text-lg leading-relaxed text-fg">{t('intro')}</p>

          <h2 className="mt-12 text-2xl font-bold tracking-tight text-fg">
            {t('missionTitle')}
          </h2>
          <p className="text-pretty mt-4 leading-relaxed text-fg-muted">{t('missionBody')}</p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <SectionHeading title={t('principlesTitle')} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {principles.map((principle) => (
              <Card as="li" key={principle.title} className="h-full">
                <h3 className="text-base font-semibold text-fg">{principle.title}</h3>
                <p className="text-pretty mt-2 text-sm leading-relaxed text-fg-muted">
                  {principle.body}
                </p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <Card>
            <h2 className="text-lg font-bold text-fg">{t('statusTitle')}</h2>
            <p className="text-pretty mt-3 text-sm leading-relaxed text-fg-muted">
              {t('statusBody')}
            </p>
          </Card>

          <div className="mt-10 rounded-2xl border border-line bg-surface-raised p-6 text-center">
            <h2 className="text-lg font-bold text-fg">{t('contactTitle')}</h2>
            <p className="text-pretty mt-2 text-sm text-fg-muted">{t('contactBody')}</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton href="/contact">{contact('title')}</LinkButton>
              <a
                href={`mailto:${site.contactEmail}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <IconCheck size={16} />
                {site.contactEmail}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
