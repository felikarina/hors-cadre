# Tuto 5 — La Card : du HTML au CSS moderne, sans media query

**Durée :** une matinée, plus le début de l'après-midi si besoin
**Point de départ :** la fin du tuto 4, plus le kit de la séance 3 (déjà dans le dépôt modèle, voir l'étape 0)
**Point d'arrivée :** une Card et une grille de Cards dans `@ds/ui`, construites pas à pas dans un labo, utilisées dans votre page, puis exposées dans Storybook

---

## L'idée de la séance : la maison et la pièce

Jusqu'ici, pour faire du responsive, vous écriviez des **media queries** : `@media (min-width: 768px)`. Une media query pose une seule question : **quelle est la taille de l'écran ?** Autrement dit, quelle est la taille de la *maison*.

Mais un composant ne sait jamais dans quelle maison il sera livré, ni dans quelle pièce on le posera. La même Card peut se retrouver :

- en grand, en haut d'une page d'accueil ;
- en petit, dans une grille de trois colonnes ;
- dans une barre latérale étroite, **sur un écran de 1 920 px**.

Sur le même écran, la Card n'a pas du tout la même place. La taille de l'écran ne lui dit rien d'utile.

Une **container query** pose la bonne question : **quelle est la taille de la pièce où je suis posé ?** C'est le meuble qui mesure la pièce, pas la maison.

**La règle de la séance :**

> La page a le droit aux media queries : c'est elle qui découpe la maison en pièces. Les composants n'y ont **jamais** droit : ils s'adaptent à la pièce qu'on leur donne.

### Le chemin

```
1. Le composant              ← createCard(props) : le HTML, les classes, le DOM
2. Le design de base         ← la Card prend forme sous vos yeux, propriété par propriété
3 à 7. Le CSS moderne        ← la Card s'adapte à sa pièce
8 et 9. La grille            ← six Cards, une pièce dont on change la largeur
10. La page (apps/web)       ← la maison : la Card dans un vrai projet
11. Storybook                ← la vitrine : la Card documentée, pour les autres
```

### Comment lire ce tuto : quatre types de consigne

Chaque bloc de code est annoncé par l'une de ces quatre consignes. Lisez-la **avant** de copier :

| Consigne | Ce que vous faites |
| --- | --- |
| ➕ **Ajouter à la fin de** `fichier` | Vous collez le bloc **tout en bas** du fichier. Vous ne touchez à rien de ce qui est déjà écrit |
| ✏️ **Remplacer tout le contenu de** `fichier` | Vous effacez tout le fichier, puis vous collez le bloc |
| 🔁 **Modifier** `fichier` | Vous changez seulement la ou les lignes indiquées, avec un « avant » et un « après » |
| 🆕 **Créer le fichier** `fichier` | Le fichier n'existe pas encore : vous le créez, puis vous collez le bloc |

Pour `card.css`, presque tout est en ➕ : **le fichier grandit par le bas, bloc après bloc**. Deux points de contrôle (fin des étapes 2 et 7) montrent le fichier complet attendu : en cas de doute, comparez, ou copiez-le.

### Les notions modernes, et à quelle étape

| Notion | La question à laquelle elle répond | Étape |
| --- | --- | --- |
| `@layer` | Qui gagne quand deux règles CSS se contredisent ? | 3 |
| `clamp()` | Comment une taille peut-elle varier entre un minimum et un maximum, sans media query ? | 4 |
| `aspect-ratio` | Comment réserver la place d'une image avant qu'elle arrive ? | 4 |
| Container queries, unité `cqi` | Comment un composant s'adapte-t-il à sa place, et pas à l'écran ? | 5 |
| `:has()` | Comment un parent peut-il réagir à ce qu'il contient ? | 6 |
| `prefers-reduced-motion` | Comment respecter les personnes qui ne veulent pas d'animations ? | 7 |
| Grille `auto-fill` + `minmax()` | Comment une grille calcule-t-elle seule son nombre de colonnes ? | 8 |
| `subgrid` | Comment aligner les titres et les boutons de Cards voisines ? | 9 |

---

## Étape 0 — Le point de départ

### 0.1 — Ce qui est déjà prêt

Le kit de la séance 3 est déjà dans le dépôt. Vous n'avez **rien à créer** pour commencer :

| Fichier | Ce qu'il contient |
| --- | --- |
| `packages/tokens/*.css` | Les tokens dont la Card a besoin (repérez les commentaires « Séance 3 ») |
| `packages/ui/src/card/card.js` | Le composant Card, **vide** : il n'affiche que son titre. Vous l'écrivez à l'étape 1 |
| `packages/ui/src/card/card.css` | **Une seule règle**, `.card`. Vous construisez tout le design à partir de l'étape 2 |
| `packages/ui/src/card/placeholder.svg` | Une image de démonstration (moins de 500 octets) |
| `packages/ui/src/card-grid/` | Le composant CardGrid, avec une seule règle CSS. On s'en occupe à l'étape 8 |
| `packages/ui/src/index.js` | Exporte déjà `createCard` et `createCardGrid` |
| `packages/ui/labo/` | Le **labo** : des pages qui affichent les composants dans des pièces de largeurs différentes |
| `apps/web/placeholder.svg` | La même image, pour la page |

> **Vous partez de votre propre dépôt, pas du dépôt modèle ?** Faites d'abord l'annexe A, à la fin de ce tuto, pour récupérer le kit.

### 0.2 — Vérifier et lancer le labo

Terminal ouvert **à la racine du dépôt** :

```bash
npm install
git checkout -b seance-3
npm run labo
```

**Ce que vous devez voir :** le navigateur s'ouvre tout seul sur la page « Labo du design system », avec deux liens. Si rien ne s'ouvre, allez à l'adresse affichée dans le terminal, suivie de `/labo/index.html` (en général **http://localhost:5174/labo/index.html**).

Cliquez sur **Labo · Card**. Vous voyez cinq pièces, et dans chacune la phrase « Card à construire (étape 1) ». Le labo fonctionne : il ne reste plus qu'à écrire la Card.

**Laissez le labo ouvert pendant tout le tuto.** Chaque fois que vous enregistrez un fichier, il se met à jour tout seul.

### 0.3 — Comment marche le labo

Ouvrez `packages/ui/labo/card.js`. C'est une page qui utilise la Card **exactement comme votre projet le fera** :

```js
import { createCard } from '@ds/ui';
import placeholder from '../src/card/placeholder.svg';

const exemple = {
  title: 'Atelier vélo solidaire du samedi',
  tag: 'Mobilité',
  /* … */
  image: { src: placeholder, alt: '' },
};

document.querySelector('#piece-18').append(createCard(exemple));
document.querySelector('#piece-38').append(createCard(exemple));
```

La même Card est posée dans des pièces de 18rem, 38rem, 54rem, plus une pièce que l'on redimensionne à la souris. La fenêtre ne change pas, seule la pièce change.

L'image est une **prop** comme les autres : c'est la page qui la choisit et la donne à la Card. Pour tester avec une autre image, changez seulement `src` dans cet objet. Le labo ne sera jamais mis en ligne : c'est votre établi.

---

## Étape 1 — Le composant : du HTML avec des props

### 1.1 — Le principe

Un composant, c'est une **fonction qui reçoit des props et renvoie du HTML**. Vous l'avez déjà fait avec `createButton`. Si vous connaissez React, c'est la même idée :

| En React | Dans notre design system |
| --- | --- |
| `<Card title="Atelier vélo" tag="Mobilité" />` | `createCard({ title: 'Atelier vélo', tag: 'Mobilité' })` |
| Les props arrivent dans `function Card({ title, tag })` | Les props arrivent dans `function createCard({ title, tag })` |
| Le composant renvoie du JSX | Le composant renvoie un élément HTML |

### 1.2 — Écrire le composant

✏️ **Remplacer tout le contenu de** `packages/ui/src/card/card.js` :

```js
import './card.css';
import { createButton } from '../button/button.js';

/**
 * Crée une Card.
 * L'ordre du HTML est l'ordre de lecture : le titre d'abord.
 * L'ordre visuel (l'image en haut) sera décidé par le CSS.
 */
export function createCard({
  title = 'Titre de la carte',
  href = '#',
  headingLevel = 3,
  tag = '',
  text = '',
  meta = '',
  image = null, // { src, alt }
  actionLabel = '',
  onAction,
} = {}) {
  const h = `h${headingLevel}`;

  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="card__inner">
      <header class="card__header">
        <${h} class="card__title"><a class="card__link" href="${href}">${title}</a></${h}>
        ${tag ? `<p class="card__tag">${tag}</p>` : ''}
      </header>
      ${image ? `
      <figure class="card__media">
        <img src="${image.src}" alt="${image.alt ?? ''}" loading="lazy">
      </figure>` : ''}
      ${text ? `<p class="card__text">${text}</p>` : ''}
      <footer class="card__footer">
        ${meta ? `<p class="card__meta">${meta}</p>` : ''}
      </footer>
    </div>
  `;

  // Le bouton est un composant : on le fabrique avec createButton, on ne réécrit pas son HTML
  if (actionLabel) {
    card.querySelector('.card__footer').append(
      createButton({ label: actionLabel, variant: 'secondary', onClick: onAction }),
    );
  }

  return card;
}
```

Enregistrez, et regardez le labo.

**Ce que vous devez voir :** le **HTML brut** de la Card, presque sans style. Le titre est un lien bleu souligné, l'étiquette « Mobilité » est en dessous, puis l'image, le texte, les informations et le bouton (le seul élément déjà stylé : il vient de votre design system). C'est normal, `card.css` ne contient encore qu'une règle. Tout le design arrive à l'étape 2.

### 1.3 — Les props

| Prop | Rôle | Par défaut |
| --- | --- | --- |
| `title` | Le titre, qui est aussi le lien de la Card | `'Titre de la carte'` |
| `href` | L'adresse du lien | `'#'` |
| `headingLevel` | Le niveau du titre : `2` pour un `<h2>`, `3` pour un `<h3>`… | `3` |
| `tag` | L'étiquette (« Mobilité ») | rien |
| `text` | Le paragraphe de description | rien |
| `meta` | Les informations du pied (« 12 places ») | rien |
| `image` | Un objet `{ src, alt }`, choisi par la page | pas d'image |
| `actionLabel` | Le texte du bouton | pas de bouton |
| `onAction` | La fonction appelée au clic sur le bouton | rien |

Seul le titre est obligatoire. Une Card sans image, sans étiquette ou sans bouton reste une Card valide : les `${tag ? … : ''}` n'écrivent la balise que si la prop existe.

**Testez-le :** dans `labo/card.js`, changez le titre de l'exemple, ou retirez la ligne `tag`. Les cinq Cards changent.

### 1.4 — Regarder le DOM

Dans le labo, ouvrez les outils de développement (`F12`, onglet **Elements**) et déployez une Card. Voici ce que vous devez trouver, et le rôle de chaque classe :

```
article.card                     ← la Card. Au CSS, ce sera la « pièce » qu'on mesure (étape 5)
└── div.card__inner              ← l'intérieur. Au CSS, c'est lui qu'on met en forme
    ├── header.card__header
    │   ├── h3.card__title
    │   │   └── a.card__link     ← le seul lien de la Card
    │   └── p.card__tag          ← l'étiquette, écrite APRÈS le titre
    ├── figure.card__media       ← l'image, écrite APRÈS l'en-tête
    │   └── img
    ├── p.card__text
    └── footer.card__footer
        ├── p.card__meta
        └── button.button.button--secondary   ← fabriqué par createButton
