import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Section, Card } from '@/components/ui/primitives';
import { PageHeader } from '@/components/marketing/page-header';
import { ContactForm } from '@/components/contact/contact-form';
import { IconClock, IconMail } from '@/components/icons';
import { site } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return pageMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4">
              <Card>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <IconMail size={20} />
                </div>
                <h2 className="text-sm font-semibold text-fg">{t('emailLabel')}</h2>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="mt-1 block text-sm break-all text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  {site.contactEmail}
                </a>
              </Card>

              <Card>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-700/25 dark:text-success-400">
                  <IconClock size={20} />
                </div>
                <p className="text-pretty text-sm text-fg-muted">{t('responseNote')}</p>
              </Card>
            </div>

            <ContactForm
              to={site.contactEmail}
              labels={{
                formTitle: t('formTitle'),
                name: t('name'),
                email: t('email'),
                subject: t('subject'),
                message: t('message'),
                submit: t('submit'),
                mailNote: t('mailNote'),
                options: {
                  sales: t('subjectOptions.sales'),
                  support: t('subjectOptions.support'),
                  partnership: t('subjectOptions.partnership'),
                  other: t('subjectOptions.other'),
                },
              }}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
