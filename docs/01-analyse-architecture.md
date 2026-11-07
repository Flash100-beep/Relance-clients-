# AFFILIATEOS — Phase 1 : Analyse du projet et architecture

> Statut : **document de conception, en attente de validation.**
> Aucune ligne de code applicatif n'a été écrite. Rien n'est déployé.
> Date : 2026-11-07 · Branche : `arena/9609d122-relance-clients`

---

## 0. État réel du dépôt et de l'environnement (vérifié, pas supposé)

Tout ce qui suit a été mesuré dans le dépôt et le sandbox, pas déduit.

| Fait | Vérification | Résultat |
|---|---|---|
| Contenu du dépôt | `git ls-files \| wc -l` | **2 fichiers** : `README.md` (1 ligne) et `index.html` (180 lignes) |
| Nature du code existant | lecture de `index.html` | Application **« Relance Clients »** (relance de devis/factures), 1 seul fichier HTML, table Supabase `clients`, **aucun rapport avec AffiliateOS** |
| Historique | `git log --oneline` | 1 commit : `352bf3d Add files via upload` |
| Clé embarquée | `grep -nEo 'sb_…' index.html` | **ligne 84** : `https://ehesotolrzzfoytpfwvt.supabase.co` + `sb_publishable_OGiTHNfapGV0sy--EXw7Rg_7SPpVpxb` en clair dans le code |
| Node / npm | `node -v` / `npm -v` | v22.22.3 / 10.9.8 |
| PostgreSQL installé | `command -v psql postgres initdb` | **aucun binaire PostgreSQL** dans le sandbox |
| Accès réseau sortant | `curl` | `api.github.com` → 200, `registry.npmjs.org` → 200, **`*.supabase.co` → `Could not resolve host`** |
| Moteur SQL local | `npm i @electric-sql/pglite` + exécution | **PostgreSQL 18.6** (wasm) opérationnel : `CREATE TABLE`, `ENABLE ROW LEVEL SECURITY`, `CREATE POLICY`, trigger PL/pgSQL, `INSERT … RETURNING`, agrégats → **tout fonctionne** |
| Versions npm disponibles | `npm view <pkg> version` | next `16.4.5`, react `19.3.1`, @supabase/supabase-js `2.119.0`, tailwindcss `4.3.5`, typescript `7.0.2`, vitest `5.1.0`, zod `4.6.7` |

### Trois conséquences directes, à trancher avant de coder

**C1 — Le dépôt ne contient pas AffiliateOS.** Il contient un autre produit. Décision requise (voir §8, D1).

**C2 — La clé Supabase du projet « Relance Clients » est publiée dans le dépôt.**
Précision honnête : un préfixe `sb_publishable_…` est une clé *publiable* (anciennement `anon`), conçue pour être exposée côté navigateur — ce n'est donc pas une fuite de secret au sens strict. **Mais** elle révèle l'URL du projet, et la sécurité repose alors entièrement sur les politiques RLS de la table `clients`, que je ne peux pas inspecter d'ici (pas d'accès réseau à Supabase). Si RLS n'est pas activée sur `clients`, **n'importe qui peut lire et écrire les données clients de ce projet**. À vérifier côté Supabase, indépendamment d'AffiliateOS.

**C3 — Je ne peux pas atteindre Supabase depuis le sandbox.** Donc : **je ne peux pas exécuter les migrations sur ton vrai projet, ni tester l'authentification réelle, ni déclencher un vrai paiement.** Ce n'est pas un blocage du projet, c'est une contrainte de méthode :

- ✅ je **peux** exécuter chaque migration SQL sur un vrai moteur PostgreSQL 18.6 (PGlite) ici même, avec tests d'insertion, de contraintes, de triggers **et de politiques RLS** (`SET LOCAL ROLE authenticated` + `request.jwt.claims`) ;
- ✅ je **peux** faire passer `tsc --noEmit`, `vitest` et `next build` ici ;
- ❌ je **ne peux pas** valider contre `*.supabase.co` : c'est toi qui appliqueras les migrations (SQL Editor ou `supabase db push`) et qui me renverras les erreurs éventuelles ;
- ❌ je **ne peux pas** simuler un paiement réel. Tout ce qui touche un prestataire sera livré **désactivé par défaut** et documenté comme « non testé en conditions réelles » tant que tes clés sandbox ne sont pas branchées.

> Règle que je m'applique : je n'écrirai jamais « testé » pour quelque chose que je n'ai pas exécuté. Chaque phase indiquera clairement **vérifié** / **non vérifiable ici**.

### Preuve exécutée — l'isolation multi-tenant est testable ici

Prototype jetable exécuté le 2026-11-07 sur PGlite (PostgreSQL 18.6), hors dépôt. Deux organisations, deux membres, une politique RLS `SECURITY DEFINER` identique à celle prévue en production :

```
Utilisateur A voit : [{"name":"Programme de A"}]
Utilisateur B voit : [{"name":"Programme de B"}]
INSERT refusé : permission denied for table programs
✅ ISOLATION MULTI-TENANT CONFIRMÉE : A ne voit pas les données de B
✅ ÉCRITURE NON AUTORISÉE BLOQUÉE PAR RLS
```

Ce résultat valide la méthode de la phase 3 : **chaque migration sera réellement exécutée** sur un moteur PostgreSQL, et chaque politique RLS sera confrontée à une tentative de lecture croisée entre deux tenants qui **doit échouer**. Ce n'est pas une intention, c'est déjà un test qui tourne.

---


## 1. Risques identifiés

### 1.1 Risques techniques

