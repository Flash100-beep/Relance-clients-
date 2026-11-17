/**
 * Contenu des pages légales.
 *
 * ⚠️ DOCUMENTS DE TRAVAIL.
 * Ces textes décrivent le fonctionnement réel prévu d'AffiliateOS, mais ils
 * n'ont aucune valeur juridique en l'état. Ils doivent être relus, adaptés à
 * la juridiction de l'exploitant (notamment RGPD et loi togolaise sur la
 * protection des données à caractère personnel) et validés par un
 * professionnel du droit avant toute mise en production commerciale.
 */

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  sections: LegalSection[];
}

const terms: Record<'fr' | 'en', LegalDocument> = {
  fr: {
    title: 'Conditions générales',
    sections: [
      {
        heading: '1. Objet',
        paragraphs: [
          "Les présentes conditions générales régissent l'utilisation de la plateforme AffiliateOS, un service en ligne permettant aux annonceurs de créer et de piloter des programmes d'affiliation, et aux affiliés de promouvoir des offres et de suivre leurs commissions.",
          "Toute création de compte emporte acceptation des présentes conditions. Si vous utilisez AffiliateOS pour le compte d'une entreprise, vous déclarez disposer du pouvoir de l'engager.",
        ],
      },
      {
        heading: '2. Définitions',
        paragraphs: [
          "« Annonceur » : l'utilisateur qui crée un programme d'affiliation et rémunère des affiliés. « Affilié » : l'utilisateur qui promeut les offres d'un annonceur. « Programme » : l'ensemble des règles, produits et taux de commission définis par un annonceur. « Conversion » : l'action mesurable (vente, prospect, action) donnant lieu, le cas échéant, à une commission.",
        ],
      },
      {
        heading: '3. Comptes et inscription',
        paragraphs: [
          "L'inscription exige une adresse e-mail valide et un mot de passe. Chaque utilisateur choisit un rôle — affilié ou annonceur — et peut détenir les deux, dans des espaces distincts.",
          "Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée depuis votre compte. Toute utilisation non autorisée doit être signalée sans délai.",
          "Le compte administrateur de la plateforme n'est pas accessible par l'inscription publique : il est créé par une procédure technique contrôlée.",
        ],
      },
      {
        heading: '4. Abonnements et facturation',
        paragraphs: [
          "AffiliateOS propose des abonnements mensuels et annuels, distincts pour les affiliés et pour les annonceurs. Les tarifs en vigueur sont affichés sur la page Tarifs et stockés en base de données ; ils peuvent évoluer, sans effet rétroactif sur la période déjà payée.",
          "Un abonnement se renouvelle automatiquement jusqu'à son annulation. L'annulation prend effet à la fin de la période en cours et n'ouvre pas droit à remboursement, sauf obligation légale contraire.",
          "En cas d'échec de paiement, l'accès aux fonctionnalités payantes peut être suspendu après notification.",
        ],
      },
      {
        heading: '5. Programmes, commissions et paiements',
        paragraphs: [
          "L'annonceur définit seul ses taux de commission, ses conditions d'éligibilité, les pays ciblés et la durée d'attribution. AffiliateOS calcule et affiche les commissions ; elle n'est pas partie au contrat qui lie l'annonceur à l'affilié.",
          "Une commission n'est exigible qu'après validation par l'annonceur. Un clic, quel qu'en soit le volume, ne constitue jamais une vente ni une commission due.",
          "Les remboursements et annulations de commande entraînent l'annulation de la commission correspondante, y compris si elle a déjà été versée.",
          "Le montant minimum de retrait et les moyens de paiement disponibles dépendent du programme et du pays de l'affilié. AffiliateOS ne garantit pas la disponibilité d'un moyen de paiement donné dans un pays donné.",
        ],
      },
      {
        heading: '6. Interdictions et lutte contre la fraude',
        paragraphs: [
          "Sont notamment interdits : générer des clics artificiels ou automatisés, simuler des conversions, usurper l'identité d'un tiers, détourner du trafic par des méthodes trompeuses, utiliser des marques ou des contenus sans droit, et tenter de contourner les mécanismes de sécurité ou d'attribution.",
          "AffiliateOS peut suspendre un compte, annuler des commissions et conserver les éléments techniques nécessaires à la constatation d'une fraude.",
        ],
      },
      {
        heading: '7. Responsabilité',
        paragraphs: [
          "AffiliateOS est fournie « en l'état » dans les limites permises par la loi. La plateforme ne saurait être tenue responsable des produits et services promus, des relations contractuelles entre annonceurs et affiliés, ni du manque à gagner résultant d'une indisponibilité du service.",
          "La responsabilité de l'annonceur reste entière quant à la licéité de ses offres et au respect du droit de la consommation et de la publicité applicable.",
        ],
      },
      {
        heading: '8. Données personnelles',
        paragraphs: [
          "Le traitement des données à caractère personnel est décrit dans la politique de confidentialité, qui fait partie intégrante des présentes conditions.",
        ],
      },
      {
        heading: '9. Suspension et résiliation',
        paragraphs: [
          "Chaque partie peut mettre fin à son utilisation du service. AffiliateOS peut suspendre ou clôturer un compte en cas de manquement aux présentes, de fraude avérée ou d'obligation légale.",
          "La résiliation ne supprime pas les obligations de paiement nées avant sa prise d'effet.",
        ],
      },
      {
        heading: '10. Droit applicable et litiges',
        paragraphs: [
          "Le droit applicable et la juridiction compétente seront déterminés en fonction du lieu d'établissement de l'exploitant de la plateforme et devront être précisés avant la mise en production commerciale.",
          "À défaut de résolution amiable, tout litige sera soumis aux tribunaux compétents de ce ressort.",
        ],
      },
      {
        heading: '11. Contact',
        paragraphs: [
          "Toute question relative aux présentes conditions peut être adressée via la page Contact.",
        ],
      },
    ],
  },
  en: {
    title: 'Terms of service',
    sections: [
      {
        heading: '1. Purpose',
        paragraphs: [
          'These terms of service govern the use of AffiliateOS, an online service that lets advertisers create and run affiliate programs and lets affiliates promote offers and track their commissions.',
          'Creating an account constitutes acceptance of these terms. If you use AffiliateOS on behalf of a company, you represent that you have the authority to bind it.',
        ],
      },
      {
        heading: '2. Definitions',
        paragraphs: [
          '"Advertiser": the user who creates an affiliate program and rewards affiliates. "Affiliate": the user who promotes an advertiser\'s offers. "Program": the set of rules, products and commission rates defined by an advertiser. "Conversion": the measurable action (sale, lead, action) that may give rise to a commission.',
        ],
      },
      {
        heading: '3. Accounts and registration',
        paragraphs: [
          'Registration requires a valid email address and a password. Each user selects a role — affiliate or advertiser — and may hold both, in separate workspaces.',
          'You are responsible for keeping your credentials confidential and for all activity carried out from your account. Any unauthorised use must be reported immediately.',
          'The platform administrator account is not available through public registration: it is created by a controlled technical procedure.',
        ],
      },
      {
        heading: '4. Subscriptions and billing',
        paragraphs: [
          'AffiliateOS offers monthly and annual subscriptions, separate for affiliates and for advertisers. Current prices are shown on the Pricing page and stored in the database; they may change, without retroactive effect on a period already paid for.',
          'A subscription renews automatically until cancelled. Cancellation takes effect at the end of the current period and does not give rise to a refund, except where required by law.',
          'If a payment fails, access to paid features may be suspended after notification.',
        ],
      },
      {
        heading: '5. Programs, commissions and payouts',
        paragraphs: [
          'The advertiser alone sets its commission rates, eligibility conditions, target countries and attribution window. AffiliateOS calculates and displays commissions; it is not a party to the contract between the advertiser and the affiliate.',
          'A commission becomes due only after validation by the advertiser. A click, whatever its volume, never constitutes a sale or a commission owed.',
          'Order refunds and cancellations lead to the cancellation of the corresponding commission, including where it has already been paid out.',
          'The minimum payout amount and available payment methods depend on the program and on the affiliate\'s country. AffiliateOS does not guarantee that any given payment method is available in any given country.',
        ],
      },
      {
        heading: '6. Prohibited uses and fraud prevention',
        paragraphs: [
          'Prohibited practices include, without limitation: generating artificial or automated clicks, simulating conversions, impersonating a third party, diverting traffic through deceptive means, using brands or content without rights, and attempting to bypass security or attribution mechanisms.',
          'AffiliateOS may suspend an account, cancel commissions and retain the technical evidence necessary to establish fraud.',
        ],
      },
      {
        heading: '7. Liability',
        paragraphs: [
          'AffiliateOS is provided "as is" to the extent permitted by law. The platform cannot be held liable for the products and services promoted, for the contractual relationship between advertisers and affiliates, or for lost earnings resulting from service unavailability.',
          'The advertiser remains fully responsible for the lawfulness of its offers and for compliance with applicable consumer and advertising law.',
        ],
      },
      {
        heading: '8. Personal data',
        paragraphs: [
          'The processing of personal data is described in the privacy policy, which forms an integral part of these terms.',
        ],
      },
      {
        heading: '9. Suspension and termination',
        paragraphs: [
          'Each party may end its use of the service. AffiliateOS may suspend or close an account in the event of a breach of these terms, proven fraud or a legal obligation.',
          'Termination does not extinguish payment obligations arising before it takes effect.',
        ],
      },
      {
        heading: '10. Governing law and disputes',
        paragraphs: [
          'The governing law and competent jurisdiction will be determined according to the place of establishment of the platform operator and must be specified before commercial production launch.',
          'Failing an amicable resolution, any dispute will be brought before the competent courts of that jurisdiction.',
        ],
      },
      {
        heading: '11. Contact',
        paragraphs: [
          'Any question about these terms can be sent through the Contact page.',
        ],
      },
    ],
  },
};

