/**
 * Configuration publique du site.
 *
 * Rien ici n'est un secret : ce fichier est compilé dans le bundle navigateur.
 * Toute valeur sensible (clé service_role, clés de paiement, clés IA) vit
 * exclusivement côté serveur et dans .env — jamais dans ce fichier.
 */

const env = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
};

export const site = {
  name: 'AffiliateOS',
  /** À remplacer par le domaine réel avant la mise en production. */
  url: env('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  /** Canal de contact — à configurer dans .env avant la mise en production. */
  contactEmail: env('NEXT_PUBLIC_CONTACT_EMAIL', 'contact@affiliateos.app'),
  /**
   * Devise de facturation de la plateforme.
   * Les prix en EUR / FCFA ne seront affichés qu'après configuration d'un taux
   * de change réel : AffiliateOS n'invente aucun taux.
   */
  billingCurrency: 'USD' as const,
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr' as const,
} as const;

export type Locale = (typeof site.locales)[number];

/**
 * Plans commerciaux.
 *
 * Ces montants sont des HYPOTHÈSES de travail fournies par le cahier des
 * charges. En production ils proviendront de la table `plans` et seront
 * modifiables depuis l'administration, sans redéploiement.
 */
export type PlanInterval = 'month' | 'year';

export interface Plan {
  code: string;
  /** Clé i18n du nom, dans le namespace `pricing`. */
  nameKey: string;
  /** Prix mensuel en USD. `null` = tarif sur mesure. */
  monthlyUsd: number | null;
  /** Remise annuelle en pourcentage, appliquée au mensuel. */
  annualDiscountPercent: number;
  featureKeys: string[];
  highlighted?: boolean;
  ctaKey: string;
}

export const affiliatePlans: readonly Plan[] = [
  {
    code: 'affiliate_free',
    nameKey: 'affiliateFreeName',
    monthlyUsd: 0,
    annualDiscountPercent: 0,
    featureKeys: ['affiliateFreeF1', 'affiliateFreeF2', 'affiliateFreeF3'],
    ctaKey: 'ctaStart',
  },
  {
    code: 'affiliate_pro',
    nameKey: 'affiliateProName',
    monthlyUsd: 19,
    annualDiscountPercent: 20,
    featureKeys: ['affiliateProF1', 'affiliateProF2', 'affiliateProF3', 'affiliateProF4'],
    highlighted: true,
    ctaKey: 'ctaStart',
  },
  {
    code: 'affiliate_premium',
    nameKey: 'affiliatePremiumName',
    monthlyUsd: 49,
    annualDiscountPercent: 20,
    featureKeys: [
      'affiliatePremiumF1',
      'affiliatePremiumF2',
      'affiliatePremiumF3',
      'affiliatePremiumF4',
    ],
    ctaKey: 'ctaStart',
  },
] as const;

export const advertiserPlans: readonly Plan[] = [
  {
    code: 'advertiser_starter',
    nameKey: 'advertiserStarterName',
    monthlyUsd: 29,
    annualDiscountPercent: 20,
    featureKeys: ['advertiserStarterF1', 'advertiserStarterF2', 'advertiserStarterF3'],
    ctaKey: 'ctaStart',
  },
  {
    code: 'advertiser_business',
    nameKey: 'advertiserBusinessName',
    monthlyUsd: 79,
    annualDiscountPercent: 20,
    featureKeys: [
      'advertiserBusinessF1',
      'advertiserBusinessF2',
      'advertiserBusinessF3',
      'advertiserBusinessF4',
    ],
    highlighted: true,
    ctaKey: 'ctaStart',
  },
  {
    code: 'advertiser_enterprise',
    nameKey: 'advertiserEnterpriseName',
    monthlyUsd: null,
    annualDiscountPercent: 0,
    featureKeys: [
      'advertiserEnterpriseF1',
      'advertiserEnterpriseF2',
      'advertiserEnterpriseF3',
    ],
    ctaKey: 'ctaContact',
  },
] as const;

/**
 * Plan entièrement résolu côté serveur : plus aucune clé de traduction,
 * uniquement des chaînes prêtes à être affichées. C'est cette forme qui
 * traverse la frontière vers les composants client.
 */
export interface ResolvedPlan {
  code: string;
  name: string;
  features: string[];
  monthlyUsd: number | null;
  annualDiscountPercent: number;
  highlighted?: boolean;
  isCustom: boolean;
}

/** Calcule le prix mensuel effectif selon la période de facturation. */
export function effectiveMonthlyPrice(
  plan: { monthlyUsd: number | null; annualDiscountPercent: number },
  interval: PlanInterval,
): number | null {
  if (plan.monthlyUsd === null) return null;
  if (interval === 'month') return plan.monthlyUsd;
  const discount = plan.annualDiscountPercent / 100;
  return Math.round(plan.monthlyUsd * (1 - discount) * 100) / 100;
}

/** Formatage monétaire USD, sans taux de change inventé. */
export function formatUsd(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
