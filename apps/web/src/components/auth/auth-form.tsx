'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { IconInfo } from '@/components/icons';
import { cn } from '@/lib/cn';

type Role = 'affiliate' | 'advertiser';
type Mode = 'signup' | 'login' | 'forgot';

export interface AuthLabels {
  signupTitle: string;
  signupSubtitle: string;
  loginTitle: string;
  loginSubtitle: string;
  forgotTitle: string;
  forgotSubtitle: string;
  roleAffiliate: string;
  roleAffiliateHint: string;
  roleAdvertiser: string;
  roleAdvertiserHint: string;
  fullName: string;
  email: string;
  password: string;
  passwordHint: string;
  companyName: string;
  submitSignup: string;
  submitLogin: string;
  submitForgot: string;
  haveAccount: string;
  noAccount: string;
  forgotLink: string;
  backToLogin: string;
  termsAccept: string;
  pendingTitle: string;
  pendingBody: string;
}

/**
 * Formulaires d'authentification (inscription, connexion, mot de passe oublié).
 *
 * État réel : la validation des champs est implémentée et fonctionne. La
 * création de compte, la session et l'envoi d'e-mail seront branchés sur
 * Supabase Auth à l'étape 4. Tant que ce n'est pas fait, la soumission
 * affiche un état explicite — jamais un faux message de succès.
 */
export function AuthForm({ mode, labels }: { mode: Mode; labels: AuthLabels }) {
  const [role, setRole] = useState<Role>('affiliate');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode !== 'forgot') {
      if (password.length < 8) {
        setFieldError(labels.passwordHint);
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setFieldError(labels.email);
      return;
    }
    if (mode === 'signup') {
      if (fullName.trim().length < 2) {
        setFieldError(labels.fullName);
        return;
      }
      if (role === 'advertiser' && companyName.trim().length < 2) {
        setFieldError(labels.companyName);
        return;
      }
    }

    setFieldError(null);
    // Étape 4 : appel réel à Supabase Auth (signUp / signInWithPassword /
    // resetPasswordForEmail). En attendant, on affiche l'état honnêtement.
    setBlocked(true);
  }

  const fieldClass =
    'tap-target w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-fg ' +
    'placeholder:text-fg-muted focus:border-brand-500';

  const title =
    mode === 'signup'
      ? labels.signupTitle
      : mode === 'login'
        ? labels.loginTitle
        : labels.forgotTitle;

  const subtitle =
    mode === 'signup'
      ? labels.signupSubtitle
      : mode === 'login'
        ? labels.loginSubtitle
        : labels.forgotSubtitle;

  const submitLabel =
    mode === 'signup'
      ? labels.submitSignup
      : mode === 'login'
        ? labels.submitLogin
        : labels.submitForgot;

  return (
    <div className="w-full max-w-md">
      <h1 className="text-balance text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {title}
      </h1>
      <p className="text-pretty mt-3 text-sm text-fg-muted">{subtitle}</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8"
        noValidate
      >
        {mode === 'signup' ? (
          <fieldset className="mb-6">
            <legend className="mb-3 text-sm font-medium text-fg">
              {labels.signupSubtitle}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: 'affiliate', label: labels.roleAffiliate, hint: labels.roleAffiliateHint },
                  {
                    id: 'advertiser',
                    label: labels.roleAdvertiser,
                    hint: labels.roleAdvertiserHint,
                  },
                ] as const
              ).map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'cursor-pointer rounded-xl border p-4 transition-colors',
                    role === option.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                      : 'border-line bg-surface hover:bg-surface-muted',
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.id}
                    checked={role === option.id}
                    onChange={() => setRole(option.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold text-fg">{option.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-fg-muted">
                    {option.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="space-y-4">
          {mode === 'signup' ? (
            <>
              <Field
                id="fullName"
                label={labels.fullName}
                value={fullName}
                onChange={setFullName}
                autoComplete="name"
                className={fieldClass}
              />
              {role === 'advertiser' ? (
                <Field
                  id="companyName"
                  label={labels.companyName}
                  value={companyName}
                  onChange={setCompanyName}
                  autoComplete="organization"
                  className={fieldClass}
                />
              ) : null}
            </>
          ) : null}

          <Field
            id="email"
            type="email"
            label={labels.email}
            value={email}
            onChange={setEmail}
            autoComplete="email"
            className={fieldClass}
          />

          {mode !== 'forgot' ? (
            <div>
              <Field
                id="password"
                type="password"
                label={labels.password}
                value={password}
                onChange={setPassword}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={fieldClass}
              />
              <p className="mt-1.5 text-xs text-fg-muted">{labels.passwordHint}</p>
            </div>
          ) : null}
        </div>

        {fieldError ? (
          <p role="alert" className="mt-4 text-sm font-medium text-danger-600">
            {fieldError}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-6 w-full">
          {submitLabel}
        </Button>

        {mode === 'signup' ? (
          <p className="mt-4 text-xs leading-relaxed text-fg-muted">{labels.termsAccept}</p>
        ) : null}
      </form>

      {blocked ? (
        <div
          role="status"
          className="mt-4 flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm dark:border-brand-800 dark:bg-brand-900/30"
        >
          <IconInfo size={18} className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-300" />
          <div>
            <p className="font-semibold text-fg">{labels.pendingTitle}</p>
            <p className="text-pretty mt-1 text-fg-muted">{labels.pendingBody}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  className: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={className}
      />
    </div>
  );
}
