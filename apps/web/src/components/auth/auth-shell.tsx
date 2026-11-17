import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/primitives';
import { Link } from '@/i18n/navigation';
import { LogoMark } from '@/components/layout/logo';

/** Mise en page commune aux écrans d'authentification. */
export async function AuthShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const common = await getTranslations('common');
  return (
    <div className="border-b border-line bg-surface py-12 sm:py-20">
      <Container size="narrow" className="flex flex-col items-center">
        <Link href="/" aria-label="AffiliateOS">
          <LogoMark size={44} />
        </Link>
        <div className="mt-8 w-full flex justify-center">{children}</div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-fg-muted">
          {footer}
          <Link href="/" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
            {common('backHome')}
          </Link>
        </div>
      </Container>
    </div>
  );
}
