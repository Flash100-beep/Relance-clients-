'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { IconGlobe } from '@/components/icons';
import { cn } from '@/lib/cn';

/**
 * Changement de langue sans rechargement complet.
 * `router.replace` conserve la page courante et échange simplement le préfixe.
 */
export function LocaleSwitch({
  current,
  labels,
}: {
  current: string;
  labels: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const other = current === 'fr' ? 'en' : 'fr';

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          router.replace(pathname, { locale: other });
        })
      }
      aria-label={labels.switchLanguage}
      title={labels.switchLanguage}
      className={cn(
        'tap-target inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface',
        'px-3 text-sm font-semibold text-fg-muted transition-colors',
        'hover:bg-surface-muted hover:text-fg disabled:opacity-50',
      )}
    >
      <IconGlobe size={18} />
      <span className="uppercase">{other}</span>
    </button>
  );
}
