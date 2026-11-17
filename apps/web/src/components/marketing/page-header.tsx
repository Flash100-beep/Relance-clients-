import type { ReactNode } from 'react';
import { Badge, Container } from '@/components/ui/primitives';

/** En-tête de page intérieure, commun à toutes les pages commerciales. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  badge,
}: {
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(124,58,237,0.12),transparent)]"
      />
      <Container className="relative py-14 sm:py-20">
        <div className="max-w-3xl">
          {badge ? <Badge tone="brand">{badge}</Badge> : null}
          {eyebrow ? (
            <p className="mt-4 text-sm font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance mt-3 text-3xl font-bold tracking-tight text-fg sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-pretty mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
