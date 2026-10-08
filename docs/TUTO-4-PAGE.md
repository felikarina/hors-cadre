# Tuto 4 — Utiliser les composants dans une page

**Durée :** 30 à 40 minutes
**Point de départ :** la fin du tuto 2 (Storybook affiche votre Button). Le tuto 3 (deuxième composant) est un plus, pas une obligation.
**Point d'arrivée :** une vraie page, dans `apps/web`, qui importe vos composants depuis `@ds/ui`, sans copier une seule ligne de leur code

---

## On change de casquette

Jusqu'ici, vous étiez **mainteneur·ses** du design system : vous fabriquiez les composants.

Maintenant, vous devenez **l'équipe produit** qui les utilise. Votre page ne fabrique aucun bouton. Elle prend celui de la bibliothèque, comme on prend une brique dans une boîte de Lego.

```
apps/web  ──importe──▶  @ds/ui  ──importe──▶  @ds/tokens
   ↑
 vous êtes ici
```

`apps/web` est le **début de votre projet de fin d'année**. Ce que vous construisez aujourd'hui, vous le gardez.

---

## Étape 0 — Vérifier le point de départ

Depuis la racine du dépôt :

```bash
npm ls --workspaces --depth=0
```

**Ce que vous devez voir :** `@ds/tokens` et `@ds/ui`. Et `npm run storybook` doit toujours ouvrir votre Button. Si ce n'est pas le cas, terminez d'abord le tuto 2.

---

## Étape 1 — Déclarer le projet comme un paquet

Au tuto 1, on avait mis un fichier vide `apps/web/.gitkeep` pour réserver la place. On n'en a plus besoin :

```bash
rm apps/web/.gitkeep
```

Créez `apps/web/package.json` :

```json
{
  "name": "@ds/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@ds/tokens": "0.1.0",
    "@ds/ui": "0.1.0"
  }
}
```

| Champ | Ce qu'il veut dire |
| --- | --- |
| `name` | Le nom du projet dans le monorepo |
| `private: true` | C'est une application, pas une bibliothèque : on ne la publiera jamais comme paquet |
| `scripts` | `dev` lance la page en local, `build` prépare la version finale à mettre en ligne |
| `dependencies` | **Les flèches de la règle d'or, écrites dans le code** : ce projet a besoin des tokens et des composants |

---

## Étape 2 — Installer Vite pour le projet

Depuis la racine :

```bash
npm install -D vite -w @ds/web
```

**Pourquoi Vite :** le navigateur ne sait pas ce que veut dire `import '@ds/ui'`. Vite fait le lien : il trouve le paquet grâce aux raccourcis du tuto 1, sert les fichiers, et recharge la page dès que vous enregistrez.

**Ce que vous devez voir :** `found 0 vulnerabilities`, et une section `devDependencies` dans `apps/web/package.json`.

---

## Étape 3 — La page HTML

Partez de **l'écran 1 de vos wireframes** de la séance 1. Pour commencer, voici un squelette minimal. Créez `apps/web/index.html` :

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
  <main class="page">
    <h1>Bienvenue</h1>
    <p>Cette page utilise les composants du design system, importés depuis <code>@ds/ui</code>.</p>
    <div class="actions" id="actions"></div>
  </main>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

Les réflexes accessibilité de la séance 1 sont déjà là : `lang="fr"`, un `<header>` et un `<main>` comme repères de navigation, un seul `<h1>`, un `<title>` qui dit où on est.

Le `<div id="actions">` est vide : c'est là que JavaScript va déposer les boutons.

`type="module"` sur le script autorise la syntaxe `import`.

---

## Étape 4 — Le style de la page

Créez `apps/web/style.css` :

```css
body {
  margin: 0;
  font-family: var(--font-family-base);
  line-height: var(--line-height-body);
  color: var(--color-text-default);
  background: var(--color-bg-default);
}
.site-header { padding: var(--space-4); border-block-end: 1px solid var(--color-text-subtle); }
.site-name { margin: 0; font-weight: 700; }
.page { max-inline-size: 60rem; margin-inline: auto; padding: var(--space-4); }
.actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
```

**La question à se poser à chaque ligne de CSS : est-ce que ça va dans le design system ou dans le projet ?**

| Dans le design system (`packages/`) | Dans le projet (`apps/web`) |
| --- | --- |
| Ce qui se réutilise partout : couleurs, espacements, Button, TextField | Ce qui est propre à cette page : la mise en page, la largeur du contenu, la place des boutons |
| Le bouton et tous ses états | Le fait que deux boutons soient côte à côte |

