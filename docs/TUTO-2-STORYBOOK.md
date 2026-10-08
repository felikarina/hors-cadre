# Tuto 2 — Installer Storybook et écrire sa première story

**Durée :** 30 à 40 minutes
**Point de départ :** la fin du tuto 1 (dépôt en monorepo, `npm ls --workspaces` fonctionne)
**Point d'arrivée :** Storybook tourne sur votre machine et affiche votre Button dans trois états, avec sa documentation et son contrôle d'accessibilité

---

## Storybook, c'est quoi ?

Imaginez le showroom d'un magasin de meubles. Chaque meuble y est exposé **seul**, dans toutes ses couleurs, et on peut le tester avant de l'installer chez soi.

Storybook, c'est la même chose pour vos composants :

- **Une vitrine :** chaque composant est affiché seul, dans tous ses états (normal, secondaire, désactivé…). Quelqu'un qui rejoint le projet voit en une minute tout ce qui existe.
- **Un atelier :** vous développez le composant isolé, sans la page autour. Pas besoin de cliquer dans toute l'application pour voir l'état « désactivé ».
- **Un contrôle qualité :** un module vérifie l'accessibilité de chaque état, en direct.

Une **story**, c'est un état d'un composant. « Le bouton primaire », « le bouton désactivé » : deux stories.

**Où vit Storybook dans le monorepo ?** Dans `packages/ui`, à côté des composants qu'il documente. C'est la vitrine de `@ds/ui`.

```
design-system/
├── packages/
│   ├── tokens/              @ds/tokens
│   └── ui/                  @ds/ui
│       ├── .storybook/      ← la configuration de Storybook (nouveau)
│       └── src/
│           └── button/
│               ├── button.css
│               ├── button.js          ← le composant (nouveau)
│               └── button.stories.js  ← ses stories (nouveau)
└── apps/
```

---

## Étape 0 — Vérifier le point de départ

Terminal ouvert **à la racine du dépôt**, sur la branche `seance-2` :

```bash
git branch --show-current
npm ls --workspaces
```

**Ce que vous devez voir :** `seance-2`, puis `@ds/tokens` et `@ds/ui` dans l'arbre. Si ce n'est pas le cas, terminez d'abord le tuto 1.

---

## Étape 1 — Installer Storybook

Toujours depuis la racine :

```bash
npm install -D storybook @storybook/html-vite @storybook/addon-docs @storybook/addon-a11y vite -w @ds/ui
```

Ce que fait chaque morceau :

| Morceau | Rôle |
| --- | --- |
| `-D` | Dépendances de développement : utiles pour travailler, pas pour l'utilisateur final |
| `storybook` | Le cœur de Storybook |
| `@storybook/html-vite` | La version pour HTML et JavaScript natifs, sans framework. Comme pour le memory |
| `@storybook/addon-docs` | Génère une page de documentation par composant |
| `@storybook/addon-a11y` | Vérifie l'accessibilité de chaque story |
| `vite` | L'outil qui sert et recharge les fichiers pendant que vous codez |
| `-w @ds/ui` | Installe tout ça **dans le paquet ui uniquement**, pas dans tout le dépôt |

Comptez environ 30 secondes.

**Ce que vous devez voir :** `found 0 vulnerabilities` à la fin, et une section `devDependencies` apparue dans `packages/ui/package.json`.

> **Pourquoi on n'utilise pas `npx storybook init` ?** L'assistant officiel pose des questions, installe des exemples qu'on supprimerait ensuite, et crée des fichiers qu'on ne comprendrait pas. En installant à la main, vous écrivez vous-mêmes les deux seuls fichiers de configuration nécessaires.

---

## Étape 2 — Configurer Storybook

Créez le dossier de configuration :

```bash
mkdir -p packages/ui/.storybook
```

Le point devant `.storybook` en fait un dossier caché : il n'apparaît pas avec un simple `ls`, utilisez `ls -a` pour le voir.

### 2.1 — `packages/ui/.storybook/main.js`

```js
export default {
  framework: '@storybook/html-vite',
  stories: ['../src/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
};
```

Trois lignes, trois questions :

| Ligne | Répond à la question |
| --- | --- |
| `framework` | Avec quel moteur afficher les composants ? HTML natif, servi par Vite |
| `stories` | Où sont les stories ? Dans tous les fichiers qui finissent par `.stories.js`, n'importe où sous `src/` |
| `addons` | Quels modules ajouter ? La documentation et l'accessibilité |

