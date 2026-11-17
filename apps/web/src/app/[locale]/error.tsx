'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/primitives';

/**
 * Filet d'erreur global.
 *
 * Aucun détail technique n'est affiché à l'utilisateur : l'erreur est seulement
 * journalisée dans la console. `digest` (fourni par Next.js) sert de référence
 * de corrélation et sera rapproché des journaux serveur.
 *
 * La langue est lue depuis `<html lang>` plutôt que via un hook i18n : un
 * composant d'erreur doit rester fonctionnel même quand le contexte React est
 * dégradé.
 */
const TEXT = {
  fr: { title: 'Une erreur est survenue', retry: 'Réessayer', ref: 'Référence' },
  en: { title: 'Something went wrong', retry: 'Try again', ref: 'Reference' },
} as const;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    console.error('[AffiliateOS] erreur applicative', error);
    const html = document.documentElement.lang;
    setLang(html.startsWith('en') ? 'en' : 'fr');
  }, [error]);

  const t = TEXT[lang];

  return (
    <div className="flex min-h-[60vh] items-center py-20">
      <Container size="narrow" className="text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {t.title}
        </h1>
        {error.digest ? (
          <p className="mt-4 text-sm text-fg-muted">
            {t.ref} : <code className="font-mono">{error.digest}</code>
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="tap-target mt-8 inline-flex items-center rounded-xl bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700"
        >
          {t.retry}
        </button>
      </Container>
    </div>
  );
}
