# Correction — Exercice 5 : enrichir la Card

À ouvrir **après** l'exercice. Le code complet est sur la branche `seance-3-correction` :

```bash
git fetch
git diff seance-3 origin/seance-3-correction
```

---

## Mission 1 — Le thème sombre

### Réponses aux questions

1. **Dans `semantic.css` uniquement.** Les primitives sont des valeurs brutes : `brand-600` reste le même bleu en clair comme en sombre. Ce qui change, c'est l'*intention* : « la couleur du texte par défaut » pointe vers une autre primitive.
2. **Zéro ligne de `card.css`.** C'est la preuve que la Card est construite à 100 % en tokens sémantiques. Si vous avez dû toucher `card.css`, c'est qu'une primitive ou une couleur en dur y traînait.
3. **Dans `primitives.css`**, en complétant les gammes : `brand-200`, `brand-900`, `neutral-950`.
4. **Avec un bouton dans la barre d'outils de Storybook** (`globalTypes`) et un **décorateur** qui pose `data-theme`.

### Le code

`packages/tokens/primitives.css` — trois teintes en plus :

```css
--color-brand-200: #a9bcf5;
--color-brand-900: #14275f;
--color-neutral-950: #0d0f13;
```

`packages/tokens/semantic.css` :

```css
[data-theme="dark"] {
  --color-text-default: var(--color-neutral-0);
  --color-text-subtle: var(--color-neutral-200);
  --color-text-accent: var(--color-brand-200);
  --color-bg-default: var(--color-neutral-900);
  --color-bg-subtle: var(--color-neutral-950);
  --color-bg-accent: var(--color-brand-900);
  --color-border-default: var(--color-neutral-700);
  --color-action-primary: var(--color-brand-200);
  --color-action-primary-hover: var(--color-brand-50);
  --color-text-on-action: var(--color-neutral-900);
  --color-border-focus: var(--color-brand-200);
  color-scheme: dark;
}
```

**Le point à retenir :** en sombre, l'action primaire passe du `brand-600` au `brand-200`. Un bleu foncé sur fond foncé ne serait pas lisible. On inverse aussi `text-on-action` : texte foncé sur bouton clair.

`packages/ui/.storybook/preview.js` :

```js
import '@ds/tokens';

export default {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Thème du design system',
      toolbar: {
        title: 'Thème',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Clair' },
          { value: 'dark', title: 'Sombre' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      document.body.style.background = 'var(--color-bg-subtle)';
      return story();
    },
  ],
};
```

**Pour aller plus loin :** respecter la préférence du système avec `@media (prefers-color-scheme: dark)` dans `semantic.css`. C'est une media query, mais elle est dans les tokens, pas dans un composant : elle décrit l'utilisateur, pas la taille d'un écran.

---

## Mission 2 — La variante compacte

### Réponses aux questions

1. La Card expose `--card-padding`, `--card-radius`, `--card-bg` et `--card-border`. C'est son **API de personnalisation**.
2. **Seulement des variables.** Toute la mise en page (grille, container queries, `:has()`) lit ces variables. Changer la variable suffit.
3. En écrivant le titre `font-size: var(--card-title-size, clamp(…))`. Sans variante, la variable n'existe pas et le `clamp()` s'applique. Avec la variante, elle prend le dessus.
4. Un paramètre `variant` de `createCard`, qui ajoute la classe `card--compact`. Comme `createButton`.

### Le code

`packages/ui/src/card/card.css`, dans `@layer ds.components` :

```css
.card__title {
  font-size: var(--card-title-size, clamp(1.125rem, 0.75rem + 3cqi, 1.75rem));
}

.card--compact {
  --card-padding: var(--space-2);
  --card-radius: var(--radius-md);
  --card-title-size: 1rem;
}
```

Attention à l'ordre : `.card--compact` doit être écrit **après** `.card` dans le fichier. Les deux sélecteurs ont la même spécificité, c'est donc le dernier qui gagne.

`packages/ui/src/card/card.js` :

```js
export function createCard({
  // … paramètres existants
  variant = 'default', // 'default' | 'compact'
} = {}) {
  const card = document.createElement('article');
  card.className = ['card', variant !== 'default' && `card--${variant}`].filter(Boolean).join(' ');
  // …
}
```

`packages/ui/src/card/card.stories.js` :

```js
argTypes: {
  // …
  variant: { control: 'radio', options: ['default', 'compact'] },
},

export const Compacte = { args: { variant: 'compact' } };
```

**Le point à retenir :** la variante compacte reste responsive. À 38rem, elle passe toujours en horizontal, parce qu'on n'a touché à aucune règle de mise en page.

---

## Mission 3 — La Card de votre projet

Il n'y a pas de code unique ici. Voici ce qu'on vérifie avec vous :

| Question | Ce qu'on attend |
| --- | --- |
| Où apparaît la Card ? | Au moins deux pièces de largeur différente dans `apps/web` (grille + bloc à la une, ou grille + barre latérale) |
| Les seuils | Justifiés par **votre** contenu. « À 30rem, mon titre de 4 mots tient à côté de l'image » est une bonne justification. « 768px, c'est la tablette » n'en est pas une |
| Deuxième élément cliquable | `position: relative; z-index: 2;` sur lui, sinon le lien étendu le recouvre et il devient inaccessible à la souris |
| `aligned` ou non | Une ligne dans `DECISIONS.md`, par exemple : « Grille alignée sur la page catalogue : les cartes ont toutes une image et un prix, l'alignement aide à comparer. Pas d'alignement sur l'accueil : les cartes y changent de forme. » |

**Les erreurs les plus fréquentes :**

- Ajouter une `@media` dans `card.css` pour « corriger » un cas. Il faut plutôt ajuster le seuil de la `@container`.
- Oublier `.card__inner` et mettre la container query sur `.card` elle-même : rien ne se passe, car un conteneur ne peut pas se mesurer lui-même.
- Mettre l'image avant le titre dans le HTML pour qu'elle soit en haut. C'est la grille qui doit placer l'image (`grid-row: 1`), pas l'ordre du HTML.

---

## Mission bonus — Le carrousel

`packages/ui/src/card-grid/card-grid.css` :

```css
.card-grid--scroll {
  grid-template-columns: none;
  grid-auto-flow: column;                 /* une seule rangée */
  grid-auto-columns: min(85%, 18rem);     /* on voit dépasser la carte suivante */
  overflow-x: auto;
  overscroll-behavior-inline: contain;    /* ne fait pas défiler la page */
  scroll-snap-type: inline mandatory;
  scroll-padding-inline: var(--space-4);
  padding-block-end: var(--space-4);

  & > li {
    scroll-snap-align: start;
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-border-focus);
    outline-offset: 4px;
  }
}
```

`packages/ui/src/card-grid/card-grid.js` :

```js
export function createCardGrid(cards = [], { label, aligned = false, scroll = false } = {}) {
  const list = document.createElement('ul');
  list.className = ['card-grid', aligned && 'card-grid--aligned', scroll && 'card-grid--scroll']
    .filter(Boolean)
    .join(' ');
  if (label) list.setAttribute('aria-label', label);
  if (scroll) list.tabIndex = 0; // RGAA 7.3 : la zone qui défile doit être atteignable au clavier
  // …
}
```

**Le point à retenir :** `min(85%, 18rem)`. À 85 %, la carte suivante dépasse un peu sur le côté. C'est le signal visuel qu'on peut faire défiler, sans flèche ni JavaScript.
