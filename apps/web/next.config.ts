import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // L'aperçu live d'Arena sert l'application depuis un hôte *.e2b.app :
  // il doit être explicitement autorisé par le serveur de développement.
  allowedDevOrigins: ['*.e2b.app'],
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
