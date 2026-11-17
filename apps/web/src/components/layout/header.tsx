import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LocaleSwitch } from './locale-switch';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';
import { LinkButton } from '@/components/ui/button';

/** En-tête commun à toutes les pages publiques. */
export async function Header() {
  const t = await getTranslations('nav');
  const common = await getTranslations('common');
  const locale = await getLocale();

  const items = [
    { href: '/fonctionnalites', label: t('features') },
    { href: '/tarifs', label: t('pricing') },
    { href: '/affilies', label: t('affiliates') },
    { href: '/annonceurs', label: t('advertisers') },
    { href: '/comment-ca-marche', label: t('howItWorks') },
    { href: '/aide', label: t('help') },
  ];

  const localeSwitch = (
    <LocaleSwitch
      current={locale}
      labels={{ switchLanguage: t('switchLanguage') }}
    />
  );

  const themeToggle = (
    <ThemeToggle
      labels={{ toggle: t('toggleTheme'), light: common('lightTheme'), dark: common('darkTheme') }}
    />
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="AffiliateOS">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {localeSwitch}
            {themeToggle}
          </div>

          <LinkButton
            href="/connexion"
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t('login')}
          </LinkButton>

          <LinkButton href="/inscription" size="sm" className="hidden sm:inline-flex">
            {t('signup')}
          </LinkButton>

          <MobileNav
            items={items}
            labels={{
              open: t('openMenu'),
              close: t('closeMenu'),
              login: t('login'),
              signup: t('signup'),
            }}
            loginHref="/connexion"
            signupHref="/inscription"
            localeSwitch={localeSwitch}
            themeToggle={themeToggle}
          />
        </div>
      </div>
    </header>
  );
}
