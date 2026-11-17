import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Versions localisées des primitives de navigation Next.js.
 * À utiliser à la place de `next/link` et `next/navigation` dans toute
 * l'application, afin que le préfixe de locale soit toujours correct.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
