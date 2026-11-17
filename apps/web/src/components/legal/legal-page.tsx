import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/primitives';
import { IconInfo } from '@/components/icons';
import { legalDocuments, type LegalKey } from '@/content/legal';

/**
 * Rendu d'une page légale.
 * Le contenu vient de `content/legal.ts` (fr/en) ; ce composant ne contient
 * aucun texte en dur.
 */
export async function LegalPage({
  docKey,
  locale,
}: {
  docKey: LegalKey;
  locale: 'fr' | 'en';
}) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const doc = legalDocuments[docKey][locale];

  return (
    <div className="border-b border-line bg-surface py-14 sm:py-20">
      <Container size="narrow">
        <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-400">
          {t('updatedLabel')} : 2026-11-07
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {doc.title}
        </h1>

        <div className="mt-6 flex gap-3 rounded-xl border border-warning-500/30 bg-warning-50 p-4 text-sm text-fg dark:bg-warning-500/10">
          <IconInfo size={18} className="mt-0.5 shrink-0 text-warning-600" />
          <p className="text-pretty">{t('reviewNote')}</p>
        </div>
      </Container>
    </div>
  );
}

export function LegalSections({
  docKey,
  locale,
}: {
  docKey: LegalKey;
  locale: 'fr' | 'en';
}) {
  const doc = legalDocuments[docKey][locale];

  return (
    <div className="py-12 sm:py-16">
      <Container size="narrow">
        <div className="space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-fg">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-pretty text-sm leading-relaxed text-fg-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