| # | Risque | Gravité | Réponse |
|---|---|---|---|
| T1 | **Fraude au tracking** (auto-clics, bots, clics gonflés, conversions fabriquées) | Critique | Le clic n'est **jamais** une vente. Hash IP + empreinte visiteur, déduplication, fenêtre d'attribution, score de suspicion, validation humaine avant paiement |
| T2 | **Doubles conversions** (webhook rejoué, retry réseau) | Critique | Contrainte d'unicité `(program_id, external_reference)` + table `webhook_events` unique `(provider, event_id)` + idempotence au niveau applicatif |
| T3 | **Erreurs d'arrondi monétaire** (float, devises sans décimales comme XOF) | Critique | Aucun `float`. Montants en **unités mineures entières** (`bigint`) avec exposant par devise ; XOF exposant 0 → 1 unité = 1 FCFA |
| T4 | **Fuite de données inter-tenant** | Critique | RLS sur **toutes** les tables + fonctions `SECURITY DEFINER` avec `search_path` figé + tests RLS automatisés |
| T5 | **Le tracking de clic est un endpoint public non authentifié** → cible de déni de service et de pollution de données | Élevé | Rate limiting par IP, écriture asynchrone, table `clicks` partitionnée par mois, budget d'ingestion, exclusion des IP de datacenters connues |
| T6 | **Attribution ambiguë** (multi-appareil, blocage des cookies, ITP) | Élevé | 3 niveaux d'attribution documentés : token de clic explicite > empreinte visiteur + hash email > dernier clic dans la fenêtre. Chaque conversion stocke **sa méthode d'attribution** |
| T7 | **Coût IA non maîtrisé** | Moyen | Compteurs `ai_usage` + quotas par plan + coupe-circuit budgétaire **avant** l'appel, pas après |
| T8 | **Dépendance à un seul fournisseur** (IA, paiement, stockage) | Moyen | Interfaces + adaptateurs : `PaymentProvider`, `AiProvider`, `StorageProvider`. Aucun appel direct dispersé dans le code |
| T9 | Le sandbox ne peut pas joindre Supabase | Moyen | Voir C3 : harnais PGlite local + procédure d'application côté utilisateur |

### 1.2 Risques financiers

