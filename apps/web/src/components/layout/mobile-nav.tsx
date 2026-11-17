'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { IconClose, IconMenu } from '@/components/icons';
import { buttonClasses } from '@/components/ui/button';

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Navigation mobile.
 * Le panneau est rendu uniquement quand il est ouvert : aucun nœud inutile,
 * et la fermeture restaure le défilement de la page.
 */
export function MobileNav({
  items,
  labels,
  loginHref,
  signupHref,
  localeSwitch,
  themeToggle,
}: {
  items: NavItem[];
  labels: { open: string; close: string; login: string; signup: string };
  loginHref: string;
  signupHref: string;
  localeSwitch: ReactNode;
  themeToggle: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Empêche le défilement de l'arrière-plan quand le panneau est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Fermeture à la touche Échap — accessibilité clavier.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="tap-target inline-flex items-center justify-center rounded-xl border border-line bg-surface text-fg lg:hidden"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <IconMenu size={20} />
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-surface lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={labels.open}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-semibold text-fg">{labels.open}</span>
            <button
              type="button"
              className="tap-target inline-flex items-center justify-center rounded-xl border border-line text-fg"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
            >
              <IconClose size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="tap-target flex items-center rounded-xl px-3 text-base font-medium text-fg hover:bg-surface-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-line px-4 py-4">
            <div className="flex items-center gap-2">
              {localeSwitch}
              {themeToggle}
            </div>
            <Link
              href={loginHref}
              onClick={() => setOpen(false)}
              className={buttonClasses('outline', 'lg', 'w-full')}
            >
              {labels.login}
            </Link>
            <Link
              href={signupHref}
              onClick={() => setOpen(false)}
              className={buttonClasses('primary', 'lg', 'w-full')}
            >
              {labels.signup}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