Même dans le projet, la règle de la séance 1 tient : **aucune couleur ni valeur en dur**, uniquement des tokens. Si la page a besoin d'une valeur qui n'existe pas, on crée un token, on ne l'écrit pas en dur.

---

## Étape 5 — Importer les composants

Créez `apps/web/main.js` :

```js
import '@ds/tokens';
import './style.css';
import { createButton } from '@ds/ui';

const actions = document.querySelector('#actions');

actions.append(
  createButton({ label: 'Créer un compte', onClick: () => alert('Bienvenue !') }),
  createButton({ label: 'En savoir plus', variant: 'secondary' }),
);
```

Ligne par ligne :

1. `import '@ds/tokens'` charge vos variables CSS. **Toujours en premier** : tout le reste en dépend.
2. `import './style.css'` charge le style propre à la page.
3. `import { createButton } from '@ds/ui'` va chercher le bouton dans la bibliothèque.
4. On récupère la zone vide de la page, et on y ajoute deux boutons fabriqués par `createButton`, avec les mêmes options que dans les Controls de Storybook.

**Le point le plus important du tuto :** on écrit `from '@ds/ui'`, et **pas** `from '../../packages/ui/src/button/button.js'`.

La page ne sait pas où vit le bouton. Elle sait seulement qu'il existe dans `@ds/ui`. Demain, si `@ds/ui` déménage, change d'organisation ou est publié sur npm pour d'autres équipes, cette ligne ne change pas. C'est ce qui permet de brancher la même bibliothèque sur un deuxième projet.

---

## Étape 6 — Lancer la page

Ajoutez un raccourci à la racine, comme pour Storybook :

```bash
npm pkg set scripts.dev="npm run dev -w @ds/web"
```

Puis :

```bash
npm run dev
```

**Ce que vous devez voir :** le terminal affiche `Local: http://localhost:5173/`. Ouvrez cette adresse : votre page, avec un bouton primaire et un bouton secondaire.

Testez tout de suite :

- [ ] Cliquer sur « Créer un compte » affiche le message
- [ ] `Tab` au clavier passe d'un bouton à l'autre, avec un focus bien visible
- [ ] `Entrée` et `Espace` déclenchent le bouton

---

## Étape 7 — Le test qui prouve tout

C'est **le moment le plus important de la séance**. Il faut deux terminaux ouverts à la racine :

- Terminal 1 : `npm run storybook`
- Terminal 2 : `npm run dev`

Placez Storybook et votre page **côte à côte** à l'écran.

**Test 1 : changer un token.** Dans `packages/tokens/primitives.css`, modifiez `--color-brand-600` (mettez une couleur bien visible, du violet par exemple), puis enregistrez.

**Ce que vous devez voir :** le bouton change de couleur **dans les deux fenêtres en même temps**, sans rien recharger.

**Test 2 : corriger un composant.** Dans `packages/ui/src/button/button.css`, changez l'épaisseur du focus (`outline-offset: 4px` par exemple), puis enregistrez et testez au clavier.

**Ce que vous devez voir :** le focus a changé dans Storybook **et** dans la page.

> Une ligne modifiée, deux endroits mis à jour. Avec le copier-coller, il aurait fallu corriger chaque copie à la main. C'est exactement pour ça qu'on a construit le monorepo.

Annulez ensuite vos deux modifications (`git checkout packages/` ou `Ctrl + Z`).

---

## Étape 8 — Mesurer le poids de la page

```bash
npm run build -w @ds/web
```

Vite prépare la version finale dans `apps/web/dist/` et affiche la taille de chaque fichier.

**Ce que vous devez voir :** environ **1 Ko de JavaScript** et **2 Ko de CSS** pour la page avec deux boutons.

Le lien avec l'éco-conception est direct : une bibliothèque sans framework ne pèse que ce qu'on y met. Notez ce chiffre dans `DECISIONS.md` : c'est votre point de référence. À chaque nouveau composant, vous pourrez vérifier ce qu'il coûte.

---

## Étape 9 — Bonus : un vrai formulaire avec le TextField

Si vous avez fait le tuto 3 et exporté `createTextField` dans `packages/ui/src/index.js`, assemblez deux composants.

Dans `apps/web/index.html`, remplacez la ligne `<div class="actions" id="actions"></div>` par :

```html
<form class="signup" id="signup" aria-labelledby="signup-title">
  <h2 id="signup-title">Créer un compte</h2>
</form>
```

Puis remplacez le contenu de `apps/web/main.js` :

