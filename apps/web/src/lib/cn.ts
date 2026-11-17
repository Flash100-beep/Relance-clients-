/**
 * Assemble des fragments de classes CSS.
 * Volontairement sans dépendance externe (pas de clsx/tailwind-merge) :
 * moins de kilo-octets envoyés au navigateur, ce qui compte sur mobile.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
