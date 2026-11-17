'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { IconInfo, IconMail } from '@/components/icons';

/**
 * Formulaire de contact.
 *
 * Comportement réel : à la soumission, il ouvre le client de messagerie de
 * l'utilisateur avec un message prérempli (mailto:). Rien n'est « envoyé » en
 * coulisse — un faux message de succès serait un mensonge.
 *
 * Le canal d'envoi serveur (messagerie transactionnelle + ticket en base) sera
 * branché avec le backend. Le composant est déjà prêt à recevoir un `onSubmit`
 * asynchrone à ce moment-là.
 */
export function ContactForm({
  labels,
  to,
}: {
  labels: {
    formTitle: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    submit: string;
    mailNote: string;
    options: { sales: string; support: string; partnership: string; other: string };
  };
  to: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<'sales' | 'support' | 'partnership' | 'other'>('sales');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError(labels.name);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(labels.email);
      return;
    }
    if (message.trim().length < 10) {
      setError(labels.message);
      return;
    }
    setError(null);

    const body =
      `${labels.name} : ${name.trim()}\n` +
      `${labels.email} : ${email.trim()}\n` +
      `${labels.subject} : ${labels.options[subject]}\n\n` +
      `${message.trim()}\n`;

    const href =
      `mailto:${to}` +
      `?subject=${encodeURIComponent(`[AffiliateOS] ${labels.options[subject]}`)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  const fieldClass =
    'tap-target w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-fg ' +
    'placeholder:text-fg-muted focus:border-brand-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-8"
      noValidate
    >
      <h2 className="text-lg font-bold text-fg">{labels.formTitle}</h2>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-fg">
            {labels.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-fg">
            {labels.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-fg">
            {labels.subject}
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value as typeof subject)
            }
            className={fieldClass}
          >
            <option value="sales">{labels.options.sales}</option>
            <option value="support">{labels.options.support}</option>
            <option value="partnership">{labels.options.partnership}</option>
            <option value="other">{labels.options.other}</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-fg">
            {labels.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-danger-600">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full">
        <IconMail size={18} />
        {labels.submit}
      </Button>

      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-fg-muted">
        <IconInfo size={14} className="mt-0.5 shrink-0" />
        <span className="text-pretty">{labels.mailNote}</span>
      </p>
    </form>
  );
}