```

Les noms suivent la convention **BEM**, comme le Button : `card` est le **bloc**, `card__title` un **élément** du bloc (deux tirets bas), `button--secondary` une **variante** (deux tirets).

**Gardez cet arbre sous les yeux pendant l'étape 2** : chaque règle CSS vise l'une de ces classes.

### 1.5 — Les choix du HTML

| Choix | Pourquoi |
| --- | --- |
| `<article>` | Une Card est un contenu autonome, qui aurait du sens seul. Un lecteur d'écran peut sauter d'article en article |
| Le titre est écrit **avant** l'image | Un lecteur d'écran lit le HTML dans l'ordre. On veut entendre « Atelier vélo solidaire » d'abord, pas « image ». À l'écran, c'est le CSS qui remettra l'image en haut (étape 2.5) |
| L'étiquette est écrite **après** le titre | Même raison : le titre est l'information principale. Le CSS l'affichera au-dessus (étape 2.3) |
| `headingLevel` | Le niveau du titre dépend de la page : `h3` sous un `h2`, `h2` sous le `h1`. La page choisit, pour garder une hiérarchie de titres sans trou (RGAA 9.1) |
| `alt=""` par défaut | L'image est décorative : le titre dit déjà tout. Un `alt` vide dit au lecteur d'écran de l'ignorer, au lieu de lire le nom du fichier |
| Aucune taille sur l'image | La taille de l'image n'est pas une affaire de HTML : c'est le CSS qui l'adapte à la Card (étapes 2.2 et 4) |
| **Un seul** lien, sur le titre | Un arrêt au clavier pour la Card, plus un pour son bouton. On rendra pourtant toute la Card cliquable à l'étape 6 |
| `createButton` dans la Card | La Card **réutilise** le Button. C'est votre premier composant composé : corriger le Button corrigera toutes les Cards |

L'ordre visuel peut différer de l'ordre du HTML, **à condition que l'ordre du HTML ait du sens tout seul** (WCAG 1.3.2, RGAA 10.3). Ici, sans CSS, on lit : titre, étiquette, image, texte, informations, bouton. C'est exactement ce que vous voyez dans le labo en ce moment, et c'est logique.

> **Une précaution :** `innerHTML` insère les props comme du HTML. C'est très lisible, et sans risque tant que les textes viennent de vous, comme ici. Si un jour les textes viennent des utilisateurs (un commentaire, un pseudo), il faudra les insérer avec `textContent`, comme le fait `createButton`.

---

## Étape 2 — Le design de base, pas à pas

Ouvrez `packages/ui/src/card/card.css`. Il ne contient qu'une règle :

```css
.card {
  position: relative; /* servira au lien étendu (étape 6) */
  display: grid;      /* l'intérieur de la Card prendra toute la hauteur */
}
```

On va construire le design en cinq petits blocs. **Chaque bloc s'ajoute à la fin du fichier**, sous le précédent : on ne modifie jamais ce qui est déjà écrit. Enregistrez après chaque bloc, et regardez le labo changer avant de passer au suivant. Ici, rien de nouveau : bordures, couleurs, typo, flexbox, grid.

### 2.1 — Le cadre

➕ **Ajouter à la fin de** `card.css` :

```css

/* 2.1 — Le cadre */
.card {
  /* Les réglages de la Card : des variables qu'on pourra changer de l'extérieur */
  --card-padding: var(--space-4);
  --card-radius: var(--radius-lg);
  --card-bg: var(--color-bg-default);
  --card-border: var(--color-border-default);
}

.card__inner {
  overflow: hidden;
  padding-bottom: var(--card-padding);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  background: var(--card-bg);
  color: var(--color-text-default);
  font-family: var(--font-family-base);
}

/* Tout, sauf l'image, a une marge à gauche et à droite */
.card__inner > :not(.card__media) {
  padding-left: var(--card-padding);
  padding-right: var(--card-padding);
}
```

**Ce que vous devez voir :** chaque Card a maintenant un cadre blanc aux coins arrondis, et du texte qui ne colle plus aux bords.

**Pourquoi des variables `--card-…` plutôt que les tokens directement ?** Ce sont les **réglages** de la Card. Toutes les règles les utilisent. Pour changer la marge intérieure de toute la Card, il suffira de changer `--card-padding` à un seul endroit. C'est ce qu'on fera à l'étape 4.

### 2.2 — L'image

➕ **Ajouter à la fin de** `card.css` :

```css

/* 2.2 — L'image */
.card__media {
  margin: 0;                         /* une <figure> a une marge par défaut */
  background: var(--color-bg-accent);
}

.card__media img {
  display: block;                    /* supprime le petit espace sous l'image */
  width: 100%;                       /* l'image prend la largeur de la Card, quelle qu'elle soit */
  height: 100%;
  object-fit: cover;                 /* et la remplit sans être déformée */
}
```

**Ce que vous devez voir :** l'image remplit toute la largeur de la Card, bord à bord, **quelle que soit la taille de la pièce**. C'est pour ça que le HTML ne donne aucune taille à l'image : c'est le CSS qui l'adapte à sa place.

### 2.3 — L'en-tête : l'étiquette et le titre

➕ **Ajouter à la fin de** `card.css` :

```css

/* 2.3 — L'en-tête */
.card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-4);
  padding-bottom: var(--space-2);
}

