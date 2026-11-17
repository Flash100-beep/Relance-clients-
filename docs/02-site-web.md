# AFFILIATEOS — Site web public (étape 2)

> Livré le 2026-11-07 sur la branche `arena/9609d122-relance-clients`.
> Emplacement : `apps/web/`
> Ce document décrit ce qui est **réellement construit et vérifié**, et ce qui ne l'est pas encore.

---

## 1. Comment le lancer

```bash
cd apps/web
npm install
npm run typecheck   # tsc --noEmit
npm run build       # build de production
npm start           # http://localhost:3000  (-H 0.0.0.0 dans le script)
```

En développement : `npm run dev` (même hôte, même port).

**Aucune variable d'environnement n'est requise** pour faire tourner le site public.
Deux variables optionnelles existent déjà :

| Variable | Rôle | Défaut |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base des URL canoniques, sitemap, robots, Open Graph | `http://localhost:3000` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Adresse affichée et cible du formulaire de contact | `contact@affiliateos.app` |

⚠️ Ces deux valeurs **doivent être remplacées** avant la mise en production. Ce sont des
valeurs publiques (préfixe `NEXT_PUBLIC_`) : elles ne doivent jamais contenir de secret.

---

## 2. Ce qui est construit

### 2.1 Les 15 pages exigées, en français et en anglais

| Page | Route | Statut |
|---|---|---|
| Accueil commercial | `/` | ✅ rendue |
| Fonctionnalités | `/fonctionnalites` | ✅ rendue |
| Tarifs | `/tarifs` | ✅ rendue, interactive |
| Solutions affiliés | `/affilies` | ✅ rendue |
| Solutions annonceurs | `/annonceurs` | ✅ rendue |
| Comment ça marche | `/comment-ca-marche` | ✅ rendue |
| Centre d'aide | `/aide` | ✅ rendue, recherche fonctionnelle |
| À propos | `/a-propos` | ✅ rendue |
| Contact | `/contact` | ✅ rendue, formulaire fonctionnel |
| Conditions générales | `/cgu` | ✅ rendue |
| Politique de confidentialité | `/confidentialite` | ✅ rendue |
| Politique de cookies | `/cookies` | ✅ rendue |
| Inscription | `/inscription` | ✅ rendue — **voir §4** |
| Connexion | `/connexion` | ✅ rendue — **voir §4** |
| Mot de passe oublié | `/mot-de-passe-oublie` | ✅ rendue — **voir §4** |

Chacune existe sous `/fr/…` et `/en/…`, soit **30 URL** rendues en statique à la compilation.

### 2.2 Identité visuelle

- **Logo original** dessiné en SVG (`components/layout/logo.tsx`) : un nœud central relié à
  deux nœuds, disposés en « A ». Nœud vert = commission validée, nœud violet = module IA.
  Aucun logo tiers n'est utilisé.
- **Palette** conforme à la direction artistique : bleu nuit (`ink-*`), violet (`brand-*`),
  blanc, gris clair, vert (`success-*`), plus ambre et rouge pour les états.
- **Deux thèmes** : clair et sombre, via `next-themes`, jetons CSS dans `styles/globals.css`.
  Bascule persistée, respect de la préférence système, `prefers-reduced-motion` honoré.
- **Typographie** : pile de polices système uniquement. Aucune police distante n'est
  téléchargée — le réseau est contraint et le chargement s'en trouve accéléré.

### 2.3 Design system

Primitives dans `components/ui/` : `Button` / `LinkButton`, `Card`, `Badge`, `Container`,
`Section`, `SectionHeading`, `FeatureItem`. Chacune est utilisée par au moins une page :
**aucun composant mort**.

Accessibilité : lien d'évitement, `:focus-visible` global, zones tactiles ≥ 44 px
(utilitaire `.tap-target`), fermeture du menu mobile à la touche Échap, accordéons en
`<details>/<summary>` natifs (fonctionnent sans JavaScript).

### 2.4 Graphiques sans dépendance

`components/charts/line-chart.tsx` : courbes, aires, grille et légende en **SVG écrit à la
main**. Aucune librairie de graphiques n'est embarquée.

