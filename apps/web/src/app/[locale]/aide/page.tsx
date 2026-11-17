import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Section, Card } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { HelpSearch, type HelpItem } from '@/components/help/help-search';
import { LinkButton } from '@/components/ui/button';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return pageMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/aide',
    locale,
  });
}

interface RawItem {
  category: string;
  question: string;
  answer: string;
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  const contact = await getTranslations({ locale, namespace: 'contact' });

  const items: HelpItem[] = (t.raw('items') as RawItem[]).map((item) => ({
    category: item.category,
    categoryLabel: t(`categories.${item.category}`),
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <Container size="narrow">
          <HelpSearch
            items={items}
            placeholder={t('searchPlaceholder')}
            noResult={t('noResult')}
            allLabel={t('allCategories')}
          />

          <Card className="mt-10 text-center">
            <h2 className="text-lg font-bold text-fg">{t('contactTitle')}</h2>
            <p className="text-pretty mt-2 text-sm text-fg-muted">{t('contactBody')}</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton href="/contact">{contact('title')}</LinkButton>
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {site.contactEmail}
              </a>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
