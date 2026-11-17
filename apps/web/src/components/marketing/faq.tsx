import { IconChevronDown } from '@/components/icons';

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Accordéon de questions fréquentes.
 *
 * Implémenté avec `<details>` / `<summary>` natifs : aucune ligne de
 * JavaScript côté client, fonctionne sans JS, accessible au clavier,
 * et compatible avec une connexion très contrainte.
 */
export function Faq({ items, label }: { items: FaqEntry[]; label: string }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-raised">
      {items.map((item, index) => (
        <details key={item.question} className="group" open={index === 0}>
          <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-fg transition-colors hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
            <span className="text-pretty">{item.question}</span>
            <IconChevronDown
              size={18}
              className="shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="text-pretty px-5 pb-5 text-sm leading-relaxed text-fg-muted">
            {item.answer}
          </p>
        </details>
      ))}
      <p className="sr-only">{label}</p>
    </div>
  );
}
