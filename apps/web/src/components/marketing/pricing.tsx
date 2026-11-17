'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { IconCheck } from '@/components/icons';
import { Badge, Card } from '@/components/ui/primitives';
import { buttonClasses } from '@/components/ui/button';
import { effectiveMonthlyPrice, formatUsd, type PlanInterval, type ResolvedPlan } from '@/lib/site';
import { cn } from '@/lib/cn';

/**
 * Grille tarifaire interactive.
 *
 * Ce composant ne reçoit QUE des données déjà traduites et sérialisables :
 * aucune fonction de traduction ne traverse la frontière serveur/client
 * (interdit par React Server Components).
 */
export function Pricing({
  labels,
  affiliatePlans,
  advertiserPlans,
  locale,
}: {
  labels: {
    affiliatesTab: string;
    advertisersTab: string;
    included: string;
    monthly: string;
    annual: string;
    annualSave: string;
    popular: string;
    custom: string;
    perMonth: string;
    ctaStart: string;
    ctaContact: string;
  };
  affiliatePlans: ResolvedPlan[];
  advertiserPlans: ResolvedPlan[];
  locale: string;
}) {
  const [audience, setAudience] = useState<'affiliate' | 'advertiser'>('affiliate');
  const [interval, setInterval] = useState<PlanInterval>('month');

  const plans = audience === 'affiliate' ? affiliatePlans : advertiserPlans;

  return (
    <div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div
          role="tablist"
          aria-label="Audience"
          className="inline-flex rounded-xl border border-line bg-surface-muted p-1"
        >
          {(
            [
              { id: 'affiliate', label: labels.affiliatesTab },
              { id: 'advertiser', label: labels.advertisersTab },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={audience === tab.id}
              onClick={() => setAudience(tab.id)}
              className={cn(
                'tap-target rounded-lg px-4 text-sm font-semibold transition-colors',
                audience === tab.id
                  ? 'bg-surface text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-2">
          <div
            role="group"
            className="inline-flex rounded-xl border border-line bg-surface-muted p-1"
          >
            {(
              [
                { id: 'month', label: labels.monthly },
                { id: 'year', label: labels.annual },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={interval === option.id}
                onClick={() => setInterval(option.id)}
                className={cn(
                  'tap-target rounded-lg px-4 text-sm font-semibold transition-colors',
                  interval === option.id
                    ? 'bg-surface text-fg shadow-sm'
                    : 'text-fg-muted hover:text-fg',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {interval === 'year' ? <Badge tone="success">{labels.annualSave}</Badge> : null}
        </div>
      </div>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.code} plan={plan} interval={interval} locale={locale} labels={labels} />
        ))}
      </ul>
    </div>
  );
}

function PlanCard({
  plan,
  interval,
  locale,
  labels,
}: {
  plan: ResolvedPlan;
  interval: PlanInterval;
  locale: string;
  labels: {
    included: string;
    popular: string;
    custom: string;
    perMonth: string;
    annualSave: string;
    ctaStart: string;
    ctaContact: string;
  };
}) {
  const price = effectiveMonthlyPrice(plan, interval);

  return (
    <Card
      as="li"
      className={cn(
        'relative flex h-full flex-col',
        plan.highlighted && 'border-brand-500 ring-2 ring-brand-500/25',
      )}
    >
      {plan.highlighted ? (
        <div className="absolute -top-3 left-6">
          <Badge tone="brand">{labels.popular}</Badge>
        </div>
      ) : null}

      <h3 className="text-lg font-bold text-fg">{plan.name}</h3>

      <p className="mt-4 flex items-baseline gap-1">
        {price === null ? (
          <span className="text-3xl font-bold text-fg">{labels.custom}</span>
        ) : (
          <>
            <span className="text-4xl font-bold text-fg tabular-nums">
              {formatUsd(price, locale)}
            </span>
            <span className="text-sm font-medium text-fg-muted">{labels.perMonth}</span>
          </>
        )}
      </p>

      {price !== null && interval === 'year' && plan.annualDiscountPercent > 0 ? (
        <p className="mt-1 text-xs text-success-600 dark:text-success-400">{labels.annualSave}</p>
      ) : null}

      <h4 className="mt-6 text-xs font-semibold tracking-wide text-fg-muted uppercase">
        {labels.included}
      </h4>
      <ul className="mt-3 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-fg">
            <IconCheck size={16} className="mt-0.5 shrink-0 text-success-600 dark:text-success-400" />
            <span className="text-pretty">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Link
          href={plan.isCustom ? '/contact' : '/inscription'}
          className={buttonClasses(plan.highlighted ? 'primary' : 'outline', 'md', 'w-full')}
        >
          {plan.isCustom ? labels.ctaContact : labels.ctaStart}
        </Link>
      </div>
    </Card>
  );
}