### 2.5 SEO

- `sitemap.xml` généré (28 URL, avec variantes `fr`/`en`).
- `robots.txt` généré : `/api/`, `/dashboard`, `/advertiser`, `/admin`, `/onboarding` fermés.
- Métadonnées par page : titre, description, canonical, `hreflang` fr/en/x-default,
  Open Graph, Twitter Card.
- Données structurées JSON-LD sur l'accueil : `Organization`, `SoftwareApplication`,
  `FAQPage`.
- Tout le contenu public est rendu **côté serveur** : il est présent dans le HTML brut,
  lisible sans exécuter JavaScript.

---

## 3. Vérifications exécutées

Commandes réellement lancées, avec leur résultat brut :

| Vérification | Commande | Résultat |
|---|---|---|
| Types | `npx tsc --noEmit` | `exit=0`, aucune erreur |
| Build de production | `npm run build` | `exit=0`, **34 pages statiques** générées |
| Les 30 URL publiques | `curl -w '%{http_code}'` sur chacune | **30 / 30 → 200** |
| Page inexistante | `curl /fr/xyz` | `404` |
| Redirection racine | `curl /` | `307 → /fr` |
| Locale non supportée | `curl /de` | `307` (renvoi vers la locale par défaut) |
| Sitemap | `curl /sitemap.xml` | `200`, 28 `<loc>` |
| Robots | `curl /robots.txt` | `200` |
| Fuite de clés i18n | recherche `namespace.clé` dans le HTML de 12 pages | **0 occurrence** |
| Parité des traductions | comparaison des arbres de clés fr/en | **366 clés de part et d'autre, 0 différence** |
| Contenu rendu sans JS | recherche du H1 dans le HTML brut | présent |

### Trois défauts trouvés et corrigés pendant cette étape

1. **Fonction passée à un composant client** — le build échouait sur `/fr/tarifs`
   (`Functions cannot be passed directly to Client Components`). Corrigé : les traductions
   sont résolues côté serveur, seul un tableau de plans déjà traduits traverse la frontière.
2. **Titre doublé** — « Tarifs — AffiliateOS — AffiliateOS ». Cause : le suffixe était
   ajouté à la fois par `pageMetadata` et par le `title.template` du layout. Corrigé.
3. **Titre redondant sur `/a-propos`** — « À propos d'AffiliateOS — AffiliateOS ». Le titre
   SEO est maintenant distinct du H1 : « À propos — AffiliateOS ».

---

## 4. Ce qui n'est PAS terminé (aucune dissimulation)

| Élément | État réel |
|---|---|
| **Inscription / connexion / mot de passe oublié** | L'interface et la validation des champs fonctionnent. **Aucun compte n'est créé** : Supabase Auth est branché à l'étape 4. La soumission affiche un encart explicite « Branchement en cours ». Aucun faux message de succès n'est produit. |
| **Formulaire de contact** | Fonctionnel : il ouvre le client de messagerie avec un message prérempli (`mailto:`). **Rien n'est envoyé depuis le serveur** — la messagerie transactionnelle et le ticket en base arrivent avec le backend. C'est indiqué sous le formulaire. |
| **Tableaux de bord** | Non présents. Ils arrivent aux étapes 5 (affilié, annonceur) et 8 (administration). |
| **Aperçu de tableau de bord sur l'accueil** | Illustration affichée avec la mention visible « Aperçu de l'interface — données de démonstration ». Les valeurs viennent de `src/fixtures/demo.ts`, explicitement nommé ainsi. **Aucune statistique n'est présentée comme réelle.** |
| **Témoignages clients** | **Volontairement absents** : aucun témoignage réel n'existe. |
| **Chiffres de performance sur le site** | **Absents** : aucune donnée réelle disponible. |
| **Textes juridiques** | Documents de travail, signalés comme tels en haut de chaque page. À faire relire par un professionnel du droit avant toute mise en production. |
| **Slugs d'URL** | Identiques en français et en anglais (`/en/tarifs`). Des slugs traduits (`/en/pricing`) demandent une table de correspondance : à traiter si le SEO anglophone devient prioritaire. |
| **Image Open Graph** | Absente : aucun fichier OG n'est encore produit. |
| **Bannière de consentement cookies** | Absente : elle arrive avec le tracking (étape 5). |