.card__tag {
  order: -1;                         /* au-dessus du titre à l'écran, mais lue après lui */
  margin: 0;
  color: var(--color-text-accent);
  font-size: var(--font-size-100);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.card__link {
  color: inherit;                    /* le titre garde la couleur du texte */
  text-decoration: none;
}
```

**Ce que vous devez voir :** l'étiquette « MOBILITÉ » passe **au-dessus** du titre, en petites capitales bleues. Le titre n'est plus souligné.

Regardez le DOM : dans le HTML, l'étiquette est toujours **après** le titre. Seul l'affichage a changé, grâce à `order: -1`. Un lecteur d'écran lit toujours le titre en premier.

### 2.4 — Le texte et le pied

➕ **Ajouter à la fin de** `card.css` :

```css

/* 2.4 — Le texte et le pied */
.card__text {
  margin: 0;
  color: var(--color-text-subtle);
  line-height: var(--line-height-body);
}

.card__footer {
  display: flex;
  flex-wrap: wrap;                   /* le bouton passe à la ligne s'il manque de place */
  align-items: center;
  justify-content: space-between;    /* les infos à gauche, le bouton à droite */
  gap: var(--space-2) var(--space-4);
  padding-top: var(--space-4);
}

.card__meta {
  margin: 0;
  color: var(--color-text-subtle);
  font-size: var(--font-size-100);
}
```

**Ce que vous devez voir :** le texte est gris, les informations à gauche, le bouton à droite. Dans la pièce de 18rem, le bouton passe sous les informations, grâce à `flex-wrap`.

Mais **l'image est toujours sous le titre**, comme dans le HTML.

### 2.5 — Remonter l'image : la grille de la Card

➕ **Ajouter à la fin de** `card.css` :

```css

/* 2.5 — La grille de la Card : 4 rangées */
.card__inner {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
}

.card__media  { grid-row: 1; }   /* l'image, en haut */
.card__header { grid-row: 2; }   /* l'en-tête */
.card__text   { grid-row: 3; }   /* le texte : la rangée « 1fr » prend la place qui reste */
.card__footer { grid-row: 4; }   /* le pied, toujours en bas */
```

**Ce que vous devez voir :** l'image **saute en haut** de chaque Card. Votre Card est terminée… en apparence.

Deux choses à comprendre :

- `grid-row` place chaque élément dans une rangée, **quel que soit son ordre dans le HTML**. C'est ce qui permet d'écrire le titre en premier pour le lecteur d'écran, et d'afficher l'image en premier pour les yeux.
- `1fr` sur la rangée du texte veut dire « toute la place qui reste ». Quand plusieurs Cards de hauteurs différentes sont côte à côte (étape 8), c'est ce qui pousse le pied tout en bas.

<details>
<summary><strong>Point de contrôle</strong> : votre <code>card.css</code> complet à la fin de l'étape 2 (cliquez pour ouvrir)</summary>

```css
/* ============================================================
   Card — le point de départ.
   Tout le design de la Card se construit pendant le tuto 5.
   ============================================================ */

.card {
  position: relative; /* servira au lien étendu (étape 6) */
  display: grid;      /* l'intérieur de la Card prendra toute la hauteur */
}

/* 2.1 — Le cadre */
.card {
  /* Les réglages de la Card : des variables qu'on pourra changer de l'extérieur */
  --card-padding: var(--space-4);
  --card-radius: var(--radius-lg);
  --card-bg: var(--color-bg-default);
  --card-border: var(--color-border-default);
}

.card__inner {
  overflow: hidden;
  padding-bottom: var(--card-padding);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  background: var(--card-bg);
  color: var(--color-text-default);
  font-family: var(--font-family-base);
}

/* Tout, sauf l'image, a une marge à gauche et à droite */
.card__inner > :not(.card__media) {
  padding-left: var(--card-padding);
  padding-right: var(--card-padding);
}

/* 2.2 — L'image */
.card__media {
  margin: 0;                         /* une <figure> a une marge par défaut */
  background: var(--color-bg-accent);
}

.card__media img {
  display: block;                    /* supprime le petit espace sous l'image */
  width: 100%;                       /* l'image prend la largeur de la Card, quelle qu'elle soit */
  height: 100%;
  object-fit: cover;                 /* et la remplit sans être déformée */
}

/* 2.3 — L'en-tête */
.card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-4);
  padding-bottom: var(--space-2);
}

.card__tag {
  order: -1;                         /* au-dessus du titre à l'écran, mais lue après lui */
  margin: 0;
  color: var(--color-text-accent);
  font-size: var(--font-size-100);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.card__link {
  color: inherit;                    /* le titre garde la couleur du texte */
  text-decoration: none;
}

/* 2.4 — Le texte et le pied */
.card__text {
  margin: 0;
  color: var(--color-text-subtle);
  line-height: var(--line-height-body);
}

.card__footer {
  display: flex;
  flex-wrap: wrap;                   /* le bouton passe à la ligne s'il manque de place */
  align-items: center;
  justify-content: space-between;    /* les infos à gauche, le bouton à droite */
  gap: var(--space-2) var(--space-4);
  padding-top: var(--space-4);
}

.card__meta {
  margin: 0;
  color: var(--color-text-subtle);
  font-size: var(--font-size-100);
}

/* 2.5 — La grille de la Card : 4 rangées */
.card__inner {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
}

.card__media  { grid-row: 1; }   /* l'image, en haut */
.card__header { grid-row: 2; }   /* l'en-tête */
.card__text   { grid-row: 3; }   /* le texte : la rangée « 1fr » prend la place qui reste */
.card__footer { grid-row: 4; }   /* le pied, toujours en bas */
```

</details>

### Où on en est

Regardez les cinq pièces : **les cinq Cards sont identiques**, verticales, avec le même titre et les mêmes marges. Dans la pièce de 54rem, l'image est immense ; dans celle de 18rem, le titre est un peu à l'étroit. La Card ne sait pas encore s'adapter à sa pièce. C'est le sujet de la suite du tuto.

À partir de maintenant, on n'ajoute que du CSS **nouveau**.

---

## Étape 3 — Qui gagne ? `@layer`

### 3.1 — Le code

🔁 **Modifier** `card.css` : deux ajouts seulement. Ces lignes **tout en haut du fichier**, avant le premier commentaire, et une accolade fermante `}` **à la toute fin** :

```css
@layer ds.base, ds.components, ds.utilities;

@layer ds.components {

  /* … tout le CSS que vous venez d'écrire, inchangé … */

}
```

Tout votre CSS se retrouve **à l'intérieur** de `@layer ds.components { … }`. Pas besoin de réindenter.

**Ce que vous devez voir :** rien ne change à l'écran. C'est normal : `@layer` ne change pas l'apparence, il change **qui gagne** en cas de conflit.

### 3.2 — Pourquoi `@layer`

**Le problème.** En CSS classique, quand deux règles se contredisent, c'est la plus **spécifique** qui gagne. Imaginez qu'une équipe produit veuille des coins carrés sur vos Cards. Elle écrit `.card__inner { border-radius: 0; }` dans son projet… et ça ne marche pas si votre règle est plus spécifique. Elle finit par écrire `!important`, ou un sélecteur à rallonge. C'est la « guerre de la spécificité ».

**La solution.** `@layer` range le CSS en **couches**, comme les calques dans Figma : le calque du dessus recouvre celui du dessous, peu importe ce qu'il contient. Entre deux couches, ce n'est plus la spécificité qui décide, c'est **l'ordre des couches**.

La première ligne déclare cet ordre, une fois pour toutes :

| Couche | Ce qu'on y range | Qui gagne |
| --- | --- | --- |
| `ds.base` | Les remises à zéro (marges par défaut…) | Perd contre tout le reste |
| `ds.components` | Les composants : la Card, et plus tard les autres | Gagne contre `ds.base` |
| `ds.utilities` | Les petites classes utilitaires (`.sr-only`…) | Gagne contre les composants |
| *Hors couche* | Le CSS du projet, dans `apps/web` | **Gagne toujours** |

C'est exactement ce qu'on veut pour un design system : le projet peut toujours personnaliser un composant, avec un sélecteur simple, sans `!important`.

### 3.3 — Le tester

➕ **Ajouter à la fin de** `packages/ui/labo/labo.css` (qui est hors couche) :

```css
.card__inner { border-radius: 0; }
```

Les coins de toutes les Cards deviennent carrés : le CSS hors couche gagne. **Retirez ensuite cette ligne.**

> Votre Button n'est pas encore dans une couche : pour l'instant, il gagne contre la Card. Ranger tous vos composants dans `@layer ds.components` est un bon exercice de fin de séance.

---

## Étape 4 — Des tailles qui respirent : `clamp()` et `aspect-ratio`

### 4.1 — Le code

➕ **Ajouter à la fin de** `card.css`, après l'accolade de l'étape 3 :

```css

/* Étape 4 — des tailles qui respirent */
@layer ds.components {
  .card {
    --card-padding: clamp(var(--space-4), 4vw, var(--space-6));
  }

  .card__media {
    aspect-ratio: 16 / 9;
  }

  .card__title {
    font-size: clamp(1.125rem, 0.75rem + 3vw, 1.75rem);
    text-wrap: balance;
  }

  .card__text {
    text-wrap: pretty;
  }
}
```

On peut rouvrir une couche autant de fois qu'on veut. Dans une même couche, à spécificité égale, **la règle écrite en dernier gagne** : ce bloc remplace donc les valeurs de l'étape 2.

**Ce que vous devez voir :** les titres sont plus grands, les marges intérieures aussi. Les images, elles, ne bougent pas : notre image de démonstration est déjà au format 16/9. La différence se verra avec vos propres photos (voir 4.3).

### 4.2 — Pourquoi `clamp()`

`clamp(minimum, idéal, maximum)` fonctionne comme un **thermostat** : la valeur suit l'idéal, mais ne descend jamais sous le minimum et ne monte jamais au-dessus du maximum.

```
font-size: clamp(1.125rem,  0.75rem + 3vw,  1.75rem);
                 ↑ plancher  ↑ idéal, qui varie  ↑ plafond
```

**Ce que ça remplace :** trois ou quatre media queries qui changeaient la taille du titre par paliers. Ici, la taille glisse en continu, et on ne l'écrit qu'une fois.

**Le détail qui compte pour l'accessibilité :** l'idéal est `0.75rem + 3vw`, pas `3vw` tout seul. Une taille en `vw` seul ne grossit pas quand l'utilisateur zoome ou agrandit le texte de son navigateur. La partie en `rem` garantit que le zoom fonctionne toujours (WCAG 1.4.4).

### 4.3 — Pourquoi `aspect-ratio`

Sans `aspect-ratio`, le navigateur ne connaît pas la hauteur de l'image tant qu'elle n'est pas téléchargée. Il affiche le texte, puis l'image arrive et **pousse tout vers le bas**. Ce saut s'appelle le *Cumulative Layout Shift* (CLS). C'est un des Core Web Vitals de Google, et une source de clics ratés.

`aspect-ratio: 16 / 9` réserve la place dès le départ, quelle que soit l'image choisie par la page. **Testez-le :** dans `labo/card.js`, remplacez `src: placeholder` par l'adresse d'une photo verticale (un portrait trouvé sur le web, par exemple). La Card garde exactement la même forme. Avec `object-fit: cover` (étape 2.2), l'image remplit cette place sans être déformée : elle est recadrée. Une photo verticale ou carrée donnera donc une Card de la même forme qu'une photo horizontale.

Le lien avec l'éco-conception : une page qui ne saute pas est une page qu'on ne recharge pas par erreur.

### 4.4 — Pourquoi `text-wrap`

- `balance` équilibre les lignes d'un titre : plutôt deux lignes de longueur proche qu'une longue ligne suivie d'un mot tout seul.
- `pretty` évite qu'un paragraphe se termine par un mot isolé sur sa dernière ligne.

Si un navigateur ne connaît pas ces valeurs, il coupe le texte comme avant. Rien ne casse : c'est une **amélioration progressive**.

### 4.5 — Le piège, à observer maintenant

Regardez le labo : les cinq titres ont **exactement la même taille**, alors que la Card de 18rem est trois fois plus étroite que celle de 54rem. Dans la petite pièce, le titre est trop gros.

C'est normal : `vw` veut dire « 1 % de la largeur de l'écran ». Il mesure la **maison**. Sur un écran d'ordinateur, l'idéal dépasse le plafond, et tous les titres restent bloqués à 1.75rem. Pour que le titre de la petite pièce rapetisse, il faudrait rétrécir… tout l'écran. C'est le sujet de l'étape suivante.

---

## Étape 5 — La Card regarde la pièce : les container queries

### 5.1 — Faire de la Card une pièce

➕ **Ajouter à la fin de** `card.css` :

```css

