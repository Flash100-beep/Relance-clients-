'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '@/components/icons';
import { cn } from '@/lib/cn';

/**
 * Bascule clair / sombre.
 *
 * `mounted` est indispensable : next-themes ne connaît le thème réel qu'au
 * montage côté client. Sans cette garde, le serveur et le client rendraient
 * deux icônes différentes et React signalerait une erreur d'hydratation.
 */
export function ThemeToggle({
  labels,
  className,
}: {
  labels: { toggle: string; light: string; dark: string };
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={labels.toggle}
      title={isDark ? labels.light : labels.dark}
      className={cn(
        'tap-target inline-flex items-center justify-center rounded-xl border border-line',
        'bg-surface text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg',
        className ?? 'h-11 w-11',
      )}
    >
      {/* Avant le montage : espace réservé de la même taille, aucun flash. */}
      {mounted ? (
        isDark ? (
          <IconSun size={18} />
        ) : (
          <IconMoon size={18} />
        )
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
