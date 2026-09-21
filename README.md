# DomoTek — Boutique en ligne

Prototype front-end complet pour la boutique **DomoTek** (produits électroniques,
Smart Home et IoT pour le marché algérien), construit avec **React 18 + TypeScript
+ Tailwind CSS + Vite**.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrez l'URL affichée (généralement `http://localhost:5173`).

```bash
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build de production
```

## Ce qui est implémenté

- **Boutique** : accueil, catégories, catalogue avec filtres/tri, fiche produit
  (galerie, variantes, onglets, avis, produits similaires), recherche avec
  suggestions, panier, checkout (wilayas algériennes, paiement à la livraison),
  page de confirmation.
- **Espace admin** (`/` puis bouton "Espace admin" dans le footer ou le menu
  mobile) : tableau de bord (stats + graphique), gestion des produits
  (ajout/édition/suppression), catégories, commandes (changement de statut),
  clients.
- **Mobile-first**, thème sombre, composants réutilisables organisés dans
  `src/components`, `src/pages` et `src/admin`.

Il n'y a pas de routeur (`react-router`) : la navigation entre "pages" se fait
via un état applicatif centralisé dans `src/lib/useStore.ts` (le hook `useStore`
retourne l'objet `Store` passé à tous les composants). C'est volontairement
simple pour ce prototype — un vrai déploiement gagnera à utiliser un routeur et
un backend réel (voir ci-dessous).

## Données à remplacer avant mise en production

Rien n'a été inventé côté spécifications techniques, avis clients ou politiques
commerciales non fournies — tout ce qui manque est signalé comme "à ajouter
prochainement" dans l'interface plutôt que rempli avec de fausses informations.
À remplacer avant le lancement :

- `src/data/products.ts` — catalogue de démonstration (12 produits, noms/prix/
  stock réalistes mais fictifs). Conservez la forme `Product` définie dans
  `src/types.ts` pour ne rien casser dans l'UI.
- `src/data/demoAdminData.ts` — commandes et chiffres de ventes de démonstration
  utilisés uniquement pour peupler le tableau de bord admin.
- Icônes produits : chaque produit affiche une "tuile" générée (icône +
  dégradé) en attendant de vraies photos. `src/components/ui.tsx`
  (`IconTile`) est l'endroit à modifier pour brancher de vraies images.
- Coordonnées de contact réelles dans `src/components/Footer.tsx` et les liens
  réseaux sociaux (actuellement `href="#"`).
- Le panier et les favoris ne persistent pas entre les rechargements de page
  (aucune donnée n'est stockée côté client) — à connecter à un vrai backend
  (API + base de données) pour la production, avec authentification client si
  nécessaire.

## Prochaines étapes suggérées pour un vrai lancement

1. Backend (API + base de données) pour produits, commandes, clients — l'admin
   actuel modifie uniquement l'état en mémoire du navigateur.
2. Routeur (`react-router`) avec de vraies URLs par page/produit pour le SEO.
3. Vraies photos produits, remplaçant `IconTile`.
4. Authentification pour l'espace admin (actuellement accessible à tous).
5. Génération de `sitemap.xml` et remplissage des balises Open Graph avec le
   vrai domaine.