/* Étape 5.1 — la Card devient une pièce, et ses tailles se mesurent sur elle */
@layer ds.components {
  .card {
    container: card / inline-size;                                 /* nouveau */
    --card-padding: clamp(var(--space-4), 6cqi, var(--space-6));   /* vw → cqi */
  }

  .card__title {
    font-size: clamp(1.125rem, 0.75rem + 3cqi, 1.75rem);           /* vw → cqi */
  }
}
```

On ne touche pas au bloc de l'étape 4 : ce nouveau bloc est écrit après, donc il gagne (même couche, même spécificité). Il change trois choses : une ligne `container` en plus, et les deux `vw` deviennent des `cqi`.

**Ce que vous devez voir :** les titres n'ont plus la même taille. Celui de la pièce de 18rem est plus petit ; dans les pièces de 38rem et 54rem, il atteint son plafond. Tirez la poignée de la pièce redimensionnable : le titre grandit avec elle. Et redimensionner la fenêtre ne change plus rien : seule la pièce compte.

### Pourquoi `container` et `cqi`

`container: card / inline-size` dit deux choses :

| Morceau | Veut dire |
| --- | --- |
| `card` | Le **nom** de la pièce. Les requêtes pourront viser cette pièce-là précisément |
| `inline-size` | On mesure seulement sa **largeur** (*inline* = dans le sens de lecture) |

Pourquoi pas aussi la hauteur ? Parce que la hauteur d'une Card dépend de son contenu, et que son contenu dépendrait de sa hauteur : le navigateur tournerait en rond. On mesure donc la largeur, qui, elle, est imposée par la pièce.

`cqi` veut dire *container query inline* : **1 % de la largeur de la pièce**. C'est le `vw` du composant. `6cqi` dans une pièce de 300 px vaut 18 px ; dans une pièce de 800 px, 48 px, plafonné à `--space-6` par le `clamp()`.

### 5.2 — Changer la mise en page quand la pièce est large

➕ **Ajouter à la fin de** `card.css` :

```css

