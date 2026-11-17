import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/primitives';
import { LinkButton } from '@/components/ui/button';

/** Bandeau d'appel à l'action réutilisé en bas des pages commerciales. */
export async function CtaSection({
  title,
  body,
  primaryHref = '/inscription',
  secondaryHref = '/tarifs',
}: {
  title?: string;
  body?: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  const t = await getTranslations('home');
  const common = await getTranslations('common');

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-900 px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(124,58,237,0.35),transparent)]"
          />
          <div className="relative">
            <h2 className="text-balance mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title ?? t('ctaTitle')}
            </h2>
            <p className="text-pretty mx-auto mt-4 max-w-xl text-base text-ink-200">
              {body ?? t('ctaSubtitle')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton href={primaryHref} size="lg" className="w-full sm:w-auto">
                {common('ctaStart')}
              </LinkButton>
              <LinkButton
                href={secondaryHref}
                size="lg"
                variant="outline"
                className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              >
                {common('ctaPricing')}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
