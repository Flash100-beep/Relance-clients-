/**
 * DONNÉES DE DÉMONSTRATION.
 *
 * Ces valeurs servent uniquement à illustrer l'interface dans les maquettes.
 * Elles ne proviennent d'aucune base de données, ne correspondent à aucun
 * client réel et ne doivent jamais être présentées comme des statistiques.
 *
 * Quand les tableaux de bord seront branchés (étape 5), ce fichier ne sera
 * plus importé par les pages de production.
 */

export const demoLabel = 'demo' as const;

/** 14 jours de clics et de conversions, purement illustratifs. */
export const demoTraffic: { day: string; clicks: number; conversions: number }[] = [
  { day: '01', clicks: 120, conversions: 4 },
  { day: '02', clicks: 148, conversions: 6 },
  { day: '03', clicks: 96, conversions: 3 },
  { day: '04', clicks: 172, conversions: 8 },
  { day: '05', clicks: 205, conversions: 11 },
  { day: '06', clicks: 164, conversions: 7 },
  { day: '07', clicks: 138, conversions: 5 },
  { day: '08', clicks: 221, conversions: 13 },
  { day: '09', clicks: 248, conversions: 15 },
  { day: '10', clicks: 190, conversions: 9 },
  { day: '11', clicks: 263, conversions: 18 },
  { day: '12', clicks: 234, conversions: 14 },
  { day: '13', clicks: 289, conversions: 21 },
  { day: '14', clicks: 312, conversions: 24 },
];

/** Libellés d'axes, indépendants de la langue (format jour court). */
export const demoStats = {
  clicks: 2800,
  conversions: 158,
  conversionRate: 5.6,
  commissions: 4250,
} as const;

/** Programmes fictifs utilisés dans les aperçus d'interface. */
export const demoPrograms = [
  { name: 'Programme A', clicks: 980, conversions: 62 },
  { name: 'Programme B', clicks: 740, conversions: 41 },
  { name: 'Programme C', clicks: 610, conversions: 33 },
] as const;
