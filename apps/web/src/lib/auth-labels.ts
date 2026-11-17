import { getTranslations } from 'next-intl/server';
import type { AuthLabels } from '@/components/auth/auth-form';

/** Construit les libellés du formulaire d'authentification depuis les traductions. */
export async function buildAuthLabels(locale: string): Promise<AuthLabels> {
  const t = await getTranslations({ locale, namespace: 'auth' });
  return {
    signupTitle: t('signupTitle'),
    signupSubtitle: t('signupSubtitle'),
    loginTitle: t('loginTitle'),
    loginSubtitle: t('loginSubtitle'),
    forgotTitle: t('forgotTitle'),
    forgotSubtitle: t('forgotSubtitle'),
    roleAffiliate: t('roleAffiliate'),
    roleAffiliateHint: t('roleAffiliateHint'),
    roleAdvertiser: t('roleAdvertiser'),
    roleAdvertiserHint: t('roleAdvertiserHint'),
    fullName: t('fullName'),
    email: t('email'),
    password: t('password'),
    passwordHint: t('passwordHint'),
    companyName: t('companyName'),
    submitSignup: t('submitSignup'),
    submitLogin: t('submitLogin'),
    submitForgot: t('submitForgot'),
    haveAccount: t('haveAccount'),
    noAccount: t('noAccount'),
    forgotLink: t('forgotLink'),
    backToLogin: t('backToLogin'),
    termsAccept: t('termsAccept'),
    pendingTitle: t('pendingTitle'),
    pendingBody: t('pendingBody'),
  };
}
