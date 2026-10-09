# Correction — Exercice 3 : Button et TextField

Ce code a été testé avec Storybook 10. Il existe d'autres bonnes réponses : ce qui compte, c'est de pouvoir justifier chaque choix avec les trois règles de l'exercice.

---

## Partie A — Le Button

### A1 — Les états

| Type | Nom | Déclencheur |
| --- | --- | --- |
| Variante | Primaire | L'action principale de l'écran |
| Variante | Secondaire | Une action moins importante, à côté de la principale |
| État | Survol | La souris passe dessus |
| État | Focus clavier | On arrive dessus avec `Tab` |
| État | Désactivé | L'action n'est pas encore possible |

On aurait aussi pu citer l'état « appuyé » (`:active`) ou « en chargement ». Ils ne sont pas obligatoires pour cette séance.

### Les tokens nécessaires

Dans `packages/tokens/semantic.css`, vérifiez que ces tokens existent :

```css
  --color-action-primary: var(--color-brand-600);
  --color-action-primary-hover: var(--color-brand-700);
  --color-text-on-action: var(--color-neutral-0);
  --color-border-focus: var(--color-brand-600);
```

Et dans `packages/tokens/foundations.css` : `--space-2`, `--space-4`, `--radius-md`, `--focus-ring-width` et `--duration-base` (qui passe à `0ms` sous `prefers-reduced-motion`).

### `packages/ui/src/button/button.css`

```css
.button {
  --button-bg: var(--color-action-primary);
  --button-bg-hover: var(--color-action-primary-hover);
  --button-fg: var(--color-text-on-action);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-block-size: 44px;
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--button-bg);
  border-radius: var(--radius-md);
  background: var(--button-bg);
  color: var(--button-fg);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--duration-base), border-color var(--duration-base);
}

.button:hover:not(:disabled) {
  --button-bg: var(--button-bg-hover);
}

.button:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-border-focus);
  outline-offset: 2px;
}

.button--secondary {
  --button-fg: var(--color-action-primary);
  background: transparent;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Les choix, expliqués

**A2 — Les variables locales.** `--button-bg`, `--button-bg-hover` et `--button-fg` sont déclarées une fois en haut. Toutes les propriétés les utilisent. Résultat : le survol tient en **une ligne**, qui change seulement `--button-bg`. Le fond et la bordure suivent automatiquement.

**A3 — Le survol.** `:hover:not(:disabled)` signifie « survolé et pas désactivé ». Sans le `:not`, un bouton désactivé changerait de couleur au survol, ce qui laisse croire qu'il est cliquable.

**A4 — Le focus.** `:focus-visible` n'affiche le contour qu'au clavier : les utilisateurs de souris ne voient pas un contour après chaque clic, les utilisateurs du clavier le voient toujours. `outline-offset: 2px` décolle le contour du bouton, il reste visible même sur un fond de la même couleur.

**A5 — La variante secondaire.** Deux lignes suffisent :

- `--button-fg` passe à la couleur d'action, pour le texte ;
- `background: transparent` laisse voir le fond de la page.

La bordure garde `--button-bg`, donc elle reste colorée et change elle aussi au survol, sans aucune règle supplémentaire.

**A6 — Désactivé.** Le sélecteur `:disabled` correspond directement à l'attribut HTML `disabled`, posé par `createButton`. Le curseur `not-allowed` complète la baisse d'opacité : l'information ne passe pas que par la couleur.

**A7 — Les détails.** `min-block-size: 44px` garantit la hauteur de la zone cliquable, même avec un texte court. La transition utilise `--duration-base` : elle disparaît pour les personnes qui ont demandé moins d'animations à leur système, sans une ligne de plus dans le composant.

Le fichier `button.js` et les stories `Primary`, `Secondary` et `Disabled` du tuto 2 ne changent pas.

---

## Partie B — Le TextField

### B1 — L'anatomie

```
┌─────────────────────────────────────┐
│ Adresse e-mail (obligatoire)        │  ← libellé, toujours visible
│ ┌─────────────────────────────────┐ │
│ │                                 │ │  ← zone de saisie
│ └─────────────────────────────────┘ │
│ Saisissez une adresse valide, par   │  ← message d'erreur, seulement si erreur
│ exemple nom@domaine.fr              │
└─────────────────────────────────────┘
```

Les états : par défaut, focus, en erreur. L'obligatoire est une option plutôt qu'un état.

### B2 — Les réponses aux quatre questions

| Question | Réponse |
| --- | --- |
| Relier libellé et champ | `<label for="X">` et `<input id="X">`. Le clic sur le libellé place le curseur dans le champ, et le lecteur d'écran annonce le libellé en arrivant sur le champ |
| Des `id` uniques | Un compteur `count` déclaré **en dehors** de la fonction. Il garde sa valeur entre deux appels et augmente à chaque fois : `text-field-1`, `text-field-2`… |
| Annoncer l'erreur | `aria-invalid="true"` dit que le champ est invalide. `aria-describedby="id-du-message"` fait lire le message en arrivant sur le champ |
| Le champ obligatoire | Le mot « (obligatoire) » dans le libellé, lisible par tout le monde, plus l'attribut `required` pour le navigateur. Un astérisque seul n'est pas compris par tous et n'est pas toujours lu |

### Le token nécessaire

Dans `packages/tokens/semantic.css`, on ajoute une couleur de danger :

```css
  --color-text-danger: var(--color-red-600);
