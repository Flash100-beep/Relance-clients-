import { cn } from '@/lib/cn';

/**
 * Logo AffiliateOS — création originale.
 *
 * Le glyphe : un nœud central (le programme) relié à deux nœuds (les affiliés),
 * disposés en « A ». Le nœud vert figure une commission validée, le nœud violet
 * le module d'intelligence artificielle.
 */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="AffiliateOS"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="aos-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#131a2c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#aos-bg)" />
      <path
        d="M20 10 L11.5 29.5 M20 10 L28.5 29.5 M15 23.5 H25"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
      />
      <circle cx="20" cy="10" r="3.6" fill="#ffffff" />
      <circle cx="11.5" cy="29.5" r="3" fill="#22c55e" />
      <circle cx="28.5" cy="29.5" r="3" fill="#c4b5fd" />
    </svg>
  );
}

export function Logo({
  withText = true,
  className,
  size = 34,
}: {
  withText?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {withText ? (
        <span className="text-lg font-bold tracking-tight text-fg">
          Affiliate<span className="text-brand-600 dark:text-brand-400">OS</span>
        </span>
      ) : null}
    </span>
  );
}