Le `**` veut dire « dans n'importe quel sous-dossier ». Vous n'aurez jamais à toucher ce fichier quand vous ajouterez un composant : il suffira de nommer son fichier `quelquechose.stories.js`.

### 2.2 — `packages/ui/.storybook/preview.js`

```js
import '@ds/tokens';

export default {
  tags: ['autodocs'],
};
```

| Ligne | Rôle |
| --- | --- |
| `import '@ds/tokens'` | Charge vos tokens avant d'afficher chaque story. Sans cette ligne, vos composants s'affichent sans couleurs |
| `tags: ['autodocs']` | Crée automatiquement une page Docs pour chaque composant |

**Remarquez l'import :** on écrit `@ds/tokens`, pas `../../tokens/index.css`. C'est le monorepo du tuto 1 qui rend ça possible.

---

## Étape 3 — Transformer le bouton en composant

Jusqu'ici, votre bouton n'était qu'un fichier CSS. Pour l'afficher dans Storybook, et plus tard dans votre page, il faut aussi une **fonction qui fabrique le bouton**.

Créez `packages/ui/src/button/button.js` :

```js
import './button.css';

export function createButton({ label = 'Bouton', variant = 'primary', disabled = false, onClick } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = ['button', variant !== 'primary' && `button--${variant}`].filter(Boolean).join(' ');
  button.textContent = label;
  button.disabled = disabled;
  if (onClick) button.addEventListener('click', onClick);
  return button;
}
```

Ce qui se passe, ligne par ligne :

1. `import './button.css'` : le composant apporte son propre style. Qui importe le bouton reçoit son CSS avec.
2. La fonction reçoit des **options** (on dit des *props*) : le texte, la variante, l'état désactivé, l'action au clic. Chacune a une valeur par défaut après le `=`.
3. Elle crée un vrai `<button>`. Comme dans le memory : le focus, la touche Entrée et la touche Espace fonctionnent sans une ligne de JavaScript en plus.
4. `type = 'button'` évite que le bouton envoie un formulaire par accident.
5. La classe devient `button` pour le primaire, `button button--secondary` pour le secondaire. C'est la convention **BEM** : `--` signale une variante.
6. `return button` : la fonction **renvoie** l'élément. Sans ce `return`, rien ne s'affiche.

> Si votre `button.css` de la séance 1 n'a pas encore de règle `.button--secondary`, la story Secondary ressemblera au primaire. C'est normal, on complète le CSS au tuto 3.

---

## Étape 4 — Ouvrir la porte de la bibliothèque

Remplacez le contenu de `packages/ui/src/index.js` par :

```js
export { createButton } from './button/button.js';
```

**Pourquoi :** c'est la porte d'entrée de `@ds/ui`. Tout ce qui est exporté ici pourra être importé par n'importe quel projet avec `import { createButton } from '@ds/ui'`. Ce qui n'est pas exporté ici reste privé à la bibliothèque.

---

## Étape 5 — Écrire la première story

Créez `packages/ui/src/button/button.stories.js` :

```js
import { createButton } from './button.js';

export default {
  title: 'Composants/Button',
  render: (args) => createButton(args),
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Envoyer', variant: 'primary', disabled: false },
};

export const Primary = {};
export const Secondary = { args: { variant: 'secondary' } };
export const Disabled = { args: { disabled: true } };
```

Le fichier a deux parties.

**L'export par défaut décrit le composant :**

| Clé | Rôle |
| --- | --- |
| `title` | Où le ranger dans le menu de Storybook. Le `/` crée un dossier : `Composants` puis `Button` |
| `render` | Comment l'afficher : on appelle `createButton` avec les options de la story |
| `argTypes` | Quels réglages proposer dans le panneau Controls : un champ texte, des boutons radio, une case à cocher |
| `args` | Les valeurs par défaut, partagées par toutes les stories |

**Chaque export nommé est une story, donc un état :**

- `Primary` reprend les valeurs par défaut telles quelles.
- `Secondary` change seulement la variante.
- `Disabled` change seulement l'état désactivé.

Une story ne décrit que **ce qui change** par rapport aux valeurs par défaut.

---

## Étape 6 — Lancer Storybook

Ajoutez les commandes de lancement, depuis la racine :

```bash
npm pkg set scripts.storybook="storybook dev -p 6006" scripts.build-storybook="storybook build" -w @ds/ui
npm pkg set scripts.storybook="npm run storybook -w @ds/ui"
```

La première ligne ajoute les commandes dans `packages/ui/package.json`. La deuxième crée un raccourci à la racine, pour ne jamais avoir à changer de dossier.

Puis :

```bash
npm run storybook
```