```

Si la primitive n'existe pas encore, on l'ajoute d'abord dans `primitives.css` :

```css
  --color-red-600: #c62828;
```

### `packages/ui/src/text-field/text-field.js`

```js
import './text-field.css';

let count = 0;

export function createTextField({ label = 'Libellé', type = 'text', required = false, error = '' } = {}) {
  const id = `text-field-${++count}`;
  const wrapper = document.createElement('div');
  wrapper.className = error ? 'text-field text-field--error' : 'text-field';
  wrapper.innerHTML = `
    <label class="text-field__label" for="${id}">${label}${required ? ' (obligatoire)' : ''}</label>
    <input class="text-field__input" id="${id}" type="${type}" ${required ? 'required' : ''}
      ${error ? `aria-invalid="true" aria-describedby="${id}-error"` : ''}>
    ${error ? `<p class="text-field__error" id="${id}-error">${error}</p>` : ''}
  `;
  return wrapper;
}
```

**B3 — Les options choisies :** `label` (le texte du libellé), `type` (`text`, `email`, `password`… le bon type affiche le bon clavier sur mobile), `required` et `error` (le message, vide par défaut).

**B4 — Les choix :**

- `++count` augmente le compteur **avant** de l'utiliser : le premier champ reçoit `text-field-1`.
- Le message d'erreur a son propre `id` (`text-field-1-error`), c'est ce qui permet à `aria-describedby` de pointer vers lui.
- Les attributs ARIA et le message n'apparaissent **que** si `error` n'est pas vide. Un `aria-invalid="false"` partout ne servirait à rien.

### `packages/ui/src/text-field/text-field.css`

```css
.text-field { display: grid; gap: var(--space-1); }
.text-field__label { color: var(--color-text-default); font-weight: 600; }
.text-field__input {
  min-block-size: 44px;
  padding: var(--space-2);
  border: 1px solid var(--color-text-subtle);
  border-radius: var(--radius-md);
  font: inherit;
}
.text-field__input:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-border-focus);
  outline-offset: 2px;
}
.text-field__error { color: var(--color-text-danger); margin: 0; }
.text-field--error .text-field__input { border-color: var(--color-text-danger); }
```

**B5 — Les choix :**

- `display: grid` avec un `gap` empile libellé, champ et message, avec un espacement qui vient des tokens.
- La bordure utilise `--color-text-subtle`, un gris foncé : son contraste avec le fond blanc dépasse largement 3:1.
- Le focus réutilise **exactement** les tokens du Button : les deux composants se comportent pareil au clavier, sans dupliquer de valeur.
- En erreur, la bordure **et** le message changent de couleur, et le texte du message explique le problème : l'information ne passe jamais que par la couleur.

### `packages/ui/src/text-field/text-field.stories.js`

```js
import { createTextField } from './text-field.js';

export default {
  title: 'Composants/TextField',
  render: (args) => createTextField(args),
  args: { label: 'Adresse e-mail', type: 'email', required: true, error: '' },
};

export const Default = {};
export const WithError = { args: { error: 'Saisissez une adresse e-mail valide, par exemple nom@domaine.fr' } };
```

### `packages/ui/src/index.js`

```js
export { createButton } from './button/button.js';
export { createTextField } from './text-field/text-field.js';
```

**B7 — Pourquoi c'était nécessaire :** `index.js` est la porte d'entrée de `@ds/ui`. Un composant non exporté ici existe dans Storybook, mais aucun projet ne peut l'importer avec `from '@ds/ui'`.

---

## Corrections des bonus

### Variante `danger` du Button

Un nom qui dit **à quoi** sert la couleur, pas de quelle couleur elle est.

Dans `primitives.css`, si besoin :

```css
  --color-red-700: #a51d1d;
```

Dans `semantic.css` :

```css
  --color-action-danger: var(--color-red-600);
  --color-action-danger-hover: var(--color-red-700);
```

Dans `button.css`, grâce aux variables locales, la variante tient en trois lignes :

```css
.button--danger {
  --button-bg: var(--color-action-danger);
  --button-bg-hover: var(--color-action-danger-hover);
}
```

Dans `button.stories.js`, ajoutez `'danger'` aux options de `variant` et une story :

```js
export const Danger = { args: { variant: 'danger', label: 'Supprimer mon compte' } };
```

Aucune modification de `button.js` : la fonction ajoute déjà `button--${variant}`.

### TextField désactivé

Une option `disabled = false`, puis l'attribut `${disabled ? 'disabled' : ''}` sur l'`<input>`, et une story `Disabled`.

### Texte d'aide

Un `<p id="${id}-help">` toujours affiché, et un `aria-describedby` qui liste **les deux** identifiants, séparés par un espace, quand il y a une erreur : `aria-describedby="${id}-help ${id}-error"`. Le lecteur d'écran lit l'aide puis l'erreur.

---

## Grille d'auto-évaluation

| Critère | Button | TextField |
| --- | --- | --- |
| Une story par état ou variante | | |
| Zéro violation dans le panneau Accessibility | | |
| Focus clavier visible | | |
| Aucune primitive ni couleur en dur (les deux commandes `grep` ne trouvent rien) | | |
| Les tokens manquants ont été créés dans `semantic.css` | | |
| Exporté dans `src/index.js` | | |
| Spécifique au TextField : clic sur le libellé = curseur dans le champ | — | |
| Spécifique au TextField : erreur reliée par `aria-describedby` | — | |