---

## 5. Deux points mesurés, à arbitrer

### 5.1 Poids JavaScript — objectif non atteint

Objectif annoncé en phase 1 : ≤ 170 Ko compressé. **Mesure réelle : 190,6 Ko compressé**
pour les 10 fichiers référencés par la page d'accueil.

L'écart provient du socle Next.js 16 + React 19, pas du code du site : les deux plus gros
fichiers pèsent à eux seuls 71,7 Ko et 46,4 Ko compressé. Le code applicatif ajouté est
marginal.

Ce qui compense réellement : **tout le contenu public est dans le HTML**, rendu sans
exécuter JavaScript. Sur une connexion contrainte, la page est lisible avant même que le
JS n'arrive.

Décision à prendre : soit relever le budget à 200 Ko en l'assumant, soit réduire — les
leviers sont le retrait de `next-themes` (bascule manuelle par script, ~2 Ko) et un audit
des fragments hydrates. Je n'ai pas modifié l'objectif unilatéralement.

### 5.2 Casse de l'attribut `hreflang`

React 19 sérialise l'attribut en `hrefLang` dans le HTML, que la balise vienne de l'API
`metadata` de Next.js ou d'un `<link>` écrit en JSX (vérifié par sonde dédiée, puis
supprimée).

Conséquence réelle : **aucune**. Dans un document HTML, les noms d'attributs sont comparés
sans tenir compte de la casse ; les moteurs lisent donc `hrefLang="fr"` comme `hreflang="fr"`.
C'est une déviation cosmétique du sérialiseur, pas une rupture fonctionnelle. Je la signale
plutôt que de la passer sous silence.

---

## 6. Structure créée

```
apps/web/
├─ package.json  tsconfig.json  next.config.ts  postcss.config.mjs  .gitignore
└─ src/
   ├─ proxy.ts                     # préfixe de locale (Next 16 : remplace middleware.ts)
   ├─ i18n/       routing.ts · navigation.ts · request.ts
   ├─ messages/   fr.json · en.json            (366 clés chacune)
   ├─ styles/     globals.css                  (jetons clair/sombre)
   ├─ content/    legal.ts                     (CGU, confidentialité, cookies — fr/en)
   ├─ fixtures/   demo.ts                      (données de démonstration étiquetées)
   ├─ lib/        cn.ts · site.ts · seo.ts · auth-labels.ts
   ├─ components/
   │  ├─ ui/          button · primitives
   │  ├─ layout/      header · footer · logo · mobile-nav · theme-toggle ·
   │  │               theme-provider · locale-switch
   │  ├─ marketing/   page-header · cta-section · dashboard-preview · pricing · faq
   │  ├─ charts/      line-chart
   │  ├─ auth/        auth-form · auth-shell
   │  ├─ contact/     contact-form
   │  ├─ help/        help-search
   │  ├─ legal/       legal-page
   │  ├─ seo/         json-ld
   │  └─ icons.tsx
   └─ app/
      ├─ sitemap.ts  robots.ts
      └─ [locale]/
         ├─ layout.tsx · page.tsx · not-found.tsx · error.tsx
         ├─ fonctionnalites · tarifs · affilies · annonceurs · comment-ca-marche
         ├─ a-propos · aide · contact
         ├─ cgu · confidentialite · cookies
         └─ inscription · connexion · mot-de-passe-oublie
```

Le fichier `index.html` d'origine (application « Relance Clients ») n'a pas été modifié ni
déplacé : la décision D1 reste ouverte.

---

## 7. Versions utilisées (vérifiées sur le registre npm)

`next` 16.4.5 · `react` 19.3.1 · `next-intl` 4.14.9 · `next-themes` 0.4.6 ·
`tailwindcss` 4.3.5 · `typescript` 5.7.2

Aucune autre dépendance d'exécution n'a été ajoutée.