const privacy: Record<'fr' | 'en', LegalDocument> = {
  fr: {
    title: 'Politique de confidentialité',
    sections: [
      {
        heading: '1. Responsable du traitement',
        paragraphs: [
          "Le responsable du traitement des données est l'entité exploitant AffiliateOS. Ses coordonnées complètes et, le cas échéant, celles de son représentant et de son délégué à la protection des données doivent être précisées avant la mise en production.",
        ],
      },
      {
        heading: '2. Données collectées',
        paragraphs: [
          "Données de compte : adresse e-mail, mot de passe chiffré, nom, rôle, pays, langue et fuseau horaire.",
          "Données d'activité : programmes rejoints, liens créés, clics enregistrés, conversions, commissions et demandes de paiement.",
          "Données de tracking : pour chaque clic, un horodatage, un identifiant de lien, des paramètres de campagne, un pays approximatif, un agent utilisateur et une empreinte de visiteur sous forme hachée.",
          "Données techniques : journaux de connexion, journaux d'erreurs et journaux d'audit des actions sensibles.",
        ],
      },
      {
        heading: '3. Ce que la plateforme ne stocke pas',
        paragraphs: [
          "AffiliateOS ne stocke aucun numéro de carte bancaire complet et aucun cryptogramme visuel. Les moyens de paiement ne sont conservés que sous forme de référence ou de jeton fourni par le prestataire de paiement.",
          "Les adresses IP et les adresses e-mail utilisées à des fins de tracking sont hachées avant enregistrement : la valeur d'origine n'est pas conservée dans les tables de suivi.",
        ],
      },
      {
        heading: '4. Finalités et bases légales',
        paragraphs: [
          "Exécution du contrat : fournir le service, calculer les commissions, traiter les paiements.",
          "Consentement : dépôt d'une empreinte de visiteur à des fins d'attribution d'affiliation, et dépôt de cookies non strictement nécessaires.",
          "Intérêt légitime : prévention de la fraude, sécurité du service, mesure d'audience agrégée.",
          "Obligation légale : conservation des pièces comptables et réponse aux réquisitions.",
        ],
      },
      {
        heading: '5. Destinataires',
        paragraphs: [
          "Les données d'un annonceur ne sont accessibles qu'à lui-même et aux membres de son organisation. Un affilié ne voit que ses propres données et les informations que l'annonceur accepte de lui communiquer.",
          "Des sous-traitants techniques peuvent accéder aux données dans la limite de leurs missions : hébergement, base de données, envoi d'e-mails, paiement et fournisseur d'intelligence artificielle. Chaque sous-traitant est encadré par contrat.",
          "Lorsqu'une donnée est transmise à un fournisseur d'intelligence artificielle, elle est limitée au strict nécessaire à la génération demandée et n'est pas utilisée pour entraîner un modèle tiers.",
        ],
      },
      {
        heading: '6. Durée de conservation',
        paragraphs: [
          "Comptes : pendant la durée de la relation contractuelle, puis archivage ou suppression selon les délais légaux.",
          "Données de tracking : une durée limitée, configurable, alignée sur la fenêtre d'attribution et les exigences de minimisation.",
          "Pièces comptables : selon la durée légale applicable dans la juridiction de l'exploitant.",
        ],
      },
      {
        heading: '7. Sécurité',
        paragraphs: [
          "Les données sont isolées au niveau de la base : chaque entreprise ne peut accéder qu'à ses propres données, y compris en cas d'erreur dans l'interface. Les secrets techniques ne sont jamais exposés au navigateur. Les actions sensibles sont journalisées.",
        ],
      },
      {
        heading: '8. Vos droits',
        paragraphs: [
          "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, ainsi que du droit de retirer votre consentement à tout moment.",
          "Selon votre lieu de résidence, vous pouvez introduire une réclamation auprès de l'autorité de protection des données compétente (par exemple la CNIL en France ou l'IPDP au Togo).",
        ],
      },
      {
        heading: '9. Transferts internationaux',
        paragraphs: [
          "Certains sous-traitants peuvent traiter des données hors de votre pays de résidence. Ces transferts sont encadrés par les garanties appropriées (clauses contractuelles types ou décision d'adéquation).",
        ],
      },
      {
        heading: '10. Contact',
        paragraphs: [
          "Pour exercer vos droits ou poser une question relative à cette politique, utilisez la page Contact.",
        ],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    sections: [
      {
        heading: '1. Data controller',
        paragraphs: [
          'The data controller is the entity operating AffiliateOS. Its full contact details and, where applicable, those of its representative and data protection officer must be specified before production launch.',
        ],
      },
      {
        heading: '2. Data collected',
        paragraphs: [
          'Account data: email address, encrypted password, name, role, country, language and time zone.',
          'Activity data: programs joined, links created, recorded clicks, conversions, commissions and payout requests.',
          'Tracking data: for each click, a timestamp, a link identifier, campaign parameters, an approximate country, a user agent and a visitor fingerprint in hashed form.',
          'Technical data: login logs, error logs and audit logs of sensitive actions.',
        ],
      },
      {
        heading: '3. What the platform does not store',
        paragraphs: [
          'AffiliateOS stores no full card number and no card security code. Payment methods are kept only as a reference or token issued by the payment provider.',
          'IP addresses and email addresses used for tracking are hashed before storage: the original value is not kept in the tracking tables.',
        ],
      },
      {
        heading: '4. Purposes and legal bases',
        paragraphs: [
          'Performance of the contract: providing the service, calculating commissions, processing payouts.',
          'Consent: setting a visitor fingerprint for affiliate attribution, and setting cookies that are not strictly necessary.',
          'Legitimate interest: fraud prevention, service security, aggregated audience measurement.',
          'Legal obligation: retention of accounting records and response to lawful requests.',
        ],
      },
      {
        heading: '5. Recipients',
        paragraphs: [
          "An advertiser's data is accessible only to that advertiser and to the members of its organisation. An affiliate sees only their own data and the information the advertiser agrees to share.",
          'Technical processors may access data within the scope of their duties: hosting, database, email delivery, payment and artificial intelligence provider. Each processor is bound by contract.',
          'When data is sent to an AI provider, it is limited to what is strictly necessary for the requested generation and is not used to train a third-party model.',
        ],
      },
      {
        heading: '6. Retention',
        paragraphs: [
          'Accounts: for the duration of the contractual relationship, then archived or deleted according to statutory periods.',
          'Tracking data: a limited, configurable period aligned with the attribution window and data minimisation requirements.',
          'Accounting records: according to the statutory period applicable in the operator\'s jurisdiction.',
        ],
      },
      {
        heading: '7. Security',
        paragraphs: [
          'Data is isolated at the database level: each company can access only its own data, even if the interface contains a bug. Technical secrets are never exposed to the browser. Sensitive actions are logged.',
        ],
      },
      {
        heading: '8. Your rights',
        paragraphs: [
          'You have the right of access, rectification, erasure, restriction, objection and portability, as well as the right to withdraw your consent at any time.',
          'Depending on where you live, you may lodge a complaint with the competent data protection authority (for example the CNIL in France or the IPDP in Togo).',
        ],
      },
      {
        heading: '9. International transfers',
        paragraphs: [
          'Some processors may handle data outside your country of residence. Such transfers are governed by appropriate safeguards (standard contractual clauses or an adequacy decision).',
        ],
      },
      {
        heading: '10. Contact',
        paragraphs: [
          'To exercise your rights or ask a question about this policy, use the Contact page.',
        ],
      },
    ],
  },
};

const cookies: Record<'fr' | 'en', LegalDocument> = {
  fr: {
    title: 'Politique de cookies',
    sections: [
      {
        heading: '1. Qu\'est-ce qu\'un cookie ?',
        paragraphs: [
          "Un cookie est un petit fichier déposé sur votre terminal lors de la consultation d'un site. Il sert à faire fonctionner le service, à mémoriser vos préférences ou à mesurer l'audience.",
        ],
      },
      {
        heading: '2. Cookies strictement nécessaires',
        paragraphs: [
          "Session de connexion, protection contre la falsification de requêtes et mémorisation de votre choix de langue et de thème. Ces cookies ne nécessitent pas de consentement : sans eux, le service ne fonctionne pas.",
        ],
      },
      {
        heading: '3. Le cookie d\'attribution d\'affiliation',
        paragraphs: [
          "Lorsqu'un visiteur arrive via un lien d'affilié, une empreinte de visiteur peut être déposée afin de rattacher une conversion ultérieure à ce clic. Cette empreinte est hachée et ne contient pas d'identité.",
          "Ce dépôt est soumis au consentement du visiteur et à la fenêtre d'attribution définie par l'annonceur. En l'absence de consentement, le clic est compté mais aucune empreinte durable n'est déposée.",
        ],
      },
      {
        heading: '4. Cookies de mesure d\'audience',
        paragraphs: [
          "Ils permettent de comprendre quelles pages sont consultées et d'améliorer le service. Ils ne sont déposés qu'avec votre consentement et produisent des statistiques agrégées.",
        ],
      },
      {
        heading: '5. Absence de cookies publicitaires tiers',
        paragraphs: [
          "AffiliateOS ne dépose pas, à ce stade, de cookie publicitaire de tiers ni de pixel de reciblage. Si cela devait changer, cette page serait mise à jour et un consentement explicite serait recueilli.",
        ],
      },
      {
        heading: '6. Gérer vos cookies',
        paragraphs: [
          "Vous pouvez à tout moment retirer votre consentement ou supprimer les cookies depuis les réglages de votre navigateur. La suppression des cookies strictement nécessaires peut empêcher la connexion à votre compte.",
        ],
      },
    ],
  },
  en: {
    title: 'Cookie policy',
    sections: [
      {
        heading: '1. What is a cookie?',
        paragraphs: [
          'A cookie is a small file placed on your device when you visit a site. It is used to make the service work, to remember your preferences or to measure audience.',
        ],
      },
      {
        heading: '2. Strictly necessary cookies',
        paragraphs: [
          'Login session, request forgery protection, and remembering your language and theme choices. These cookies do not require consent: without them the service does not work.',
        ],
      },
      {
        heading: '3. The affiliate attribution cookie',
        paragraphs: [
          'When a visitor arrives through an affiliate link, a visitor fingerprint may be set so that a later conversion can be matched to that click. The fingerprint is hashed and contains no identity.',
          "This is subject to the visitor's consent and to the attribution window set by the advertiser. Without consent, the click is counted but no durable fingerprint is set.",
        ],
      },
      {
        heading: '4. Audience measurement cookies',
        paragraphs: [
          'They help us understand which pages are viewed and improve the service. They are set only with your consent and produce aggregated statistics.',
        ],
      },
      {
        heading: '5. No third-party advertising cookies',
        paragraphs: [
          'AffiliateOS does not, at this stage, set any third-party advertising cookie or retargeting pixel. If that were to change, this page would be updated and explicit consent would be collected.',
        ],
      },
      {
        heading: '6. Managing your cookies',
        paragraphs: [
          'You can withdraw your consent or delete cookies at any time from your browser settings. Deleting strictly necessary cookies may prevent you from signing in to your account.',
        ],
      },
    ],
  },
};

export const legalDocuments = {
  terms,
  privacy,
  cookies,
} as const;

export type LegalKey = keyof typeof legalDocuments;
