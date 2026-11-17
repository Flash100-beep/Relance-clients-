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
    title: t('signupTitle'),
    description: t('signupSubtitle'),
    path: '/inscription',
    locale,
  });
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  const labels = await buildAuthLabels(locale);

  return (
    <AuthShell
      footer={
        <>
          <span>
            {labels.haveAccount}{' '}
            <Link
              href="/connexion"
              className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              {labels.submitLogin}
            </Link>
          </span>
        </>
      }
    >
      <AuthForm mode="signup" labels={labels} />
    </AuthShell>
  );
}
