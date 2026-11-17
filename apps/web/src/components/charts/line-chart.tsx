/**
 * Graphique en courbes — SVG écrit à la main.
 *
 * Aucune librairie de graphiques n'est embarquée : sur une connexion mobile
 * contrainte, c'est plusieurs dizaines de kilo-octets économisés.
 * Le composant est purement présentational : il ne calcule aucune statistique.
 */

export interface ChartSeries {
  name: string;
  /** Couleur CSS (var() ou hexadécimal). */
  color: string;
  values: number[];
  fill?: boolean;
}

interface LineChartProps {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  /** Nombre de lignes de grille horizontales. */
  gridLines?: number;
}

const W = 640;
const PAD = { top: 12, right: 8, bottom: 24, left: 8 };

export function LineChart({
  labels,
  series,
  height = 220,
  gridLines = 4,
}: LineChartProps) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;

  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const count = Math.max(1, labels.length - 1);

  const x = (i: number) => PAD.left + (i / count) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const toPath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  const toArea = (values: number[]) =>
    `${toPath(values)} L${x(values.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} ` +
    `L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  // N'affiche qu'une étiquette d'axe sur deux pour rester lisible sur mobile.
  const labelStep = labels.length > 8 ? 2 : 1;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={series.map((s) => s.name).join(' / ')}
        preserveAspectRatio="none"
      >
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const gy = PAD.top + (i / gridLines) * innerH;
          return (
            <line
              key={i}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={gy}
              y2={gy}
              stroke="currentColor"
              className="text-line"
              strokeWidth={1}
              strokeDasharray={i === gridLines ? undefined : '3 4'}
            />
          );
        })}

        {series.map((s) =>
          s.fill ? (
            <path key={`${s.name}-fill`} d={toArea(s.values)} fill={s.color} opacity={0.14} />
          ) : null,
        )}

        {series.map((s) => (
          <path
            key={s.name}
            d={toPath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {series.map((s) =>
          s.values.map((v, i) => (
            <circle key={`${s.name}-${i}`} cx={x(i)} cy={y(v)} r={2.6} fill={s.color} />
          )),
        )}

        {labels.map((label, i) =>
          i % labelStep === 0 ? (
            <text
              key={label + i}
              x={x(i)}
              y={height - 6}
              textAnchor="middle"
              className="fill-current text-fg-muted"
              fontSize={11}
            >
              {label}
            </text>
          ) : null,
        )}
      </svg>
    </figure>
  );
}

export function ChartLegend({ series }: { series: ChartSeries[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-4">
      {series.map((s) => (
        <li key={s.name} className="flex items-center gap-2 text-xs font-medium text-fg-muted">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          {s.name}
        </li>
      ))}
    </ul>
  );
}