**Ce que vous devez voir :** le terminal affiche `Local: http://localhost:6006/` et le navigateur s'ouvre. À gauche, un menu `Composants > Button` avec `Docs`, `Primary`, `Secondary` et `Disabled`.

Le terminal reste occupé tant que Storybook tourne. Pour l'arrêter : `Ctrl + C`. Pour continuer à taper des commandes en parallèle, ouvrez un deuxième terminal.

---

## Étape 7 — Faire le tour de l'interface

Prenez cinq minutes pour tester chaque zone. C'est là que Storybook prend tout son sens.

**1. Le canvas, au centre.** Votre bouton, seul. Cliquez sur `Primary`, `Secondary`, `Disabled` dans le menu : un état par story.

**2. Le panneau Controls, en bas.** Changez le texte du label, passez la variante en `secondary`, cochez `disabled`. Le bouton change en direct, sans toucher au code.

**3. La page Docs.** Cliquez sur `Docs` dans le menu : toutes les stories sur une seule page, avec le tableau des options. Elle a été générée toute seule grâce à `autodocs`.

**4. Le panneau Accessibility.** Ouvrez l'onglet `Accessibility` en bas, sur chaque story. Objectif : **zéro violation**. Si une violation apparaît (un contraste insuffisant, par exemple), Storybook explique laquelle et pourquoi.

**5. Le test au clavier.** Cliquez dans le canvas, puis appuyez sur `Tab`. Le focus doit être bien visible sur le bouton. Le panneau a11y ne voit pas tout : le clavier reste le test de vérité, comme pour le memory.

**6. Le rechargement à chaud.** Laissez Storybook ouvert, changez une couleur dans `packages/tokens/primitives.css` et enregistrez. Le bouton se met à jour sans recharger la page. Annulez ensuite la modification.

---

## Étape 8 — Commiter

Dans un deuxième terminal, ou après avoir arrêté Storybook :

```bash
git add -A
git status
```

Vérifiez que `node_modules/` et `storybook-static/` n'apparaissent **pas** dans la liste : le `.gitignore` du tuto 1 les exclut.

```bash
git commit -m "feat(ui): Storybook et première story du Button"
git push
```

---

## Récapitulatif

```
packages/ui/
├── package.json           ← + devDependencies et scripts
├── .storybook/
│   ├── main.js            ← moteur, emplacement des stories, modules
│   └── preview.js         ← charge @ds/tokens, active autodocs
└── src/
    ├── index.js           ← exporte createButton
    └── button/
        ├── button.css
        ├── button.js      ← fabrique un vrai <button>
        └── button.stories.js  ← Primary, Secondary, Disabled
```

### Checklist avant de passer au tuto 3

- [ ] `npm run storybook` depuis la racine ouvre Storybook
- [ ] Le Button apparaît dans ses trois stories
- [ ] Le panneau Controls modifie le bouton en direct
- [ ] La page Docs existe
- [ ] Le panneau Accessibility affiche zéro violation sur chaque story
- [ ] Le focus est visible en naviguant avec `Tab`
- [ ] Le travail est commité et poussé

---

## En cas de problème

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| Storybook refuse de démarrer, erreur qui mentionne la version de Node | Node trop ancien | `node -v`, installer Node 22 |
| `Missing script: "storybook"` | Script non ajouté, ou commande lancée au mauvais endroit | Refaire l'étape 6 depuis la racine |
| Le menu de gauche est vide | Le fichier de stories est mal nommé ou mal placé | Il doit finir par `.stories.js` et se trouver sous `packages/ui/src/` |
| La story s'affiche vide | `createButton` ne renvoie rien | Vérifier le `return button` à la fin de la fonction |
| Le bouton s'affiche sans couleurs | Les tokens ne sont pas chargés | Vérifier `import '@ds/tokens';` dans `preview.js` |
| `Failed to resolve import "@ds/tokens"` | Les raccourcis du tuto 1 n'existent pas | `npm install` depuis la racine, puis `ls -la node_modules/@ds` |
| Secondary ressemble à Primary | Pas de règle `.button--secondary` dans le CSS | Normal pour l'instant, on la complète au tuto 3 |
| `Port 6006 is already in use` | Un autre Storybook tourne déjà | Le fermer avec `Ctrl + C`, ou lancer avec un autre port |
| Erreur de syntaxe au lancement | Une accolade ou une virgule manquante dans `main.js` ou `preview.js` | Comparer ligne à ligne avec ce tuto |

---

**Suite : Tuto 3 — Compléter le Button, puis ajouter un deuxième composant.**