```js
import '@ds/tokens';
import './style.css';
import { createButton, createTextField } from '@ds/ui';

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

Deux choses à remarquer :

- **`submit.type = 'submit'` :** le Button est `type="button"` par défaut, pour ne jamais envoyer un formulaire par accident. Ici, on veut justement qu'il l'envoie, donc on le dit explicitement.
- **Le formulaire est accessible sans effort supplémentaire :** le label relié au champ, la mention « obligatoire », le focus visible. Tout ça a été réglé **une fois** dans le composant. Toute page qui l'utilise en hérite.

---

## Étape 10 — Commiter

```bash
git add -A
git status
```

Vérifiez que `apps/web/dist/` n'apparaît **pas** dans la liste : le `.gitignore` du tuto 1 l'exclut. On ne versionne jamais un dossier généré.

```bash
git commit -m "feat(web): première page qui consomme @ds/ui"
git push
```

---

## Pour aller plus loin : un deuxième projet en 2 minutes

C'est la démonstration complète de l'intérêt du monorepo. Imaginez que l'école vous demande un deuxième site, pour un autre campus.

```bash
cp -r apps/web apps/campus-lyon
rm -rf apps/campus-lyon/dist
```

Dans `apps/campus-lyon/package.json`, changez **à la main** le nom : `"name": "@ds/campus-lyon"`. Deux paquets ne peuvent pas porter le même nom.

```bash
npm install
npm run dev -w @ds/campus-lyon
```

Vite voit que le port 5173 est déjà pris et ouvre le deuxième site sur un autre port (5174, en général). **Deux applications, une seule bibliothèque.** Refaites le test du token de l'étape 7 : les deux sites et Storybook changent ensemble.

```bash
npm ls --workspaces --depth=0
```

L'arbre montre maintenant `@ds/web` et `@ds/campus-lyon`, qui dépendent tous les deux de `@ds/ui`.

Supprimez ensuite cette copie (`rm -rf apps/campus-lyon` puis `npm install`) si vous ne voulez pas la garder.

---

## Récapitulatif : votre monorepo complet

```
design-system/
├── package.json              ← workspaces + raccourcis storybook et dev
├── packages/
│   ├── tokens/               ← @ds/tokens : les variables
│   └── ui/                   ← @ds/ui : les composants + Storybook
│       ├── .storybook/
│       └── src/
│           ├── index.js
│           └── button/
└── apps/
    └── web/                  ← @ds/web : votre projet
        ├── package.json      ← dépend de @ds/tokens et @ds/ui
        ├── index.html
        ├── style.css         ← mise en page, uniquement avec des tokens
        └── main.js           ← importe depuis @ds/ui
```

| Commande, depuis la racine | Ce qu'elle fait |
| --- | --- |
| `npm run storybook` | Ouvre la bibliothèque de composants |
| `npm run dev` | Ouvre votre page |
| `npm run build -w @ds/web` | Prépare la page pour la mise en ligne et affiche son poids |

### Checklist de fin de séance

- [ ] `npm run dev` affiche la page avec le Button importé depuis `@ds/ui`
- [ ] Aucun fichier de composant n'a été copié dans `apps/web`
- [ ] La page est utilisable au clavier, avec un focus visible
- [ ] Modifier un token met à jour Storybook **et** la page
- [ ] Le poids de la page est noté dans `DECISIONS.md`
- [ ] Le travail est commité et poussé

---

## En cas de problème

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `Missing script: "dev"` | Le raccourci racine n'est pas créé | Refaire l'étape 6 depuis la racine |
| `Failed to resolve import "@ds/ui"` | `npm install` pas relancé après la création de `apps/web/package.json` | `npm install` depuis la racine |
| La page est blanche | Erreur JavaScript | Ouvrir la console du navigateur (`F12`) et lire le message en rouge |
| `createButton is not exported` ou `does not provide an export named` | Le composant n'est pas exporté dans la porte d'entrée | Vérifier `packages/ui/src/index.js` |
| Les boutons s'affichent sans couleurs | Les tokens ne sont pas importés | `import '@ds/tokens';` en **première** ligne de `main.js` |
| Le texte de la page n'a pas le bon style, mais les boutons oui | `style.css` n'est pas importé | Vérifier `import './style.css';` |
| Le formulaire recharge la page au clic | `preventDefault()` oublié | Vérifier le `addEventListener('submit', …)` de l'étape 9 |
| `npm error` en ajoutant `apps/campus-lyon` | Les deux projets portent le même nom | Changer `"name"` dans `apps/campus-lyon/package.json` |
| `Port 5173 is in use` | Une autre page tourne déjà | Vite prend normalement le port suivant tout seul, sinon fermer l'autre terminal |

---

**Suite : faire vivre le design system — versioning, breaking change et gouvernance.**
