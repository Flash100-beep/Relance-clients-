import { getTranslations } from 'next-intl/server';
import { ChartLegend, LineChart } from '@/components/charts/line-chart';
import { Badge } from '@/components/ui/primitives';
import { demoTraffic } from '@/fixtures/demo';
import { IconCheck } from '@/components/icons';

/**
 * Aperçu du tableau de bord affilié, affiché sur la page d'accueil.
 *
 * Choix délibéré : cette illustration est un VRAI composant React, pas une
 * image générée. Elle reste nette à toute résolution, ne pèse presque rien,
 * et ses valeurs viennent de `fixtures/demo.ts` — clairement étiquetées comme
 * démonstration, conformément à l'interdiction d'inventer des statistiques.
 */
export async function DashboardPreview() {
  const t = await getTranslations('home');
  const common = await getTranslations('common');

  const stats = [
    { label: t('previewClicks'), value: '2 800' },
    { label: t('previewConversions'), value: '158' },
    { label: t('previewRate'), value: '5,6 %' },
    { label: t('previewCommissions'), value: '4 250 $' },
  ];

  const series = [
    {
      name: t('previewSeriesClicks'),
      color: 'var(--color-brand-500)',
      values: demoTraffic.map((d) => d.clicks),
      fill: true,
    },
    {
      name: t('previewSeriesConversions'),
      color: 'var(--color-success-500)',
      values: demoTraffic.map((d) => d.conversions),
    },
  ];

  return (
    <div className="relative">
      {/* Halo décoratif */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-500/20 via-transparent to-success-500/10 blur-2xl"
      />

      <div className="rounded-2xl border border-line bg-surface-raised p-4 shadow-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-fg">{t('previewTitle')}</h3>
            <p className="mt-0.5 text-xs text-fg-muted">{t('previewChartTitle')}</p>
          </div>
          <Badge tone="brand">
            <span className="inline-flex items-center gap-1">
              <IconCheck size={12} />
              AffiliateOS AI
            </span>
          </Badge>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-line bg-surface-muted px-3 py-3"
            >
              <dt className="text-[11px] font-medium tracking-wide text-fg-muted uppercase">
                {stat.label}
              </dt>
              <dd className="mt-1 text-xl font-bold text-fg tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <LineChart
            labels={demoTraffic.map((d) => d.day)}
            series={series}
            height={200}
          />
          <div className="mt-3">
            <ChartLegend series={series} />
          </div>
        </div>

        <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-fg-muted">
          {common('demoData')}
        </p>
      </div>
    </div>
  );
}
