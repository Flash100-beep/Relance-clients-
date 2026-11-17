'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Thème clair / sombre.
 * `attribute="class"` : la classe `.dark` pilote les jetons CSS définis dans
 * `globals.css`. `disableTransitionOnChange` évite un flash de transition
 * au chargement de la page.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
