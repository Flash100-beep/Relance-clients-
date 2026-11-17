/**
 * Données structurées JSON-LD.
 *
 * Rendu dans une balise `<script type="application/ld+json">` côté serveur :
 * aucune exécution JavaScript n'est nécessaire pour que les moteurs de
 * recherche les lisent.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Le contenu est sérialisé par JSON.stringify à partir d'objets construits
      // côté serveur, sans aucune donnée saisie par un utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
