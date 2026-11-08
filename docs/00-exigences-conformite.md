# AFFILIATEOS — Matrice de conformité aux exigences techniques obligatoires

> Chaque exigence de ton cahier des charges est tracée ici vers un livrable, une phase et une méthode de vérification.
> Aucune exigence n'est supprimée silencieusement : ce qui est écarté du MVP est écrit, avec sa raison.
> Dernière mise à jour : 2026-11-07 · Statut : **établi en phase 1, révisé à chaque fin de phase**

## Légende

| Symbole | Sens |
|---|---|
| ✅ **Conçu** | Traité dans `docs/01-analyse-architecture.md` (conception, pas encore codé) |
| 🔜 **Phase N** | Planifié dans la phase N, avec son fichier cible |
| ⚠️ **Décision** | Bloqué tant que la décision D1…D6 n'est pas tranchée |
| ⛔ **Hors MVP** | Écarté volontairement, raison indiquée, architecture prévue pour l'accueillir |
| ❗ **Non vérifiable ici** | Impossible à tester depuis cet environnement (pas d'accès à `*.supabase.co`, pas de compte prestataire) |

---

## 1. Architecture technique

| Exigence | Traitement | Phase | Fichier(s) cible | Statut |
|---|---|---|---|---|
| Frontend Next.js ou React avec TypeScript | Next.js **16.4.5** + TypeScript strict (`"strict": true`, `noUncheckedIndexedAccess`) | 2 | `apps/web/tsconfig.json` | 🔜 2 |
| Design : Tailwind CSS | Tailwind **4.3.5**, tokens CSS pour clair/sombre | 2 | `apps/web/src/styles/globals.css` | 🔜 2 |
| Composants réutilisables | 14 primitives UI + composants métier, aucun composant mort (chacun utilisé) | 2 | `apps/web/src/components/ui/*` | 🔜 2 |
| Backend Supabase ou Node.js adapté | Supabase (PostgreSQL + Auth + Storage + Edge Functions si besoin) | 3 | `supabase/` | 🔜 3 |
| Base de données PostgreSQL | PostgreSQL (Supabase). Validation locale sur **PostgreSQL 18.6** (PGlite 0.5.15, exécuté avec succès) | 3 | `supabase/migrations/*.sql` | ✅ Conçu |
| Authentification Supabase Auth | `@supabase/ssr` 0.12.7 (cookies httpOnly), clés `service_role` **serveur uniquement** | 4 | `apps/web/src/lib/db/*`, `lib/auth/*` | 🔜 4 |
| Stockage **Cloudflare R2** | **Exigence retenue comme choix par défaut** (voir §11, ajustement A1). Adaptateur `StorageProvider` : `r2/` par défaut, `supabase/` en repli | 5 | `lib/adapters/storage/{types,r2,supabase}.ts` | 🔜 5 |
| API REST documentée | `/api/v1/*` versionnée, clés API hashées, scopes, rate limit, OpenAPI + doc Markdown | 5 | `apps/web/src/app/api/v1/*`, `docs/api/` | 🔜 5 |
| IA multi-fournisseurs | Interface `AiProvider` + adaptateurs `openai/`, `anthropic/`, `mistral/`, routage par coût, quota | 6 | `lib/adapters/ai/*` | 🔜 6 |
| Hébergement compatible Vercel | Next.js standard, aucune dépendance à un runtime propriétaire ; `next.config.ts` sans verrouillage | 10 | `apps/web/next.config.ts`, `docs/deployment.md` | 🔜 10 |

**Coût R2 vérifié le 2026-11-07** ([Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/), relevé via [synthèse 2026](https://www.bucketmate.app/blogs/cloudflare-r2-pricing-2026)) : offert **10 Go de stockage + 1 M d'opérations Class A (écritures) + 10 M Class B (lectures) par mois**, **egress 0 $ sans plafond**. Au-delà : 0,015 $/Go-mois, 4,50 $/M Class A, 0,36 $/M Class B. 100 000 buckets inclus, puis 0,10 $/bucket/mois. ⚠️ Un compte Cloudflare avec moyen de paiement enregistré est requis pour activer R2, même en dessous du seuil gratuit.

---

## 2. Architecture logicielle — séparation des couches

| Exigence | Où c'est physiquement séparé | Verrou anti-régression |
|---|---|---|
| Interface utilisateur | `apps/web/src/{app,components}` | Aucun accès SQL dans `app/` ni `components/` |
| Logique métier | `lib/domain/*` — **pur TypeScript, zéro import Next/Supabase** | Test d'architecture : `grep` interdit `@supabase` et `next/` dans `lib/domain/` |
| Backend / accès données | `lib/db/*` + server actions dans `features/*/actions.ts` | Clé `service_role` jamais importée hors `lib/db/server.ts` |
| Base de données | `supabase/migrations/*` (seul endroit où le schéma existe) | Aucun `CREATE TABLE` dans le code applicatif |
| Services externes | `lib/adapters/*` | Aucune URL de fournisseur en dehors de son adaptateur |
| Gestion des paiements | `lib/adapters/payments/*` + `features/billing/`, `features/payouts/` | Interface `PaymentProvider` unique |
| Services IA | `lib/adapters/ai/*` + `features/ai/` | Interface `AiProvider` unique |
| Administration | `app/[locale]/(admin)/*` — **arbre de routes séparé**, garde de rôle dédiée | Test de permission : un non-admin reçoit 404, pas 403 (pas d'énumération de routes) |
| Architecture modulaire | Un domaine = un dossier `features/<domaine>/` avec ses actions, composants et hooks | Ajouter une fonctionnalité n'oblige à modifier aucun autre domaine |

---

## 3. Expérience utilisateur — les 15 pages exigées

| # | Page | Route | Phase |
|---|---|---|---|
| 1 | Accueil commercial | `/` | 2 (maquette) → 10 (SEO final) |
| 2 | Présentation des fonctionnalités | `/fonctionnalites` | 2 |
| 3 | Tarifs | `/tarifs` | 2 |
| 4 | Inscription | `/inscription` | 4 |
| 5 | Connexion | `/connexion` | 4 |
| 6 | Mot de passe oublié | `/mot-de-passe-oublie` | 4 |
| 7 | Onboarding | `/onboarding` | 4 |
| 8 | Tableau de bord | `/dashboard` (affilié) · `/advertiser` (annonceur) · `/admin` | 5 / 5 / 8 |
| 9 | Paramètres | `/dashboard/parametres` | 5 |
| 10 | Gestion du profil | `/dashboard/profil` | 4 |
| 11 | Gestion de l'abonnement | `/dashboard/abonnement` | 7 |
| 12 | Centre d'aide | `/aide` | 2 |
| 13 | Contact | `/contact` | 2 |
| 14 | Conditions générales | `/cgu` | 2 |
| 15 | Politique de confidentialité | `/confidentialite` | 2 |

Compléments exigés ailleurs dans ton cahier des charges : politique de cookies (`/cookies`), solutions affiliés (`/affilies`), solutions annonceurs (`/annonceurs`), comment ça marche (`/comment-ca-marche`), à propos (`/a-propos`) — mêmes phases.

| Exigence transversale | Traitement | Phase |
|---|---|---|
| Interface française **et** anglaise | `next-intl` 4.14.9 (peer `next ^16.0.0` vérifié). URLs préfixées `/fr/…` et `/en/…`, indexables séparément, `hreflang` | 2 |
| Responsive, adaptée aux téléphones Android | Points de rupture **360 / 480 / 768 / 1024 / 1440**. Cible prioritaire : Android bas de gamme sur 3G — budget JS initial ≤ 170 Ko gzip, navigation mobile en bas d'écran, zones tactiles ≥ 44 px | 2 |
| Interface utilisable en connexion limitée | Tableaux paginés (pas de chargement infini), `Suspense` + squelettes, images `next/image` en AVIF/WebP, aucune dépendance de graphiques lourde (graphiques SVG maison) | 2 / 5 |

---

## 4. Base de données

| Exigence | Traitement concret | Vérification |
|---|---|---|
| Identifiants uniques | `uuid` via `gen_random_uuid()` sur toutes les tables ; codes publics courts uniques (`affiliate_links.public_code`, `programs.slug`, `organizations.slug`) | Contrainte `UNIQUE` + test d'insertion dupliquée qui **doit échouer** |
| Relations correctes | 28 tables, FK explicites avec `ON DELETE` choisi cas par cas (RESTRICT sur l'argent, CASCADE uniquement sur le contenu sans valeur financière) | Test de suppression en cascade |
| Contraintes | `CHECK` sur les statuts et les montants (`amount_minor >= 0`), enums applicatifs via `CHECK` | Test d'insertion d'un statut invalide qui **doit échouer** |
| Index | (`program_id`,`occurred_at`), (`affiliate_account_id`,`status`), `public_code`, `visitor_hash`, (`provider`,`provider_txn_id`)… | `EXPLAIN` sur les requêtes des tableaux de bord |
| Horodatages | `created_at` / `updated_at` (`timestamptz`, trigger) partout ; `deleted_at` pour la suppression logique | Test du trigger `updated_at` |
| Gestion des suppressions | Suppression **logique** sur `programs`, `products`, `affiliate_links`, `profiles`, `organizations` ; `ledger_entries` et `audit_logs` **append-only** (aucun UPDATE/DELETE autorisé par trigger) | Test : tentative d'UPDATE sur `ledger_entries` **doit échouer** |
| Politiques RLS | `ENABLE ROW LEVEL SECURITY` sur **toutes** les tables, sans exception | **Déjà prouvé** : prototype exécuté sur PostgreSQL 18.6 → `A voit [Programme de A]`, `B voit [Programme de B]`, `INSERT refusé: permission denied for table programs` |
| Isolation des données entre clients | Politiques basées sur `public.is_org_member()` / `public.affiliate_owns()`, fonctions `SECURITY DEFINER` avec `search_path` figé | Test automatisé de fuite inter-tenant : **doit échouer** |
| Migrations SQL fournies | `supabase/migrations/0001_…sql` → numérotées, idempotentes, réversibles (fichier `down` documenté) | Chaque migration exécutée sur PGlite en CI locale |
| Instructions d'installation | `README.md` + `docs/installation.md` : création du projet Supabase, application des migrations (SQL Editor **ou** `supabase db push`), variables d'environnement, amorçage admin | Procédure rejouée de bout en bout ❗ (application réelle sur Supabase : à faire par toi) |

---

## 5. Paiements et abonnements

| Exigence | Traitement | Phase | Statut |
|---|---|---|---|
| Architecture indépendante du fournisseur | Interface `PaymentProvider` : `createCheckout`, `createPortal`, `verifyWebhook`, `refund`, `cancel`. Aucun appel fournisseur direct dans le code métier | 7 | 🔜 7 |
| Abonnements mensuels | `plans.interval = 'month'`, `subscriptions.current_period_start/end` | 7 | 🔜 7 |
| Abonnements annuels | `plans.interval = 'year'` + remise configurable en base (jamais codée en dur) | 7 | 🔜 7 |
| Périodes d'essai | `plans.trial_days` + statut `subscriptions.status = 'trialing'` | 7 | 🔜 7 |
| Factures | `invoices` (numéro unique, statut, PDF dans R2) | 7 | 🔜 7 |
| Historique des paiements | `payment_transactions` (journal prestataire) + écran dédié | 7 | 🔜 7 |
| Gestion des renouvellements | Webhook `invoice.paid` / `customer.subscription.updated` → avance la période, écrit au registre | 7 | 🔜 7 |
| Annulation | `cancel_at_period_end`, puis `status = 'canceled'` ; accès dégradé au plan Free | 7 | 🔜 7 |
| Échec de paiement | `status = 'past_due'`, notification, relance, suspension des quotas IA après N jours | 7 | 🔜 7 |
| Webhooks | `/api/webhooks/stripe` avec **vérification de signature HMAC** + `webhook_events` UNIQUE(`provider`,`event_id`) → rejeu impossible | 7 | 🔜 7 |
| Remboursements | `invoices.status = 'refunded'` + `ledger_entries.ref_type = 'refund'` (contre-écriture, jamais de suppression) + `payment_transactions.direction` | 7 | 🔜 7 |
| « Réelles, documentées et testées avant activation » | **Chaque adaptateur est livré `enabled: false` par défaut.** Activation uniquement quand (a) tes clés sandbox sont fournies, (b) un test de bout en bout a réussi, (c) le résultat est écrit dans `docs/tests-report.md`. Aucun mode production sans ta demande explicite | 7 | ❗ Non vérifiable ici |

⚠️ **Rappel du risque F1** : payer des affiliés en FCFA (décaissement) n'est pas couvert par les agrégateurs de collecte usuels (KKiaPay, FedaPay, CinetPay). MVP = **retrait manuel tracé** + export comptable. Le décaissement automatique ne sera codé qu'après confirmation écrite d'un prestataire habilité.

---

## 6. Sécurité

| Exigence | Traitement | Phase |
|---|---|---|
| Protection des routes | `middleware.ts` : locale + session + rôle. `(admin)` → 404 pour un non-admin. Server actions revérifient la permission côté serveur (le middleware ne suffit jamais) | 4 |
| Validation côté serveur | **Zod 4.6.7** sur chaque server action et chaque route API. Aucune donnée cliente n'atteint la base sans schéma | 4 |
| Protection contre les injections | Requêtes paramétrées exclusivement (PostgREST / SQL préparé) ; `SECURITY DEFINER` avec `search_path` figé ; aucun SQL concaténé | 3 |
| Gestion sécurisée des secrets | `.env` hors dépôt (`.gitignore`), `.env.example` sans valeur réelle, `service_role` uniquement dans `lib/db/server.ts`, aucun `NEXT_PUBLIC_` pour un secret | 3 |
| Limitation des requêtes | Rate limit par IP + par clé API : `/r/[code]` (anti-bot), `/api/v1/*` (jetons), endpoints d'authentification. Implémentation en base (portable) avec option Upstash | 5 |
| Journalisation | `audit_logs` append-only (acteur, action, entité, avant/après, IP hashée) + `webhook_events` | 5 |
| Contrôle des permissions | Matrice rôle × action centralisée dans `lib/auth/permissions.ts`, testée unitairement | 4 |
| Protection des API | Clés API **hashées** (jamais en clair), préfixe visible, scopes, expiration, révocation, `last_used_at` | 5 |
| Sauvegardes | Supabase Pro : sauvegardes quotidiennes conservées 7 jours. Procédure de restauration documentée + export `pg_dump` outillé | 10 |
| Gestion des erreurs | `error.tsx` / `not-found.tsx` par segment, aucun détail technique renvoyé au client, identifiant d'erreur corrélé au journal | 2 / 9 |
| **Ne jamais exposer une clé secrète dans le frontend** | Test automatisé : recherche de `service_role`, `sk_live`, `sk_test` dans le bundle produit → **doit ne rien trouver** | 9 |

Conformité complémentaire : IP et e-mail **hashés** dans les tables de tracking, aucune IP en clair ; **aucun PAN ni CVV stocké**, uniquement des références prestataire ; consentement cookies avant dépôt d'empreinte visiteur.

---

## 7. Tableau de bord administrateur

| Exigence | Écran | Phase |
|---|---|---|
| Consulter les utilisateurs | `/admin/utilisateurs` (recherche, filtres rôle/statut/pays) | 8 |
| Suspendre des comptes | Action `suspend` / `reactivate` + entrée `audit_logs` | 8 |
| Gérer les abonnements | `/admin/abonnements` (plans, statuts, périodes, annulations) | 8 |
| Consulter les revenus | `/admin/revenus` — **agrégats SQL sur `payment_transactions` et `invoices`**, aucune donnée simulée | 8 |
| Gérer les offres | `/admin/offres` → table `plans` (prix, limites, quotas IA, activation) | 8 |
| Suivre les transactions | `/admin/transactions` | 8 |
| Gérer les réclamations | `/admin/tickets` (`support_tickets` + messages) | 8 |
| Configurer les paramètres | `/admin/parametres` → `platform_settings` (modération, seuils de retrait, devises) | 8 |
| Consulter les journaux | `/admin/journaux` → `audit_logs`, filtres acteur/action/date | 8 |
| Surveiller les performances | `/admin/systeme` : volume des tables, latence des requêtes lentes, erreurs récentes, consommation IA | 8 |
| Espace **indépendant** | Arbre de routes séparé `(admin)`, garde de rôle dédiée, session vérifiée à chaque requête serveur | 8 |

**Règle absolue** : toutes les statistiques admin sont lues en base. Si une donnée n'existe pas, l'écran affiche un état vide explicite — jamais un nombre de démonstration présenté comme réel.

---

## 8. Qualité et tests

| Type de test | Portée | Outil | Phase | Statut |
|---|---|---|---|---|
| Unitaires | `lib/domain/` : calcul de commission (fixe, %, récurrente, prospect, action), arrondis XOF/EUR/USD, attribution, idempotence, quotas IA, conversion d'unités mineures | Vitest 5.1.0 | 5 | 🔜 5 |
| Intégration | **Chaque migration SQL** exécutée sur PostgreSQL 18.6 : contraintes, index, triggers, RLS, fuite inter-tenant, append-only | Vitest + PGlite 0.5.15 | 3 | ✅ Méthode **déjà prouvée** |
| API | `/api/v1/*` : auth par clé, scopes, pagination, erreurs, rate limit | Vitest (routes) | 5 | 🔜 5 |
| Authentification | inscription, rôle choisi à l'inscription, vérification e-mail, réinitialisation, expiration de session | Vitest + tests manuels documentés | 4 | ⚠️ Partiellement ❗ (l'envoi d'e-mail réel dépend de ton projet Supabase) |
| Permissions | matrice rôle × action : admin / annonceur / affilié / membre d'organisation / anonyme | Vitest + PGlite | 4 | 🔜 4 |
| Paiements sandbox | cycle complet : checkout → webhook → abonnement actif → facture → échec → relance → remboursement | Vitest avec prestataire **bouchonné** | 7 | ❗ Le mode réel exige tes clés sandbox |
| Responsive | 360 / 768 / 1024 / 1440, navigation mobile, zones tactiles | Playwright (viewport) | 9 | 🔜 9 |
| Sécurité | RLS cross-tenant, absence de secret dans le bundle, signature de webhook, injection via champs libres, rate limit | Vitest + revue | 9 | 🔜 9 |
| Performance | budget JS initial ≤ 170 Ko gzip, LCP des pages publiques, `EXPLAIN` des requêtes de tableaux de bord | `next build` + Lighthouse | 9 | 🔜 9 |

**Règle** : « Corriger les erreurs détectées avant de déclarer une fonctionnalité terminée » → aucune phase n'est déclarée close tant que sa commande de vérification n'est pas revenue verte, et le résultat brut est collé dans `docs/tests-report.md`.

---

## 9. Référencement et commercialisation

| Exigence | Traitement | Phase |
|---|---|---|
| SEO technique | `metadata` par route, `alternates.languages` fr/en, canonical, `sitemap.ts`, `robots.ts` | 2 / 10 |
| Sitemap XML | `app/sitemap.ts` généré depuis les routes publiques + programmes publiés | 10 |
| Robots.txt | `app/robots.ts` — autorise le public, bloque `/dashboard`, `/advertiser`, `/admin`, `/api` | 10 |
| Métadonnées | Titres ≤ 60 caractères, descriptions ≤ 155, par page et par locale | 2 |
| Open Graph | `openGraph` + `twitter` par page, image OG dédiée générée | 2 |
| Données structurées | JSON-LD : `Organization`, `SoftwareApplication`, `Product` (offres), `FAQPage`, `BreadcrumbList` | 10 |
| URLs propres | Slugs lisibles, minuscules, sans paramètre superflu ; `/r/<code>` réservé au tracking | 2 |
| Optimisation des performances | `next/image` AVIF/WebP, polices auto-hébergées (`next/font`), graphiques SVG maison, pas de librairie de charts lourde | 2 / 9 |
| Pages indexables | Toutes les pages publiques rendues côté serveur, aucune dépendante du JS pour son contenu | 2 |
| Pages de destination ciblées | `/affilies`, `/annonceurs`, `/agences`, `/createurs`, `/afrique` — chacune avec sa proposition de valeur propre | 10 |
| Pages commerciales convaincantes | Structure : proposition de valeur → preuves → bénéfices par persona → tarifs → FAQ → CTA. **Aucun chiffre inventé** : les statistiques affichées proviennent de la base ou sont étiquetées « exemple » | 2 |

---

## 10. Livrables obligatoires

| # | Livrable | Fichier | Phase |
|---|---|---|---|
| 1 | Code source complet | dépôt entier | 2 → 10 |
| 2 | Architecture du projet | `docs/01-analyse-architecture.md` | ✅ **livré** |
| 3 | Schéma de base de données | `docs/03-base-de-donnees.md` (détail complet) + §5 du doc de phase 1 | 3 |
| 4 | Migrations SQL | `supabase/migrations/*.sql` | 3 |
| 5 | Variables d'environnement exemple | `.env.example` (aucune valeur réelle) | 3 |
| 6 | Instructions d'installation | `README.md` + `docs/installation.md` | 3 / 10 |
| 7 | Instructions de déploiement | `docs/deployment.md` | 10 |
| 8 | Documentation API | `docs/api/` (OpenAPI + guide + exemples) | 5 |
| 9 | Fonctionnalités terminées | `docs/tests-report.md` — avec la commande de vérification de chacune | continu |
| 10 | Fonctionnalités non terminées | `docs/remaining-work.md` — tenu à jour, sans optimisme | continu |
| 11 | Résultats des tests | `docs/tests-report.md` — sortie brute collée | continu |
| 12 | Estimation des coûts d'exploitation | `docs/costs.md` (base : §6 du doc de phase 1, tarifs sourcés) | 10 |

---

## 11. Ajustements apportés au document de phase 1 par ces instructions

Ces exigences m'ont fait corriger trois points de `docs/01-analyse-architecture.md`. Je les signale explicitement plutôt que de les glisser en silence :

| # | Ajustement | Avant | Après |
|---|---|---|---|
| **A1** | Stockage | R2 « recommandé », Supabase Storage présenté comme équivalent | **R2 par défaut** (exigence), Supabase Storage conservé comme **repli** via l'adaptateur. Coût réel chiffré ci-dessus (§1) |
| **A2** | Tests responsive et performance | Mentionnés comme « optionnel, phase 9 » | **Obligatoires en phase 9** : Playwright multi-viewport + budget JS + Lighthouse |
| **A3** | Essai gratuit et remboursements | Présents dans le schéma mais pas listés comme fonctionnalités | Ajoutés explicitement au cycle de vie de l'abonnement (§5) |

---

## 12. Ce qui reste explicitement hors MVP

| Écart | Raison | Ce qui est déjà prévu pour l'accueillir |
|---|---|---|
| Connecteurs e-commerce natifs (Shopify, WooCommerce, PrestaShop) | Un connecteur = un produit à maintenir | Conversions par API + webhook signé dès le MVP ; `conversions.source = 'ecommerce'` déjà dans le schéma |
| Décaissement Mobile Money automatique | Risque F1 : prestataire et statut à valider | `payout_methods_by_country` (rien d'activé sans confirmation) + adaptateur `PaymentProvider.disburse` |
| TVA multi-pays automatique | Complexe, dépend du statut juridique | Champ TVA configurable sur les factures |
| Application mobile native | Le web responsive couvre Android et iPhone | PWA possible ensuite sans refonte |
| Temps réel (Supabase Realtime) | Rafraîchissement suffisant au MVP | Aucune architecture ne le bloque |

---

## 13. Interdits — appliqués sans exception

Aucune donnée fabriquée · aucun paiement simulé présenté comme réel · aucune intégration fictive · aucune statistique inventée · aucun bouton qui ne fait rien · aucun secret exposé côté client · pas toute l'application dans un seul fichier · aucune dépense engagée sans utilité et alternative expliquées.