/* Étape 5.2 — quand la pièce est assez large */
@layer ds.components {
  @container card (width >= 34rem) {
    .card__inner {
      grid-template-columns: minmax(10rem, 2fr) 3fr;
      grid-template-rows: auto 1fr auto;
      padding-bottom: 0;

      & > .card__media { grid-column: 1; grid-row: 1 / -1; aspect-ratio: auto; }
      & > :not(.card__media) { grid-column: 2; }
      & > .card__header { grid-row: 1; padding-top: var(--card-padding); }
      & > .card__text { grid-row: 2; }
      & > .card__footer { grid-row: 3; padding-bottom: var(--card-padding); }
    }
  }

  @container card (width >= 50rem) {
    .card__text {
      font-size: 1.125rem;
      max-width: 60ch;
    }
  }
}
```

**Ce que vous devez voir :**

- pièce de 18rem : Card verticale, image en haut ;
- pièce de 38rem : Card horizontale, image à gauche, texte à droite ;
- pièce de 54rem : Card horizontale, avec un texte un peu plus grand ;
- pièce redimensionnable : tirez la poignée, la Card bascule au moment où la pièce passe 34rem.

Et toujours **aucune media query** dans le fichier.

### Comment lire ce bloc

`@container card (width >= 34rem)` se lit : « quand la pièce nommée `card` fait au moins 34rem de large ». La syntaxe est la même que celle d'une media query, mais elle mesure la pièce.

C'est la même grille qu'à l'étape 2.5, avec une deuxième colonne : l'image occupe la colonne 1 sur toute la hauteur (`grid-row: 1 / -1`, « de la première à la dernière ligne »), tout le reste passe dans la colonne 2.

Les lignes qui commencent par `&` sont écrites **à l'intérieur** de `.card__inner` : c'est le **nesting natif** du CSS. Le `&` veut dire « moi ». `& > .card__media` veut donc dire `.card__inner > .card__media`. Avant, il fallait Sass pour écrire ça ; aujourd'hui, tous les navigateurs récents le comprennent. On l'utilise ici pour que les six règles dépendent d'un seul sélecteur : vous allez voir pourquoi à l'étape 6.

### Pourquoi on vise `.card__inner`, et pas `.card`

Une pièce ne peut pas changer sa propre forme en fonction de sa propre taille : elle changerait de taille, donc de forme, donc de taille… à l'infini. La règle est simple : **une container query ne peut styler que l'intérieur du conteneur**, jamais le conteneur lui-même.

C'est pour ça que la Card a deux niveaux dans le HTML (étape 1.4) : `.card` est la pièce qu'on mesure, `.card__inner` est le meuble qu'on réarrange.

### Pourquoi 34rem, et pas 768px

768px, c'est la largeur d'un iPad d'il y a dix ans. Ça ne dit rien de **votre** contenu. La bonne question est : « à partir de quelle largeur mon texte tient-il confortablement à côté de l'image ? » Tirez la poignée de la pièce redimensionnable, regardez, et choisissez votre seuil. En `rem`, il suit aussi la taille de texte choisie par l'utilisateur.

### Le bug, à observer maintenant

Regardez la troisième pièce, **la Card sans image**. Elle est passée en horizontal elle aussi… avec une colonne de gauche vide, qui attend une image qui n'existe pas. On le corrige à l'étape suivante.

---

## Étape 6 — Le parent qui voit ses enfants : `:has()`

### 6.1 — Corriger la Card sans image

🔁 **Modifier une ligne de** `card.css`, dans le bloc « Étape 5.2 ». Trouvez la ligne juste sous `@container card (width >= 34rem) {` :

```css
    .card__inner {
```

et remplacez-la par :

```css
    .card__inner:has(.card__media) {
```

Elle se lit : « un `.card__inner` **qui contient** une image ». La Card sans image ne correspond plus : elle reste verticale, sur toute la largeur. Grâce au nesting, une seule modification a suffi pour les six règles.

### 6.2 — Le reste de l'étape

➕ **Ajouter à la fin de** `card.css` :

```css

/* Étape 6 — :has(), le parent qui voit ses enfants */
@layer ds.components {
  /* Sans image, l'en-tête reprend une marge en haut */
  .card__inner:not(:has(.card__media)) > .card__header {
    padding-top: var(--card-padding);
  }

  /* Toute la Card est cliquable, avec un seul lien dans le HTML */
  .card__link::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Le bouton passe au-dessus du lien étendu */
  .card__footer .button {
    position: relative;
    z-index: 2;
  }

  /* La Card entière réagit au survol et au focus de son lien */
  .card:has(.card__link:hover) .card__inner {
    box-shadow: var(--shadow-raised);
    translate: 0 var(--motion-lift);
  }

  .card:has(.card__link:focus-visible) .card__inner {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* On ne retire le focus du lien que si le navigateur sait l'afficher sur la Card */
  @supports selector(:has(*)) {
    .card__link:focus-visible {
      outline: none;
    }
  }
}
```

**Ce que vous devez voir :**

- la Card sans image a une marge au-dessus de son étiquette ;
- en survolant n'importe où sur une Card, elle se soulève et prend une ombre ;
- en cliquant n'importe où (sauf sur le bouton), on suit le lien du titre ;
- au clavier, `Tab` s'arrête **deux fois** par Card : sur le titre (toute la Card s'entoure d'un contour), puis sur le bouton.

### Pourquoi `:has()`

Pendant vingt ans, le CSS ne savait regarder que **vers le bas** : un parent pouvait styler ses enfants, jamais l'inverse. Pour qu'une Card change selon qu'elle a une image ou non, il fallait du JavaScript, ou une classe `card--sans-image` à penser à ajouter à la main.

`:has()` permet enfin à un élément de réagir à **ce qu'il contient**. On l'utilise trois fois :

| Sélecteur | Se lit |
| --- | --- |
| `.card__inner:has(.card__media)` | Un intérieur de Card qui contient une image |
| `.card__inner:not(:has(.card__media))` | Un intérieur de Card qui ne contient **pas** d'image |
| `.card:has(.card__link:hover)` | Une Card dont le lien est survolé |

Le composant devient plus robuste : il s'adapte à son contenu réel. Et rappelez-vous l'étape 1 : `createCard` n'écrit la balise `<figure>` que si la page lui donne une image. Le CSS n'a rien à savoir de plus.

### Pourquoi le lien étendu, plutôt qu'un `<a>` autour de toute la Card

On pourrait entourer toute la Card d'un lien. Mais :

- un lecteur d'écran lirait **tout** le contenu comme texte du lien : « lien, Atelier vélo solidaire du samedi, Mobilité, Venez réparer votre vélo… » ;
- un bouton à l'intérieur d'un lien est interdit en HTML : deux éléments cliquables imbriqués, le navigateur ne sait pas lequel déclencher.

Le **lien étendu** garde un seul lien court, sur le titre. Son pseudo-élément `::after`, invisible, s'étire sur toute la Card (`position: absolute; inset: 0`), parce que `.card` est en `position: relative` depuis le début. Le bouton passe par-dessus grâce au `z-index`.

### Pourquoi `@supports`

On retire le contour du lien, parce que la Card entière s'entoure déjà. Mais si un navigateur ancien ne connaissait pas `:has()`, la Card ne s'entourerait pas, et le focus deviendrait **invisible**. `@supports selector(:has(*))` ne retire le contour que si le navigateur sait le remplacer. Règle d'or : **ne jamais retirer un focus sans en afficher un autre**.

---

## Étape 7 — Animer, mais seulement si la personne le veut bien : `prefers-reduced-motion`

### 7.1 — Le code

➕ **Ajouter à la fin de** `card.css` :

```css

/* Étape 7 — une transition qui respecte les préférences */
@layer ds.components {
  .card__inner {
    transition:
      box-shadow var(--duration-base),
      translate var(--duration-base);
  }
}
```

Survolez une Card : elle se soulève maintenant en douceur.

Ouvrez ensuite `packages/tokens/foundations.css` et lisez le bloc à la fin du fichier. Il est déjà là :

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-base: 0ms;
    --motion-lift: 0px;
  }
}
```

### 7.2 — Pourquoi `prefers-reduced-motion`

Certaines personnes ont des vertiges, des nausées ou des maux de tête face aux animations. Elles peuvent le dire à leur système : sur Mac, *Réglages Système > Accessibilité > Affichage > Réduire les animations* ; sur Windows, *Paramètres > Accessibilité > Effets visuels*. Le navigateur transmet ce réglage au CSS avec `prefers-reduced-motion: reduce` (WCAG 2.3.3).

### 7.3 — Pourquoi dans les tokens, et pas dans la Card

C'est une media query, mais elle ne parle pas de la taille de l'écran : elle parle de **la personne**. On ne l'écrit qu'**une fois**, dans les fondations. Elle met la durée des animations (`--duration-base`) et le soulèvement (`--motion-lift`) à zéro. Chaque composant qui utilise ces tokens (le Button depuis la séance 1, la Card maintenant) respecte la préférence, sans une ligne de plus.

C'est aussi pour ça que le soulèvement au survol est un token (`--motion-lift`), et pas un `-2px` écrit dans la Card.

### 7.4 — Le tester

Dans les outils de développement : menu `⋮` > *More tools* > *Rendering*, puis *Emulate CSS media feature prefers-reduced-motion* > `reduce`. Survolez une Card : l'ombre apparaît, mais la Card ne bouge plus et rien ne s'anime. Remettez ensuite le réglage sur *No emulation*.

<details>
<summary><strong>Point de contrôle</strong> : votre <code>card.css</code> complet, Card terminée (cliquez pour ouvrir)</summary>

```css
@layer ds.base, ds.components, ds.utilities;

@layer ds.components {
/* ============================================================
   Card — le point de départ.
   Tout le design de la Card se construit pendant le tuto 5.
   ============================================================ */

.card {
  position: relative; /* servira au lien étendu (étape 6) */
  display: grid;      /* l'intérieur de la Card prendra toute la hauteur */
}

/* 2.1 — Le cadre */
.card {
  /* Les réglages de la Card : des variables qu'on pourra changer de l'extérieur */
  --card-padding: var(--space-4);
  --card-radius: var(--radius-lg);
  --card-bg: var(--color-bg-default);
  --card-border: var(--color-border-default);
}

.card__inner {
  overflow: hidden;
  padding-bottom: var(--card-padding);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  background: var(--card-bg);
  color: var(--color-text-default);
  font-family: var(--font-family-base);
}

/* Tout, sauf l'image, a une marge à gauche et à droite */
.card__inner > :not(.card__media) {
  padding-left: var(--card-padding);
  padding-right: var(--card-padding);
}

/* 2.2 — L'image */
.card__media {
  margin: 0;                         /* une <figure> a une marge par défaut */
  background: var(--color-bg-accent);
}

.card__media img {
  display: block;                    /* supprime le petit espace sous l'image */
  width: 100%;                       /* l'image prend la largeur de la Card, quelle qu'elle soit */
  height: 100%;
  object-fit: cover;                 /* et la remplit sans être déformée */
}

/* 2.3 — L'en-tête */
.card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-4);
  padding-bottom: var(--space-2);
}

.card__tag {
  order: -1;                         /* au-dessus du titre à l'écran, mais lue après lui */
  margin: 0;
  color: var(--color-text-accent);
  font-size: var(--font-size-100);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.card__link {
  color: inherit;                    /* le titre garde la couleur du texte */
  text-decoration: none;
}

/* 2.4 — Le texte et le pied */
.card__text {
  margin: 0;
  color: var(--color-text-subtle);
  line-height: var(--line-height-body);
}

.card__footer {
  display: flex;
  flex-wrap: wrap;                   /* le bouton passe à la ligne s'il manque de place */
  align-items: center;
  justify-content: space-between;    /* les infos à gauche, le bouton à droite */
  gap: var(--space-2) var(--space-4);
  padding-top: var(--space-4);
}

.card__meta {
  margin: 0;
  color: var(--color-text-subtle);
  font-size: var(--font-size-100);
}

/* 2.5 — La grille de la Card : 4 rangées */
.card__inner {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
}

.card__media  { grid-row: 1; }   /* l'image, en haut */
.card__header { grid-row: 2; }   /* l'en-tête */
.card__text   { grid-row: 3; }   /* le texte : la rangée « 1fr » prend la place qui reste */
.card__footer { grid-row: 4; }   /* le pied, toujours en bas */
}

/* Étape 4 — des tailles qui respirent */
@layer ds.components {
  .card {
    --card-padding: clamp(var(--space-4), 4vw, var(--space-6));
  }

  .card__media {
    aspect-ratio: 16 / 9;
  }

  .card__title {
    font-size: clamp(1.125rem, 0.75rem + 3vw, 1.75rem);
    text-wrap: balance;
  }

  .card__text {
    text-wrap: pretty;
  }
}

/* Étape 5.1 — la Card devient une pièce, et ses tailles se mesurent sur elle */
@layer ds.components {
  .card {
    container: card / inline-size;                                 /* nouveau */
    --card-padding: clamp(var(--space-4), 6cqi, var(--space-6));   /* vw → cqi */
  }

  .card__title {
    font-size: clamp(1.125rem, 0.75rem + 3cqi, 1.75rem);           /* vw → cqi */
  }
}

/* Étape 5.2 — quand la pièce est assez large */
@layer ds.components {
  @container card (width >= 34rem) {
    .card__inner:has(.card__media) {
      grid-template-columns: minmax(10rem, 2fr) 3fr;
      grid-template-rows: auto 1fr auto;
      padding-bottom: 0;

      & > .card__media { grid-column: 1; grid-row: 1 / -1; aspect-ratio: auto; }
      & > :not(.card__media) { grid-column: 2; }
      & > .card__header { grid-row: 1; padding-top: var(--card-padding); }
      & > .card__text { grid-row: 2; }
      & > .card__footer { grid-row: 3; padding-bottom: var(--card-padding); }
    }
  }

  @container card (width >= 50rem) {
    .card__text {
      font-size: 1.125rem;
      max-width: 60ch;
    }
  }
}

/* Étape 6 — :has(), le parent qui voit ses enfants */
@layer ds.components {
  /* Sans image, l'en-tête reprend une marge en haut */
  .card__inner:not(:has(.card__media)) > .card__header {
    padding-top: var(--card-padding);
  }

  /* Toute la Card est cliquable, avec un seul lien dans le HTML */
  .card__link::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Le bouton passe au-dessus du lien étendu */
  .card__footer .button {
    position: relative;
    z-index: 2;
  }

  /* La Card entière réagit au survol et au focus de son lien */
  .card:has(.card__link:hover) .card__inner {
    box-shadow: var(--shadow-raised);
    translate: 0 var(--motion-lift);
  }

  .card:has(.card__link:focus-visible) .card__inner {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* On ne retire le focus du lien que si le navigateur sait l'afficher sur la Card */
  @supports selector(:has(*)) {
    .card__link:focus-visible {
      outline: none;
    }
  }
}

/* Étape 7 — une transition qui respecte les préférences */
@layer ds.components {
  .card__inner {
    transition:
      box-shadow var(--duration-base),
      translate var(--duration-base);
  }
}
```

</details>

**La Card est terminée.** Gardez le labo ouvert : on passe à la grille.

---

## Étape 8 — La grille qui compte ses colonnes : `auto-fill` et `minmax()`

### 8.1 — Ce qui existe déjà

Ouvrez `packages/ui/src/card-grid/card-grid.js`. Le composant range les Cards dans une liste :

```js
createCardGrid([card1, card2, card3], { label: 'Ateliers du mois', aligned: false });
```

Il fabrique un `<ul class="card-grid">` avec un `<li>` par Card. Un lecteur d'écran annonce « liste, 6 éléments » : la personne sait combien de Cards l'attendent avant de les parcourir. Le `label` donne un nom à cette liste. L'option `aligned` sert à l'étape 9.

Dans le labo, cliquez sur **← Retour au labo**, puis sur **Labo · CardGrid**.

**Ce que vous devez voir :** six Cards, les unes sous les autres, collées entre elles et décalées vers la droite par la marge par défaut de la liste `<ul>`. Elles sont horizontales : la pièce fait 70rem, chaque Card a donc toute la place. `card-grid.css` ne contient qu'une ligne : `display: grid`.

### 8.2 — Le code

✏️ **Remplacer tout le contenu de** `packages/ui/src/card-grid/card-grid.css` :

```css
/* CardGrid — une grille qui calcule elle-même son nombre de colonnes. Zéro media query. */
@layer ds.base, ds.components, ds.utilities;

@layer ds.components {
  /* La liste devient une grille, sans puces ni marges */
  .card-grid {
    display: grid;
    gap: var(--space-6);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Chaque case étire sa Card : toutes les Cards d'une rangée ont la même hauteur */
  .card-grid > li {
    display: grid;
  }
}

/* Étape 8 — les colonnes */
@layer ds.components {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
  }
}
```

**Ce que vous devez voir :** six Cards en trois colonnes, bien espacées. Faites glisser le curseur vers la gauche : trois colonnes, puis deux, puis une. Quand une seule colonne leur laisse plus de 34rem, les Cards passent en horizontal : la grille et la Card travaillent ensemble. Tout ça **sans une seule media query**.

Le premier bloc est du CSS classique. Le deuxième est la seule ligne nouvelle, et c'est elle qui fait tout le travail. La ligne `@layer ds.base, ds.components, ds.utilities;` est répétée dans les deux fichiers : c'est sans risque, et si un projet n'importe que la grille, l'ordre des couches sera quand même le bon.

### 8.3 — Pourquoi `repeat(auto-fill, minmax(…, 1fr))`

Lisez la ligne de l'intérieur vers l'extérieur :

| Morceau | Veut dire |
| --- | --- |
| `minmax(17rem, 1fr)` | Une colonne fait **au moins** 17rem, et **au plus** une part égale de la place restante |
| `repeat(auto-fill, …)` | « Mets autant de colonnes que possible » |

Le navigateur fait le calcul à votre place : dans 56rem, il tient trois colonnes de 17rem. Il en met trois, puis répartit les 5rem restants entre elles. Dans 30rem, une seule colonne tient.

**`auto-fill` ou `auto-fit` ?** Avec `auto-fill`, s'il n'y a que deux Cards dans une pièce qui pourrait en contenir quatre, les deux Cards gardent leur largeur normale. Avec `auto-fit`, elles s'étireraient pour remplir toute la ligne, et une Card seule deviendrait immense. Pour une grille de Cards, `auto-fill` est presque toujours le bon choix.

### 8.4 — Pourquoi `min(100%, 17rem)`

Sur un téléphone de 320 px, avec les marges de la page, il reste moins de 17rem (272 px). Sans `min()`, la colonne refuserait de rétrécir sous 17rem et **déborderait** de l'écran : une barre de défilement horizontale apparaîtrait (WCAG 1.4.10, *Reflow*). `min(100%, 17rem)` veut dire « 17rem, sauf si la pièce est plus petite ». Mettez le curseur sur 16 pour le vérifier : aucune barre de défilement.

---

## Étape 9 — Aligner les Cards voisines : `subgrid`

Remettez le curseur vers 70 et regardez la première rangée. Les titres n'ont pas la même longueur, donc les textes commencent à des hauteurs différentes, les boutons aussi. Pour un catalogue où l'on compare des Cards, c'est gênant.

### 9.1 — Le code

➕ **Ajouter à la fin de** `card-grid.css` :

```css

/* Étape 9 — la variante alignée : subgrid */
@layer ds.components {
  .card-grid--aligned > li,
  .card-grid--aligned .card,
  .card-grid--aligned .card__inner {
    grid-row: span 4;
    grid-template-rows: subgrid;
    row-gap: 0;
  }

  .card-grid--aligned .card {
    container-type: normal; /* le prix à payer : voir plus bas */
    --card-padding: var(--space-4);
  }

  .card-grid--aligned .card__title {
    font-size: 1.25rem;
  }
}
```

Cochez « Grille alignée » dans le labo.

**Ce que vous devez voir :** dans chaque rangée, les étiquettes, les textes et les boutons sont maintenant alignés d'une Card à l'autre.

### 9.2 — Pourquoi `subgrid`

Chaque Card a sa propre grille de quatre rangées (étape 2.5 : image, en-tête, texte, pied). Ces grilles ne se connaissent pas : la rangée « en-tête » d'une Card ne sait pas que sa voisine a un titre sur trois lignes.

`grid-template-rows: subgrid` dit à un élément : « n'invente pas tes propres rangées, **emprunte celles de ta grille parente** ». On le met sur les trois niveaux (`li`, `.card`, `.card__inner`), et chacun réserve 4 rangées de la grille (`grid-row: span 4`). Toutes les Cards d'une rangée partagent alors les mêmes 4 rangées : la plus haute impose sa hauteur aux autres.

### 9.3 — Le prix à payer : un choix d'API

Essayez de retirer la ligne `container-type: normal`, puis enregistrez. L'alignement ne fonctionne plus. Remettez la ligne.

L'explication : un conteneur (étape 5) est une **pièce fermée**. Ce qui s'y passe ne dépend pas de l'extérieur, et c'est précisément ce qui permet au navigateur de la mesurer. Une pièce fermée ne peut donc pas emprunter les rangées de la grille d'à côté. Il faut choisir :

| Grille normale | Grille alignée |
| --- | --- |
| Chaque Card s'adapte seule à sa largeur (container queries) | Les Cards s'alignent sur leurs voisines (subgrid) |
| Idéale pour une page d'accueil avec des Cards de tailles différentes | Idéale pour un catalogue où l'on compare des Cards identiques |

Ce n'est pas un bug, c'est **une décision de conception**. Notez votre choix dans `DECISIONS.md`, par exemple :

```markdown
## Décision : grille de Cards alignée ou non
- Pourquoi : sur la page catalogue, les Cards ont toutes une image et un prix, l'alignement aide à comparer.
- Alternative écartée : la grille normale, où les Cards s'adaptent seules à leur largeur.
- Impact : dans la grille alignée, les Cards restent verticales.
```

Le titre a une taille fixe dans la grille alignée pour la même raison : sans conteneur, `cqi` n'a plus de pièce à mesurer.

Vous pouvez arrêter le labo (`Ctrl + C` dans le terminal).

---

## Étape 10 — La Card dans la page

On change de casquette, comme au tuto 4 : vous êtes l'équipe produit. La page ne fabrique aucune Card, elle les prend dans `@ds/ui`, et leur donne ses props, images comprises.

### 10.1 — Le HTML : découper la maison en pièces

✏️ **Remplacer tout le contenu de** `apps/web/index.html` :

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mon projet — accueil</title>
</head>
<body>
  <header class="site-header">
    <p class="site-name">Mon projet</p>
  </header>
  <div class="layout">
    <main class="page">
      <h1>Les ateliers du quartier</h1>
      <h2>À la une</h2>
      <div class="une" id="une"></div>
      <h2>Tous les ateliers</h2>
      <div id="grille"></div>
    </main>
    <aside class="aside" aria-labelledby="aside-title">
      <h2 id="aside-title">Près de chez vous</h2>
      <div id="proche"></div>
      <form class="signup" id="signup" aria-labelledby="signup-title">
        <h2 id="signup-title">Créer un compte</h2>
      </form>
    </aside>
  </div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

La page a maintenant **trois pièces** : « À la une » (large), « Tous les ateliers » (une grille) et la colonne « Près de chez vous » (étroite). Le formulaire du tuto 4 passe dans cette colonne.

### 10.2 — Le style de la page : la seule media query du projet

✏️ **Remplacer tout le contenu de** `apps/web/style.css` :

```css
body {
  margin: 0;
  font-family: var(--font-family-base);
  line-height: var(--line-height-body);
  color: var(--color-text-default);
  background: var(--color-bg-subtle);
}
.site-header { padding: var(--space-4); border-block-end: 1px solid var(--color-text-subtle); }
.site-name { margin: 0; font-weight: 700; }

.layout {
  display: grid;
  gap: var(--space-8);
  max-width: 80rem;
  margin: 0 auto;
  padding: var(--space-4);
}
.une { margin-bottom: var(--space-8); }
.signup { display: grid; gap: var(--space-4); margin-top: var(--space-8); }

/* La MAISON : c'est la page qui découpe l'écran en pièces.
   La seule media query du projet. */
@media (width >= 64rem) {
  .layout {
    grid-template-columns: 1fr 20rem;
  }
}
```

Deux choses à remarquer :

- **`width >= 64rem`** est la nouvelle syntaxe des media queries, plus lisible que `min-width: 64rem`. C'est la même que celle des container queries de l'étape 5.
- Cette media query ne parle d'**aucun** composant. Elle décide seulement où sont les pièces : au-dessus de 64rem, une colonne de 20rem apparaît à droite. Les Cards, elles, s'adaptent à la pièce dans laquelle elles tombent.

### 10.3 — Le JavaScript : la Card avec ses props

✏️ **Remplacer tout le contenu de** `apps/web/main.js` :

```js
import '@ds/tokens';
import './style.css';
import { createButton, createTextField, createCard, createCardGrid } from '@ds/ui';
import placeholder from './placeholder.svg';

// Fabrique les props d'un atelier
const atelier = (title, tag, text, meta) => ({
  title, tag, text, meta, href: '#', actionLabel: 'S’inscrire', image: { src: placeholder, alt: '' },
});

const ateliers = [
  atelier('Atelier vélo solidaire', 'Mobilité', 'Outils prêtés, pièces d’occasion, café offert.', '12 places'),
  atelier('Initiation au numérique pour les seniors du quartier', 'Numérique', 'Envoyer un mail, faire une visio, éviter les arnaques.', '8 places'),
  atelier('Cuisine anti-gaspi', 'Alimentation', 'On cuisine les invendus du marché.', 'Complet'),
  atelier('Bibliothèque de rue', 'Culture', 'Déposez un livre, prenez-en un. Tous les dimanches.', 'Accès libre'),
];

// La MÊME Card, dans trois pièces de largeurs différentes
document.querySelector('#une').append(
  createCard(atelier('Grande collecte de vêtements d’hiver', 'Solidarité',
    'Manteaux, bonnets et gants pour les maraudes de décembre. Dépôt au local de l’association.', '6 décembre')),
);
document.querySelector('#grille').append(
  createCardGrid(ateliers.map((props) => createCard(props)), { label: 'Tous les ateliers' }),
);
document.querySelector('#proche').append(createCard(ateliers[0]));

// Le formulaire du tuto 4, inchangé
const form = document.querySelector('#signup');
const email = createTextField({ label: 'Adresse e-mail', type: 'email', required: true });
const submit = createButton({ label: 'Créer un compte' });
submit.type = 'submit';
form.append(email, submit);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Bienvenue !');
});
```

`import placeholder from './placeholder.svg'` : Vite transforme l'image en une adresse que le navigateur sait charger, et on la passe à la Card dans la prop `image`. Dans votre projet, ce seront vos photos : glissez-les dans `apps/web/`, importez-les de la même façon, et la Card les adaptera toute seule (étapes 2.2 et 4).

### 10.4 — Le test : rétrécir la maison

```bash
npm run dev
```

Ouvrez **http://localhost:5173/**, puis le mode responsive des outils de développement (`F12`, puis l'icône téléphone et tablette, ou `Ctrl + Maj + M`).

| Largeur de l'écran | Ce que vous devez voir |
| --- | --- |
| 1280 px | « À la une » horizontale, la grille en trois colonnes, « Près de chez vous » à droite, **verticale** |
| 800 px | La colonne de droite passe en dessous… et sa Card devient **horizontale** |
| 390 px | Tout est vertical, sur une colonne, sans barre de défilement horizontale |

Regardez bien la ligne 800 px : **l'écran rétrécit, et la Card « Près de chez vous » s'élargit**. Une media query n'aurait jamais pu faire ça. C'est la démonstration de toute la séance.

---

## Étape 11 — La Card dans Storybook

Dernière étape : ranger la Card dans la vitrine, pour les autres équipes. Comme au tuto 2, une story est un état du composant, décrit par ses props.

🆕 **Créer le fichier** `packages/ui/src/card/card.stories.js` :

```js
import { createCard } from './card.js';
import placeholder from './placeholder.svg';

/** Fabrique la Card, avec ou sans image selon le contrôle « avec image » */
const render = ({ withImage, ...props }) =>
  createCard({ ...props, image: withImage ? { src: placeholder, alt: '' } : null });

export default {
  title: 'Composants/Card',
  render,
  argTypes: {
    title: { control: 'text' },
    tag: { control: 'text' },
    text: { control: 'text' },
    meta: { control: 'text' },
    actionLabel: { control: 'text' },
    withImage: { control: 'boolean', name: 'avec image' },
    headingLevel: { control: 'select', options: [2, 3, 4] },
  },
  args: {
    title: 'Atelier vélo solidaire du samedi',
    href: '#',
    tag: 'Mobilité',
    text: 'Venez réparer votre vélo avec des bénévoles : outils prêtés, pièces d’occasion, café offert.',
    meta: '12 places · Paris 18e',
    actionLabel: 'S’inscrire',
    withImage: true,
    headingLevel: 3,
  },
};

export const ParDefaut = { name: 'Par défaut' };

export const SansImage = {
  name: 'Sans image',
  args: { withImage: false },
};

/** Tirez la poignée en bas à droite */
export const Redimensionnable = {
  render: (args) => {
    const piece = document.createElement('div');
    piece.style.cssText =
      'width: 22rem; min-width: 15rem; max-width: 100%; padding: 1rem; border: 2px dashed #9aa3b5; resize: horizontal; overflow: auto;';
    piece.append(render(args));
    return piece;
  },
};

/** La même Card dans trois pièces */
export const TroisLargeurs = {
  name: 'Trois largeurs',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: grid; gap: 2rem;';
    for (const width of ['18rem', '38rem', '54rem']) {
      const piece = document.createElement('div');
      piece.style.cssText = `width: ${width}; max-width: 100%;`;
      const label = document.createElement('p');
      label.textContent = `Pièce de ${width}`;
      label.style.cssText = 'margin: 0 0 .5rem; font: 600 .875rem system-ui;';
      piece.append(label, render(args));
      wrap.append(piece);
    }
    return wrap;
  },
};
```

🆕 **Créer le fichier** `packages/ui/src/card-grid/card-grid.stories.js` :

```js
import { createCardGrid } from './card-grid.js';
import { createCard } from '../card/card.js';
import placeholder from '../card/placeholder.svg';

const ateliers = [
  { tag: 'Mobilité', title: 'Atelier vélo solidaire', text: 'Outils prêtés, pièces d’occasion, café offert.', meta: '12 places' },
  { tag: 'Numérique', title: 'Initiation au numérique pour les seniors du quartier', text: 'Envoyer un mail, faire une visio avec ses petits-enfants, éviter les arnaques en ligne.', meta: '8 places' },
  { tag: 'Alimentation', title: 'Cuisine anti-gaspi', text: 'On cuisine les invendus du marché.', meta: 'Complet' },
  { tag: 'Culture', title: 'Bibliothèque de rue', text: 'Déposez un livre, prenez-en un. Tous les dimanches matin devant la mairie.', meta: 'Accès libre' },
  { tag: 'Emploi', title: 'Relecture de CV par des pros du recrutement', text: 'Trente minutes en tête-à-tête.', meta: '5 places' },
  { tag: 'Nature', title: 'Jardin partagé', text: 'Semis d’automne et compost.', meta: '20 places' },
];

export default {
  title: 'Composants/CardGrid',
  argTypes: {
    largeur: { control: { type: 'range', min: 16, max: 80, step: 1 }, name: 'largeur (rem)' },
    aligned: { control: 'boolean', name: 'alignée (subgrid)' },
  },
  args: { largeur: 70, aligned: false },
  render: ({ largeur, aligned }) => {
    const piece = document.createElement('div');
    piece.style.cssText = `width: ${largeur}rem; max-width: 100%;`;
    const cards = ateliers.map((props) =>
      createCard({ ...props, href: '#', actionLabel: 'S’inscrire', image: { src: placeholder, alt: '' } }),
    );
    piece.append(createCardGrid(cards, { label: 'Ateliers du mois', aligned }));
    return piece;
  },
};

export const Grille = {};
export const Alignee = { name: 'Alignée', args: { aligned: true } };
```

```bash
npm run storybook
```

**Ce que vous devez voir :** dans le menu, `Composants > Card` (Docs, Par défaut, Sans image, Redimensionnable, Trois largeurs) et `Composants > CardGrid` (Docs, Grille, Alignée).

Faites le tour :

- [ ] Le panneau **Controls** change les props de la Card en direct (titre, étiquette, avec ou sans image…)
- [ ] **Trois largeurs** montre trois mises en page différentes
- [ ] **Redimensionnable** : tirez la poignée, la Card bascule
- [ ] **CardGrid** : le contrôle *largeur* fait apparaître et disparaître les colonnes
- [ ] **Alignée** : les boutons sont alignés d'une Card à l'autre
- [ ] Le panneau **Accessibility** n'affiche aucune violation sur la story *Par défaut*
- [ ] Au clavier, `Tab` s'arrête deux fois par Card, avec un contour bien visible

> Le panneau Accessibility peut signaler `region` ou `landmark-one-main` sur certaines stories : Storybook affiche le composant seul, sans `<main>` autour. Ce n'est pas un problème du composant. Les violations à corriger sont celles qui parlent de **contraste**, de **nom accessible** ou de **liens**.

Le labo, la page et Storybook utilisent **le même fichier `card.css`**. Changez `--radius-lg` dans les tokens, et les trois changent ensemble, comme au tuto 4.

---

## Étape 12 — Mesurer, vérifier, commiter

### Le poids

```bash
npm run build -w @ds/web
```

**Ce que vous devez voir :** environ **4 Ko de JavaScript** et **6 Ko de CSS** pour toute la page, Cards comprises. Notez-le dans `DECISIONS.md`, à côté du chiffre du tuto 4. Le labo n'est **pas** compté : il vit dans `packages/ui` et n'est jamais mis en ligne.

### La règle de la séance

```bash
grep -rn "@media" packages/ui/src --include=*.css
```

**Ce que vous devez voir :** rien. Aucune media query dans vos composants.

```bash
grep -rnE "#[0-9a-fA-F]{3,6}\b|--color-(brand|neutral|red)-" packages/ui/src --include=*.css
```

**Ce que vous devez voir :** rien. Aucune couleur en dur, aucune primitive dans vos composants.

### Commiter

```bash
git add -A
git status
```

Vérifiez que `dist/` et `storybook-static/` n'apparaissent pas.

```bash
git commit -m "feat(ui): Card et CardGrid en CSS moderne"
git push -u origin seance-3
```

---

## Récapitulatif : pourquoi chaque notion

| Notion | Pourquoi on l'utilise | Où dans le code |
| --- | --- | --- |
| `grid-row`, `order` | L'ordre visuel diffère de l'ordre de lecture, sans toucher au HTML | Étape 2 |
| `@layer` | Le projet peut toujours personnaliser un composant, sans guerre de spécificité ni `!important` | Haut de `card.css` et `card-grid.css` |
| `clamp()` | Une taille fluide entre un plancher et un plafond, sans media query, qui respecte le zoom | `--card-padding`, `.card__title` |
| `aspect-ratio` | La place de l'image est réservée, quelle que soit l'image : la page ne saute pas (CLS) | `.card__media` |
| Container queries | Le composant s'adapte à **sa place**, pas à l'écran | `container: card / inline-size`, `@container card (…)` |
| `cqi` | Des tailles proportionnelles à la pièce, pas à l'écran | `6cqi`, `3cqi` |
| Nesting natif | Un seul sélecteur pour toutes les règles d'un bloc | `& > .card__media` dans la container query |
| `:has()` | Le composant s'adapte à son contenu réel (avec ou sans image) et à l'état de ses enfants | Container query, survol, focus |
| `prefers-reduced-motion` | Respecter les personnes que les animations rendent malades, réglé une seule fois dans les tokens | `foundations.css` |
| `auto-fill` + `minmax()` | La grille calcule seule son nombre de colonnes | `.card-grid` |
| `min(100%, …)` | Pas de débordement horizontal sur petit écran | `.card-grid` |
| `subgrid` | Aligner les Cards voisines, au prix de leur adaptation autonome | `.card-grid--aligned` |

### Votre dépôt maintenant

```
packages/
├── tokens/                    ← les tokens de la séance 3 (fournis)
└── ui/
    ├── labo/                  ← l'établi (fourni, jamais mis en ligne)
    └── src/
        ├── index.js           ← exporte createCard et createCardGrid
        ├── card/
        │   ├── card.js        ← le HTML et les props (étape 1)
        │   ├── card.css       ← le design (étape 2) + le CSS moderne (étapes 3 à 7)
        │   ├── card.stories.js
        │   └── placeholder.svg
        └── card-grid/
            ├── card-grid.js
            ├── card-grid.css  ← étapes 8 et 9
            └── card-grid.stories.js
apps/web/
├── index.html                 ← trois pièces
├── style.css                  ← la seule media query
├── main.js                    ← la Card et la grille, avec leurs props
└── placeholder.svg
```

| Commande, depuis la racine | Ce qu'elle fait |
| --- | --- |
| `npm run labo` | Ouvre le labo |
| `npm run dev` | Ouvre votre page |
| `npm run storybook` | Ouvre la vitrine des composants |

### Checklist de fin de séance

- [ ] Au labo, la Card prend trois mises en page différentes selon la pièce
- [ ] La Card sans image reste verticale dans une pièce large
- [ ] Deux arrêts clavier par Card, focus visible sur toute la Card
- [ ] Avec `prefers-reduced-motion: reduce`, la Card ne bouge plus au survol
- [ ] La grille passe de 3 à 1 colonne sans media query
- [ ] Le choix « alignée ou non » est noté dans `DECISIONS.md`
- [ ] Sur la page, à 800 px, la Card « Près de chez vous » est horizontale
- [ ] Les deux `grep` de l'étape 12 ne renvoient rien
- [ ] Le travail est commité et poussé

---

## En cas de problème

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `Missing script: "labo"` | Le kit n'est pas récupéré | Annexe A |
| `localhost:5174` affiche une page 404 | Il n'y a rien à la racine du labo | Ajouter `/labo/index.html` à l'adresse |
| Une page du labo est toute blanche | Le fichier HTML est vide ou n'est pas au bon endroit | `git status` : vous ne devez pas avoir modifié `packages/ui/labo/`. Sinon, `git checkout packages/ui/labo` |
| Le labo affiche encore « Card à construire » | `card.js` n'est pas enregistré, ou ce n'est pas le bon fichier | Il doit être dans `packages/ui/src/card/card.js` |
| L'image déborde de la Card, le texte est coupé | La règle `.card__media img` de l'étape 2.2 manque | Elle contient `width: 100%` : l'image s'adapte à la Card |
| L'image reste sous le titre | Le bloc de l'étape 2.5 manque | Vérifier les `grid-row` |
| Les couleurs manquent partout | Les tokens du kit manquent | Vérifier les commentaires « Séance 3 » dans `packages/tokens/` |
| Plus aucun style sur la Card après l'étape 3 | L'accolade `}` de fin manque, ou est en trop | Le fichier doit finir par `}` juste après le bloc 2.5 |
| Le labo n'affiche pas ce que dit le tuto, alors que le code est juste | Le navigateur montre une autre version : fichier non enregistré, ou un autre labo encore lancé | Enregistrer, recharger avec `Cmd + Maj + R` (`Ctrl + Maj + R`), et vérifier dans le terminal l'adresse du labo (si le port 5174 était pris, Vite a choisi 5175) |
| Je ne sais plus où j'en suis dans `card.css` | — | Comparer avec les points de contrôle de fin d'étape 2 et 7 |
| La Card ne change jamais de forme | `container: card / inline-size;` absent, ou nom différent dans `@container card (…)` | Les deux noms doivent être identiques |
| La container query vise `.card` et rien ne se passe | Un conteneur ne peut pas se styler lui-même | Viser `.card__inner` et ses enfants |
| La Card s'écrase à une largeur de zéro | Le parent de la Card est en `display: flex` ou `inline-block` | Un conteneur prend la largeur de son parent : le poser dans un bloc ou une grille |
| Le bouton ne réagit plus au clic | Le lien étendu le recouvre | Vérifier `position: relative; z-index: 2;` sur `.card__footer .button` |
| Les titres ont tous la même taille | Le bloc de l'étape 5.1 manque | Le rajouter à la fin du fichier |
| La grille reste sur une colonne | Le bloc « Étape 8 — les colonnes » manque | Vérifier la ligne `grid-template-columns` |
| La grille alignée n'aligne rien | La Card est encore un conteneur | `container-type: normal` dans `.card-grid--aligned .card` |
| Une barre de défilement horizontale sur mobile | `minmax(17rem, 1fr)` sans `min()` | `minmax(min(100%, 17rem), 1fr)` |
| `does not provide an export named 'createCard'` | Le composant n'est pas exporté | Vérifier `packages/ui/src/index.js` |
| `Port 5174 is in use` | Le labo tourne déjà dans un autre terminal | Vite prend le port suivant tout seul : lisez l'adresse affichée |

---

## Annexe A — Récupérer le kit dans votre propre dépôt

Si vous travaillez dans votre propre dépôt (créé depuis le modèle avec *Use this template*), le kit n'y est pas encore. Depuis la racine de **votre** dépôt, après avoir commité votre travail :

```bash
git remote add modele https://github.com/Conniek/design-system-starter.git
git fetch modele
git checkout modele/main -- packages/ui/labo packages/ui/src/card packages/ui/src/card-grid apps/web/placeholder.svg
npm pkg set scripts.labo="vite --port 5174 --open /labo/index.html" -w @ds/ui
npm pkg set scripts.labo="npm run labo -w @ds/ui"
```

La troisième commande copie les dossiers du kit depuis le dépôt modèle, **sans toucher** au reste de votre travail.

Ajoutez ensuite ces deux lignes dans `packages/ui/src/index.js` :

```js
export { createCard } from './card/card.js';
export { createCardGrid } from './card-grid/card-grid.js';
```

Enfin, les tokens. On ne copie pas les fichiers du modèle, pour ne pas écraser les vôtres. Ajoutez ces lignes à l'intérieur de `:root`, dans chaque fichier :

`packages/tokens/primitives.css` :

```css
  --color-brand-50: #eef2fd;
  --color-neutral-50: #f5f6f8;
  --color-neutral-200: #d9dce3;
```

`packages/tokens/semantic.css` :

```css
  --color-bg-subtle: var(--color-neutral-50);
  --color-bg-accent: var(--color-brand-50);
  --color-border-default: var(--color-neutral-200);
  --color-text-accent: var(--color-brand-700);
```

`packages/tokens/foundations.css` :

```css
  --font-size-100: 0.875rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --radius-lg: 16px;
  --shadow-raised: 0 4px 16px rgb(23 26 33 / 0.12);
  --motion-lift: -2px;
```

Et, toujours dans `foundations.css`, ajoutez `--motion-lift: 0px;` dans le bloc `@media (prefers-reduced-motion: reduce)`, à côté de `--duration-base: 0ms;`.

Si un token porte déjà un autre nom chez vous (votre gris clair s'appelle `--color-gray-100`, par exemple), gardez le vôtre et faites pointer le token sémantique dessus. Puis revenez à l'étape 0.2.

---

**Suite : enrichir la Card (thème sombre, variante compacte) et l'adapter à votre projet.**