| # | Risque | Détail |
|---|---|---|
| F1 | **Payer les affiliés n'est pas le même métier qu'encaisser.** KKiaPay, FedaPay, CinetPay font principalement de la **collecte**. Le **décaissement** (envoyer de l'argent vers des portefeuilles Mobile Money) exige un produit distinct (ex. virements/disbursement), un statut d'émetteur/agrégateur agréé et un KYC renforcé. **Je ne peux pas garantir qu'un simple compte marchand permette de payer des affiliés en FCFA.** À valider avec le prestataire avant d'écrire du code. |
| F2 | Une **carte virtuelle ne reçoit pas de virement**. Tout moyen de retrait sera **configuré par pays** (`payout_methods_by_country`) et les méthodes non confirmées resteront désactivées. |
| F3 | Les tarifs (19 $/49 $/29 $/79 $) sont des **hypothèses**. Ils seront stockés en base (table `plans`) et modifiables depuis l'admin, jamais codés en dur. |
| F4 | Coûts d'infrastructure réels : voir §6. Le poste qui dérape en premier est l'**egress** et le **compute** Supabase, pas l'hébergement. |
| F5 | Frais de paiement mangent les petits paniers : 1,5 % + 0,25 € sur un abonnement à 19 $ ≈ 3,5 % effectif ; sur un panier de 9 € ≈ 4,3 %. Prévoir un minimum de facturation. |

### 1.3 Risques juridiques / conformité

- **RGPD + loi togolaise sur les données personnelles (APDP)** : IP et email **hashés** dans les tables de tracking, jamais en clair ; durée de conservation configurable ; registre des traitements.
- **Consentement cookies** : le tracking ne dépose une empreinte visiteur qu'après consentement, conformément au paramétrage de l'annonceur.
- **Ne jamais stocker PAN ni CVV.** Les moyens de paiement sont référencés par jeton/référence prestataire uniquement.
- **Administrateur** : créé par une procédure contrôlée (script d'amorçage exécuté côté serveur + variable d'environnement `ADMIN_BOOTSTRAP_TOKEN`), **jamais** par l'inscription publique. Le rôle `admin` ne peut pas être auto-attribué via l'API.

---

## 2. Architecture technique

```
                        ┌──────────────────────────────────────────┐
   Utilisateurs         │            Next.js 16 (App Router)       │
   ─────────────        │                                          │
   Affilié ─────┐       │  /                 site public (SEO)     │
   Annonceur ───┼─────► │  /(auth)           inscription/connexion │
   Admin ───────┘       │  /(dashboard)      espace affilié        │
                        │  /(advertiser)     espace annonceur      │
   Visiteurs ─────────► │  /r/[code]         REDIRECT + TRACKING   │◄── point le plus sensible
   click                │  /api/v1/*         API publique (clés)   │
                        │  /api/webhooks/*   Stripe / conversions  │
                        └───────────────┬──────────────────────────┘
                                        │  @supabase/ssr (cookies) — RLS par requête
                                        ▼
        ┌───────────────────────────────────────────────────────────────┐
        │  lib/domain/*  ← LOGIQUE MÉTIER PURE (sans framework)         │
        │  commissions · attribution · fx · idempotence · quotas IA     │
        │  testée unitairement, aucune dépendance à Next ni Supabase    │
        └───────────────────────────────────────────────────────────────┘
                                        │
          ┌─────────────┬───────────────┼────────────────┬──────────────┐
          ▼             ▼               ▼                ▼              ▼
   PostgreSQL      Supabase       Cloudflare R2     Prestataires   Fournisseurs IA
   (Supabase)      Auth           ou Supabase       de paiement    OpenAI/Anthropic/
   + RLS                          Storage           (adaptateurs)  Mistral (adaptateurs)
```

### 2.1 Choix et justification

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 16 + TypeScript strict** | Rendu serveur pour le SEO des pages publiques, Route Handlers pour `/r/[code]` et l'API, un seul déploiement |
| UI | **Tailwind CSS 4 + composants maison** | Design system cohérent, zéro dépendance de composants verrouillée |
| i18n | **next-intl** (fr par défaut, en) | URLs `/fr/…` et `/en/…` indexables séparément |
| Backend | **Supabase (PostgreSQL + Auth + Storage)** | RLS native = isolation multi-tenant au niveau de la base, pas seulement de l'app. Alternative gratuite : PostgreSQL + Node/Fastify sur un VPS (~5-10 $/mois), mais RLS et Auth à réécrire |
| Accès données | **`@supabase/ssr` côté serveur** | La clé `service_role` ne quitte jamais le serveur ; le client navigateur ne parle qu'avec la clé publable + RLS |
| Logique métier | **`lib/domain/*`, pur TypeScript** | Le calcul de commission et l'attribution sont unit-testables sans base ni réseau — c'est là que se joue la fiabilité financière |
| Tracking | **Route Handler `GET /r/[code]`** | Un seul point d'entrée, journalisation puis redirection 302, écriture du clic asynchrone pour ne pas ralentir la redirection |
| Stockage | **Cloudflare R2** (S3-compatible, **0 $ d'egress**) | Les logos, justificatifs et factures PDF coûtent cher en sortie chez les autres. Alternative sans configuration : Supabase Storage (100 Go inclus en Pro, puis 0,0213 $/Go, egress 0,09 $/Go) |
| Paiements | **Architecture à adaptateurs** (`PaymentProvider`) | Aucun verrouillage fournisseur. Stripe pour les abonnements SaaS ; adaptateurs Mobile Money activables quand un compte marchand réel existe |
| IA | **Interface `AiProvider` + 3 adaptateurs** | OpenAI, Anthropic, Mistral interchangeables ; routage par coût ; coupe-circuit budgétaire |
| Tests | **Vitest** + harnais **PGlite** | Unitaires sur le domaine ; intégration SQL et RLS sur un vrai PostgreSQL 18.6 exécuté localement |

### 2.1bis Versions réellement disponibles (vérifiées sur `registry.npmjs.org` le 2026-11-07)

| Paquet | Version | Compatibilité vérifiée |
|---|---|---|
| `next` | 16.4.5 | — |
| `react` | 19.3.1 | requis par Next 16 |
| `typescript` | 7.0.2 | — |
| `tailwindcss` | 4.3.5 | — |
| `@supabase/supabase-js` | 2.119.0 | satisfait le peer `^2.114.0` de `@supabase/ssr` |
| `@supabase/ssr` | 0.12.7 | peer : `@supabase/supabase-js ^2.114.0` ✅ |
| `next-intl` | 4.14.9 | peer : `next ^12…^16.0.0` ✅ (Next 16 supporté) |
| `zod` | 4.6.7 | validation des entrées |
| `vitest` | 5.1.0 | tests unitaires et d'intégration |
| `@electric-sql/pglite` | 0.5.15 | embarque PostgreSQL 18.6 — **exécuté avec succès ici** |

Aucune dépendance ne sera ajoutée sans être vérifiée installable depuis ce dépôt.

### 2.2 Trois décisions d'architecture structurantes

**A. L'argent est stocké en unités mineures entières.**
Jamais de `float`/`double precision` pour un montant. `amount_minor BIGINT` + `currency CHAR(3)`, avec une table `currency_exponents` (EUR/USD → 2, **XOF → 0**). Un arrondi appliqué une seule fois, en fin de calcul, avec `round half up` explicite. C'est la condition pour que 1 000 000 FCFA restent 1 000 000 FCFA.

**B. Les soldes ne sont jamais recalculés « à la volée ».**
Une table `ledger_entries` (registre à double entrée) est la **source de vérité** ; le solde disponible d'un affilié en est une projection. Conséquence : chaque franc est traçable jusqu'à la commission, la conversion et le clic d'origine. Un `SELECT` sur une vue ne peut pas devenir faux parce qu'une ligne a été modifiée ailleurs.

**C. La RLS est la dernière ligne de défense, pas la première.**
L'application vérifie les permissions, **et** la base les revérifie. Un bug dans un écran ne doit jamais suffire à exposer les données d'un autre annonceur. Chaque migration ajoute ses politiques, et un test automatisé tente une lecture croisée entre deux tenants et **doit échouer**.

---

## 3. Structure des dossiers proposée

```
Relance-clients-/                      # (renommage éventuel → voir D2)
├─ apps/
│  └─ web/                             # Next.js 16 — la seule application déployée
│     ├─ src/
│     │  ├─ app/
│     │  │  ├─ [locale]/               # fr / en
│     │  │  │  ├─ (marketing)/         # accueil, fonctionnalités, tarifs, à propos,
│     │  │  │  │                       # aide, contact, CGU, confidentialité, cookies
│     │  │  │  ├─ (auth)/              # connexion, inscription, mot de passe oublié,
│     │  │  │  │                       # vérification email, onboarding
│     │  │  │  ├─ (dashboard)/         # espace AFFILIÉ : overview, programmes, liens,
│     │  │  │  │                       # stats, commissions, paiements, IA, paramètres
│     │  │  │  ├─ (advertiser)/        # espace ANNONCEUR : programme, produits,
│     │  │  │  │                       # affiliés, conversions, paiements, rapports, API
│     │  │  │  ├─ (admin)/             # SUPER ADMIN — arbre de routes séparé
│     │  │  │  └─ (legal)/
│     │  │  ├─ r/[code]/route.ts       # ★ redirect + tracking (public, durci)
│     │  │  ├─ api/v1/…               # API publique (clés API, versionnée)
│     │  │  ├─ api/webhooks/stripe/route.ts
│     │  │  ├─ api/webhooks/conversions/[program]/route.ts
│     │  │  ├─ sitemap.ts · robots.ts · manifest.ts
│     │  │  └─ layout.tsx
│     │  ├─ components/
│     │  │  ├─ ui/                     # primitives (Button, Card, Table, Modal…)
│     │  │  ├─ charts/                 # graphiques (SVG maison, pas de dépendance lourde)
│     │  │  ├─ marketing/
│     │  │  └─ dashboard/
│     │  ├─ features/                  # découpage par domaine fonctionnel
│     │  │  ├─ programs/  links/  tracking/  commissions/  payouts/
│     │  │  ├─ billing/   ai/       notifications/  admin/  auth/
│     │  │  └─ …/ (server actions + composants + hooks propres au domaine)
│     │  ├─ lib/
│     │  │  ├─ domain/                 # ★ CŒUR — pur, sans framework
│     │  │  │  ├─ commission/          # calcul, arrondis, récurrence
│     │  │  │  ├─ attribution/         # fenêtres, déduplication, méthodes
│     │  │  │  ├─ money/              # unités mineures, FX, exposants devise
│     │  │  │  ├─ ledger/             # écritures comptables
│     │  │  │  └─ __tests__/          # tests unitaires (le filet de sécurité)
│     │  │  ├─ adapters/
│     │  │  │  ├─ payments/           # interface + stripe/ + mobilemoney/ + manual/
│     │  │  │  ├─ ai/                 # interface + openai/ + anthropic/ + mistral/
│     │  │  │  └─ storage/            # interface + r2/ + supabase/
│     │  │  ├─ db/                     # client Supabase server/browser/admin
│     │  │  ├─ auth/                   # sessions, rôles, gardes de route
│     │  │  ├─ security/              # rate limit, HMAC webhook, hash IP, sanitisation
│     │  │  └─ i18n/                  # dictionnaires fr/en
│     │  └─ middleware.ts              # locale + garde d'authentification + rôles
│     └─ tests/
│        ├─ integration/              # migrations + RLS sur PGlite
│        └─ e2e/                      # Playwright (optionnel, phase 9)
├─ supabase/
│  ├─ migrations/                     # 0001_init.sql, 0002_rls.sql, … numérotées
│  ├─ seed/                           # données de DÉMONSTRATION explicitement étiquetées
│  ├─ functions/                      # Edge Functions (si nécessaires)
│  └─ config.toml
├─ docs/
│  ├─ 01-analyse-architecture.md      # ← ce document
│  ├─ 02-design-system.md             # phase 2
│  ├─ 03-base-de-donnees.md           # phase 3
│  ├─ api/                            # documentation API publique
│  ├─ deployment.md · security.md · tests-report.md
│  └─ costs.md
├─ scripts/
│  ├─ bootstrap-admin.ts              # ★ création sécurisée du 1er admin
│  └─ db-test.ts                      # ★ exécute les migrations sur PGlite
├─ legacy/relance-clients/            # ← sort de l'index.html actuel (décision D1)
├─ .env.example
└─ package.json
```

Principe : **un domaine = un dossier** (`features/…`), et la logique financière vit dans `lib/domain/`, isolée et testée. Aucun fichier ne concentre l'application.

---

## 4. Périmètre du MVP

Objectif : un produit **vendable et fonctionnel**, pas une vitrine. Chaque bouton livré doit faire quelque chose.

### 4.1 Dans le MVP

**Socle**
- Inscription avec choix du rôle (affilié / annonceur), connexion, déconnexion, vérification d'e-mail, mot de passe oublié.
- Amorçage **sécurisé** du compte administrateur (script + token, hors inscription publique).
- Interface fr/en, thème clair/sombre, responsive mobile, devises FCFA / EUR / USD (+ devises configurables).
- Site public complet : accueil, fonctionnalités, solutions affiliés, solutions annonceurs, tarifs, comment ça marche, à propos, aide, contact, CGU, confidentialité, cookies — métadonnées, Open Graph, données structurées, `sitemap.xml`, `robots.txt`.
- **Aucune statistique « réelle » inventée** : les chiffres affichés sur le site public proviennent de la base ou sont explicitement présentés comme des exemples.

**Annonceur**
- Créer / modifier / suspendre un programme ; soumission à modération admin.
- Ajouter produits et services ; définir commission (fixe, %, par prospect, par action, récurrente), fenêtre de cookie, pays ciblés, éligibilité.
- Accepter / refuser les candidatures ; voir les affiliés actifs.
- Suivre clics et conversions ; valider / refuser les commissions ; générer un paiement (manuel au MVP).

**Affilié**
- Parcourir les programmes publiés, filtrer par catégorie et pays, candidater, suivre ses candidatures.
- Générer des liens personnalisés + paramètres UTM, plusieurs liens par produit, copie en un clic, codes promo si autorisés.
- Tableau de bord : programmes rejoints, liens actifs, clics, conversions, taux de conversion, commissions en attente / validées / payées.
- Graphiques par période : clics, conversions, commissions, top produits.
- Demande de retrait (avec seuil minimum), historique des paiements.

**Tracking & commissions (le cœur)**
- `GET /r/[code]` : enregistre le clic (lien, affilié, programme, campagne, UTM, pays, référent, empreinte visiteur **hashée**), respecte le consentement, puis redirige.
- Conversions par **API**, **webhook signé** et **saisie manuelle**. L'intégration e-commerce native est **hors MVP** (elle exige un connecteur par plateforme).
- Idempotence stricte : `unique(program_id, external_reference)`.
- Statuts : en attente → validée → disponible → payée, avec refusée et annulée.
- **Un clic n'est jamais compté comme une vente.**

**Admin**
- Utilisateurs (recherche, suspension, vérification des annonceurs), programmes (approbation/refus/suspension), finances (transactions, commissions, abonnements, demandes de paiement), statistiques **issues de la base**, paramètres de la plateforme (tarifs, modération, seuils), journaux d'audit.

**Monétisation**
- Plans en base (affilié Free/Pro/Premium, annonceur Starter/Business/Enterprise), limites appliquées (nombre de liens, quota IA), page de gestion d'abonnement.
- **Paiement des abonnements : en mode sandbox uniquement** au MVP (voir D3).

**IA**
- Assistant (trouver des programmes, comprendre des conditions, idées de promotion), générateur marketing (textes, e-mails, posts, scripts courts, titres), analyse de performances.
- Multi-fournisseurs, quotas par plan, comptage `ai_usage`, coupe-circuit budgétaire.
- **Désactivé tant qu'aucune clé fournisseur n'est fournie** — l'interface affiche alors un état clair, pas un faux résultat.

**API publique v1**
- Clés API (hashées, périmètres, révocables), programmes, liens, déclaration de conversions, statistiques, commissions, webhooks sortants signés, limite de requêtes, environnement de test, documentation.

### 4.2 Hors MVP (assumé, pas oublié)

| Écarté | Raison |
|---|---|
| Connecteurs e-commerce natifs (Shopify, WooCommerce…) | Un connecteur = un produit. L'API + webhook couvrent le besoin dès le MVP |
| Décaissement automatique Mobile Money | Voir F1 : exige un prestataire et un statut validés. MVP = **paiement manuel tracé** + export |
| Facturation TVA automatique multi-pays | Complexe ; MVP = factures simples + champ TVA configurable |
| Application mobile native | Le web responsive couvre Android/iPhone |
| Marketplace d'offres avec enchères, niveaux d'affiliés, multi-devises par conversion | Version 2 |
| Temps réel (Supabase Realtime) | Rafraîchissement des tableaux de bord suffisant au MVP |

---

## 5. Schéma de base de données

Conventions : `uuid` par défaut (`gen_random_uuid()`), `created_at`/`updated_at` partout, suppression logique (`deleted_at`) sur les entités métier, montants en `bigint` d'unités mineures, RLS activée sur **toutes** les tables.

### 5.1 Identité et multi-tenant

| Table | Rôle | Colonnes clés / contraintes |
|---|---|---|
| `profiles` | 1:1 avec `auth.users` | `id` PK = `auth.users.id`, `email`, `full_name`, `role` ∈ {admin, advertiser, affiliate}, `status` ∈ {pending, active, suspended, banned}, `locale`, `timezone`, `country_code`, `email_verified_at` |
| `organizations` | Tenant annonceur | `id`, `name`, `slug` UNIQUE, `legal_name`, `country`, `currency`, `verification_status`, `owner_id`→`profiles`, `status` |
| `organization_members` | Membres d'une organisation | UNIQUE(`organization_id`,`profile_id`), `role` ∈ {owner, admin, manager, viewer} |
| `advertiser_accounts` | Réglages annonceur | UNIQUE(`organization_id`), `moderation_required`, `default_cookie_days`, `auto_approve_affiliates` |
| `affiliate_accounts` | Réglages affilié | UNIQUE(`profile_id`), `plan_id`, `default_currency`, `payout_threshold_minor`, `payment_profile` `jsonb` (**références uniquement, jamais PAN/CVV**), `tax_info` |

### 5.2 Catalogue et recrutement

| Table | Rôle | Colonnes clés / contraintes |
|---|---|---|
| `programs` | Programme d'affiliation | `organization_id`→org, `slug` UNIQUE, `name`, `description`, `category`, `target_countries text[]`, `cookie_days`, `requires_approval`, `status` ∈ {draft, pending_review, published, suspended, rejected, archived}, `approved_by`→profiles, `approved_at`, `rejection_reason` |
| `products` | Produits/services | `program_id`→programs, `sku`, `product_type` ∈ {product, service, subscription}, `price_minor`, `currency`, `commission_type` ∈ {fixed, percent, per_lead, per_action, recurring}, `commission_value numeric`, `recurring_periods`, `recurring_interval`, `is_active` |
| `campaigns` | Campagnes | `program_id`, `goal` ∈ {sale, lead, action}, `starts_at`, `ends_at`, `budget_minor`, `status` |
| `applications` | Candidatures d'affiliés | UNIQUE(`program_id`,`affiliate_account_id`), `status` ∈ {pending, approved, rejected, withdrawn}, `message`, `reviewer_id`, `reviewed_at` |

### 5.3 Tracking

| Table | Rôle | Colonnes clés / contraintes |
|---|---|---|
| `affiliate_links` | Liens personnalisés | `public_code` UNIQUE (utilisé dans `/r/<code>`), `affiliate_account_id`, `program_id`, `product_id` NULL, `campaign_id` NULL, `destination_url`, `utm jsonb`, `promo_code`, `status` ∈ {active, paused, deleted}. Index : `public_code`, (`affiliate_account_id`, `created_at`) |
| `clicks` | Clics enregistrés | `id bigint`, `link_id`, `affiliate_account_id`, `program_id`, `campaign_id`, `occurred_at`, `click_token uuid`, `visitor_hash`, `ip_hash` (**jamais l'IP en clair**), `user_agent`, `country_code`, `referrer`, `utm jsonb`, `is_unique bool`. Index : (`program_id`,`occurred_at`), (`link_id`,`occurred_at`), `visitor_hash`. **Partitionnée par mois** dès la phase 5 |
| `attribution_settings` | Fenêtres par programme | `program_id`, `cookie_days`, `method_priority` |

### 5.4 Conversions et commissions

| Table | Rôle | Colonnes clés / contraintes |
|---|---|---|
| `conversions` | Conversions déclarées | UNIQUE(**`program_id`,`external_reference`**) ← **anti-doublon**, `affiliate_account_id`, `link_id`, `click_id` NULL, `type` ∈ {sale, lead, action, subscription}, `amount_minor`, `currency`, `fx_rate` (figé à la conversion), `source` ∈ {manual, api, webhook, ecommerce}, `attribution_method`, `status` ∈ {pending, validated, rejected, cancelled}, `customer_email_hash`, `occurred_at` |
| `commissions` | Commissions calculées | UNIQUE(`conversion_id`, `period_index`), `rule_type`, `rule_value` (**instantané de la règle**, pour rester juste même si la règle change après), `amount_minor`, `currency`, `status` ∈ {pending, approved, rejected, available, paid, reversed}, `period_start`/`period_end` (récurrence), `validated_by`, `payout_id` NULL. Index : (`affiliate_account_id`,`status`) |
| `commission_rules` | Règles (produit > campagne > programme) | `program_id`, `product_id` NULL, `campaign_id` NULL, `type`, `value`, `priority`, `recurring_periods`, `starts_at`, `ends_at`, `is_active` |

### 5.5 Argent

| Table | Rôle | Colonnes clés / contraintes |
|---|---|---|
| `ledger_entries` | **Source de vérité** des soldes | `account_type`, `account_id`, `direction` ∈ {debit, credit}, `amount_minor`, `currency`, `ref_type` ∈ {commission, payout, refund, fee, adjustment}, `ref_id`. Append-only (aucune mise à jour) |
| `payouts` | Retraits | `affiliate_account_id`, `amount_minor`, `fee_minor`, `currency`, `method` ∈ {mobile_money, bank_transfer, paypal, provider_transfer, manual}, `destination jsonb` (référence prestataire), `status` ∈ {requested, processing, completed, failed, cancelled}, `reference`, `receipt_url`, `processed_by` |
| `payment_transactions` | Journal prestataire | `direction`, `provider`, `provider_txn_id`, UNIQUE(`provider`,`provider_txn_id`), `gross_minor`, `fee_minor`, `net_minor`, `status`, `related_type`, `related_id`, `raw jsonb` |
| `currency_exponents` | Exposants par devise | `code` PK (EUR=2, USD=2, **XOF=0**, XAF=0), `symbol` |
| `payout_methods_by_country` | Méthodes **confirmées** par pays | `country_code`, `method`, `provider`, `min_amount_minor`, `currency`, `is_enabled` — **rien n'est activé sans confirmation réelle du prestataire** |

### 5.6 Facturation de la plateforme

| Table | Rôle | Colonnes clés |
|---|---|---|
| `plans` | Offres modifiables depuis l'admin | `code`, `audience` ∈ {affiliate, advertiser}, `price_minor`, `currency`, `interval` ∈ {month, year}, `limits jsonb` (max_links, ai_credits, max_programs), `features jsonb`, `is_active` |
| `subscriptions` | Abonnements | `subscriber_type`, `subscriber_id`, `plan_id`, `status` ∈ {trialing, active, past_due, canceled, unpaid}, `provider`, `provider_subscription_id`, `current_period_start/end`, `cancel_at_period_end` |
| `invoices` | Factures | `number` UNIQUE, `subscription_id`, `amount_minor`, `status`, `issued_at`, `paid_at`, `provider_invoice_id`, `pdf_url` |

### 5.7 Exploitation

`notifications` (in-app / e-mail / webhook, `read_at`) · `support_tickets` + `support_ticket_messages` · `ai_usage` (fournisseur, modèle, tokens, `cost_micro_usd`) · `audit_logs` (`actor_id`, `action`, `entity_type`, `entity_id`, `before`/`after` jsonb, append-only) · `webhook_events` (entrants, UNIQUE(`provider`,`event_id`), `signature_verified`) · `webhook_endpoints` (sortants, `secret`, `events[]`) · `api_keys` (`key_hash` — **jamais la clé en clair**, `prefix`, `scopes[]`, `expires_at`, `revoked_at`) · `platform_settings` (clé/valeur jsonb : tarifs, modération, seuils) · `email_outbox`.

### 5.8 Politiques RLS — principe

```sql
-- fonctions d'aide, SECURITY DEFINER, search_path figé (anti-injection)
create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles p
                 where p.id = auth.uid() and p.role = 'admin'
                   and p.status = 'active') $$;

create or replace function public.is_org_member(p_org uuid, p_min text default 'viewer')
  returns boolean language sql stable security definer set search_path = public as $$ … $$;
```

Chaque table : `alter table … enable row level security;` puis politiques par rôle. Règle absolue : **`clicks` n'a aucune politique d'insertion publique** — les clics sont écrits uniquement par le serveur avec la clé `service_role`. Un test d'intégration vérifie qu'un affilié A ne lit pas les liens d'un affilié B et qu'un annonceur A ne lit pas le programme d'un annonceur B.

---

## 6. Technologies et coûts estimés

Tarifs publics relevés le **2026-11-07**. Ce sont des ordres de grandeur à revalider avant tout engagement de dépense.

### 6.1 Infrastructure

| Poste | Option MVP | Coût mensuel | Source |
|---|---|---|---|
| Base + Auth + API | Supabase **Free** (500 Mo BDD, 50 000 MAU, 5 Go egress) | **0 $** | [supabase pricing](https://meetglow.ai/tools/supabase-cost) |
| Base + Auth + API | Supabase **Pro** (8 Go, 100 000 MAU, 250 Go egress, backups quotidiens) | **25 $** + compute (Micro 10 $ inclus) | [supabase pricing](https://meetglow.ai/tools/supabase-cost) |
| Compute Supabase | Small 15 $ / Medium 60 $ / Large 110 $ | 0 → 100 $ | [compute add-ons](https://toolradar.com/blog/supabase-pricing-2026) |
| Hébergement | Vercel **Hobby** — ⚠️ **interdit pour un usage commercial** | 0 $ (non utilisable ici) | [vercel pricing](https://temps.sh/blog/vercel-pricing-complete-guide-2026) |
| Hébergement | Vercel **Pro** (1 siège déployant + 20 $ de crédit d'usage) | **20 $** (+20 $/siège supplémentaire) | [vercel pricing](https://temps.sh/blog/vercel-pricing-complete-guide-2026) |
| Stockage fichiers | **Cloudflare R2** (S3-compatible, egress gratuit) | ~0 $ au MVP | — |
| Stockage fichiers | Alternative : Supabase Storage (100 Go inclus en Pro) | 0 $ puis 0,0213 $/Go | [supabase pricing](https://meetglow.ai/tools/supabase-cost) |
| Surveillance d'erreurs | Sentry (offre gratuite) | 0 $ | — |
| **Total MVP** | Supabase Pro + Vercel Pro + R2 | **≈ 45-60 $/mois** | |
| **Total à l'échelle** | ~30 000 MAU, compute Medium, egress | **≈ 150-300 $/mois** | [supabase à l'échelle](https://toolradar.com/blog/supabase-pricing-2026) |

Alternative basse consommation : VPS (Hetzner/Contabo) + PostgreSQL + Node ≈ 5-15 $/mois, mais **RLS, Auth, backups et API à maintenir soi-même** — je ne la recommande pas au démarrage.

### 6.2 Paiements (à la transaction, aucun abonnement)

| Prestataire | Couverture | Tarif public |
|---|---|---|
| **Stripe** (abonnements SaaS) | International, cartes | UE : **1,5 % + 0,25 €** (carte EEA) · 3,15 % + 0,25 € (international) · Stripe Billing : **+0,7 %** du volume · litige 20 € — [source](https://agentaos.ai/tools/stripe-fee-calculator) |
| **KKiaPay** | Bénin, Côte d'Ivoire, **Togo**, Sénégal | ~1,9 % Mobile Money · ~4 % cartes — [source](https://synnovaplus.com/agregateurs-de-paiement-en-afrique/) |
| **FedaPay** | Bénin, CI, **Togo**, Sénégal, Mali | ~1,8 % Mobile Money · ~3,6 % cartes — [source](https://synnovaplus.com/agregateurs-de-paiement-en-afrique/) |
| **CinetPay** | 10+ pays UEMOA | 1,5 % à 3,5 % selon volume — [source](https://sinedev.com/comparatif-agregateurs-paiement-afrique/) |
| **Paystack** (groupe Stripe) | Nigeria, Ghana, Kenya, Af. du Sud, CI | 1,95 % HT Mobile Money (CI) · 3,2 % carte locale — [source](https://sinedev.com/comparatif-agregateurs-paiement-afrique/) |
| Moov Money Togo (API directe) | Togo | 1,7 % – 2,2 %, plafond 500 000 FCFA/transaction, règlement T+2 à T+3 — [source](https://kolonell.com/fr/blog/integrer-moov-money-benin-togo-site-web-2026) |

⚠️ **Ces tarifs sont ceux de la collecte.** Le décaissement vers les affiliés est un produit distinct (risque F1).

### 6.3 IA

| Modèle | Entrée / 1 M tokens | Sortie / 1 M tokens | Usage conseillé |
|---|---|---|---|
| GPT-4.1 nano | 0,10 $ | 0,40 $ | classification, extraction |
| Mistral Small | 0,10 – 0,20 $ | 0,30 – 0,60 $ | rédaction courte, souveraineté UE |
| GPT-4.1 mini | 0,40 $ | 1,60 $ | **défaut du MVP** |
| Claude Haiku | 0,80 $ | 4,00 $ | alternative |
| GPT-4.1 / Sonnet | 2 – 3 $ | 8 – 15 $ | analyses approfondies (plan Premium) |

Source : [LLM pricing 2026](https://pecollective.com/blog/llm-pricing-comparison-2026/) · mode batch OpenAI : **−50 %**.

**Budget type** : 1 000 générations/mois ≈ 1,2 M tokens en entrée + 0,4 M en sortie sur GPT-4.1 mini ≈ **1,12 $/mois**. Le quota par plan reste le vrai garde-fou, pas le prix du token.

### 6.4 Coût total réaliste

| Étape | Mensuel |
|---|---|
| Développement (ce dépôt, sandbox) | **0 $** |
| MVP en production, premiers utilisateurs | **≈ 45-60 $/mois** |
| MVP + Stripe + un fournisseur IA actif | **≈ 50-70 $/mois** |
| 30 000 utilisateurs actifs | **≈ 150-300 $/mois** |
| Nom de domaine | ≈ 10-15 $/an |

Aucun service payant ne sera ajouté sans que son utilité et son alternative gratuite soient expliquées.

---

## 7. Plan de développement

Chaque phase se termine par un livrable vérifiable. **Je m'arrête à la fin de chaque phase et j'attends ta validation.**

| Phase | Contenu | Livrable | Comment ce sera vérifié |
|---|---|---|---|
| **1** | Analyse, architecture, schéma, coûts | `docs/01-analyse-architecture.md` | ← ce document, en attente de ta validation |
| **2** | Identité visuelle, design system, maquettes des parcours | `docs/02-design-system.md` + composants `ui/` + logo + thèmes clair/sombre + fr/en | `next build` passe ; les pages de démonstration s'affichent en local |
| **3** | Base de données : migrations SQL + RLS + index + contraintes | `supabase/migrations/*.sql` | **Chaque migration exécutée sur PostgreSQL 18.6 (PGlite)** + tests RLS cross-tenant qui **doivent échouer** |
| **4** | Authentification, rôles, onboarding, amorçage admin | `features/auth/`, `scripts/bootstrap-admin.ts` | Tests sur les gardes de rôle ; procédure admin exécutée de bout en bout |
| **5** | Programmes, produits, candidatures, liens, **tracking**, conversions, **commissions** | `features/{programs,links,tracking,commissions}/` | **Tests unitaires du calcul de commission** (fixe, %, récurrente, prospect, action, arrondis XOF/EUR), tests d'attribution et d'**idempotence** (même référence rejetée 2 fois) |
| **6** | Module IA multi-fournisseurs + quotas | `lib/adapters/ai/`, `features/ai/` | Tests avec fournisseur **bouchonné** ; coupe-circuit budgétaire testé |
| **7** | Abonnements, factures, retraits, adaptateurs de paiement | `features/{billing,payouts}/`, `lib/adapters/payments/` | Tests du cycle de vie d'un abonnement et du registre comptable en mode **bouchonné** ; le mode réel reste désactivé sans tes clés |
| **8** | Tableau de bord super admin + paramètres + audit | `app/[locale]/(admin)/` | Toutes les statistiques lues depuis la base, aucune donnée inventée |
| **9** | Tests globaux, sécurité, responsive, corrections | `docs/tests-report.md` | Suite complète : unitaires + intégration SQL/RLS + `tsc --noEmit` + `next build` + revue sécurité |
| **10** | Déploiement, documentation, SEO final, `.env.example` | `docs/{deployment,api,security}.md`, `README.md` | Checklist de mise en production exécutée |

### Critère de fin global

Une fonctionnalité n'est déclarée terminée que si : (1) son code est exécuté par un test ou une commande que je peux te montrer, (2) son état réel (**vérifié** / **non vérifiable ici**) est écrit noir sur blanc, (3) aucun bouton ne pointe vers du vide.

---

## 8. Décisions à valider avant de passer à la phase 2

| # | Décision | Options |
|---|---|---|
| **D1** | Que faire de `index.html` (Relance Clients) et de sa clé Supabase publiée ? | (a) archiver dans `legacy/relance-clients/` · (b) supprimer du dépôt (l'historique Git le conserve) · (c) laisser tel quel |
| **D2** | Le dépôt s'appelle `Relance-clients-`. Renommer vers AffiliateOS ? | (a) oui, je renomme le dépôt GitHub · (b) non, on garde le nom |
| **D3** | Périmètre exact du MVP | (a) MVP-A : tracking + commissions, paiements **manuels** uniquement · (b) MVP-B : + abonnements Stripe en **sandbox** · (c) MVP-C : + décaissement Mobile Money réel (⚠️ dépend de F1) |
| **D4** | Environnement Supabase | (a) tu crées un projet et tu me transmets les clés (je ne peux pas y accéder du sandbox, tu appliquerais les migrations) · (b) je développe et valide tout sur PGlite, tu appliques ensuite · (c) autre |
| **D5** | Fournisseur IA au démarrage | (a) OpenAI · (b) Anthropic · (c) Mistral · (d) interface livrée sans clé (IA inactive au démarrage) |
| **D6** | Devise de facturation de la plateforme | (a) USD · (b) EUR · (c) les deux avec conversion · (d) XOF en affichage local |

Réponse attendue : **« phase 2 validée »** (éventuellement avec tes choix D1-D6), ou tes corrections sur ce document.

---

## 9. Ce que je n'ai PAS fait

- Aucun code applicatif écrit.
- Aucune donnée inventée : pas de statistiques, pas de témoignages, pas de logo d'un tiers.
- Aucun paiement simulé présenté comme réel.
- Aucun secret exposé (la clé trouvée dans `index.html` est signalée, pas réutilisée).
- Aucune migration exécutée contre un vrai projet Supabase — impossible depuis cet environnement (voir C3).
