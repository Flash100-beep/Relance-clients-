import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { buildAuthLabels } from '@/lib/auth-labels';
import { pageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return pageMetadata({
    title: t('loginTitle'),
    description: t('loginSubtitle'),
    path: '/connexion',
    locale,
  });
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  const labels = await buildAuthLabels(locale);

  return (
    <AuthShell
      footer={
        <>
          <span>
            {labels.noAccount}{' '}
            <Link
              href="/inscription"
              className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {labels.submitSignup}
            </Link>
          </span>
          <Link
            href="/mot-de-passe-oublie"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {labels.forgotLink}
          </Link>
        </>
      }
    >
      <AuthForm mode="login" labels={labels} />
    </AuthShell>
  );
}
