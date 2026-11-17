import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/primitives';
import { LinkButton } from '@/components/ui/button';
import { LogoMark } from '@/components/layout/logo';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="flex min-h-[60vh] items-center bg-surface-muted py-20">
      <Container size="narrow" className="text-center">
        <div className="flex justify-center">
          <LogoMark size={48} />
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-brand-600 uppercase dark:text-brand-400">
          404
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {t('notFoundTitle')}
        </h1>
        <p className="text-pretty mx-auto mt-4 max-w-md text-fg-muted">{t('notFoundBody')}</p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/">{t('backHome')}</LinkButton>
          <Link
            href="/aide"
            className="inline-flex items-center text-sm font-semibold text-fg-muted hover:text-fg"
          >
            {t('ctaFeatures')}
          </Link>
        </div>
      </Container>
    </div>
  );
}
