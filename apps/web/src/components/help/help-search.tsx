'use client';

import { useMemo, useState } from 'react';
import { IconChevronDown, IconSearch } from '@/components/icons';
import { cn } from '@/lib/cn';

export interface HelpItem {
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
}

/**
 * Recherche du centre d'aide.
 *
 * Le filtrage est purement côté client sur une liste déjà rendue côté serveur :
 * les réponses restent présentes dans le HTML, donc indexables et accessibles
 * même si JavaScript est désactivé.
 */
export function HelpSearch({
  items,
  placeholder,
  noResult,
  allLabel,
}: {
  items: HelpItem[];
  placeholder: string;
  noResult: string;
  allLabel: string;
}) {
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of items) seen.set(item.category, item.categoryLabel);
    return [...seen.entries()];
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const normalise = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filtered = useMemo(() => {
    const q = normalise(query.trim());
    return items.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!q) return true;
      return (
        normalise(item.question).includes(q) || normalise(item.answer).includes(q)
      );
    });
  }, [items, query, activeCategory]);

  return (
    <div>
      <div className="relative">
        <IconSearch
          size={18}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="tap-target w-full rounded-xl border border-line bg-surface-raised py-3 pr-4 pl-11 text-sm text-fg placeholder:text-fg-muted"
        />
      </div>

      <div
        role="group"
        className="mt-4 flex flex-wrap gap-2"
      >
        <FilterChip
          text={allLabel}
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        {categories.map(([key, label]) => (
          <FilterChip
            key={key}
            text={label}
            active={activeCategory === key}
            onClick={() => setActiveCategory(key)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-surface-raised p-6 text-sm text-fg-muted">
          {noResult}
        </p>
      ) : (
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-raised">
          {filtered.map((item) => (
            <details key={item.question} className="group">
              <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-fg transition-colors hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-fg-muted">
                    {item.categoryLabel}
                  </span>
                  <span className="text-pretty">{item.question}</span>
                </span>
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
        </div>
      )}
    </div>
  );
}

function FilterChip({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'tap-target rounded-full border px-3.5 text-xs font-semibold transition-colors',
        active
          ? 'border-brand-500 bg-brand-600 text-white'
          : 'border-line bg-surface-raised text-fg-muted hover:text-fg',
      )}
    >
      {text}
    </button>
  );
}
