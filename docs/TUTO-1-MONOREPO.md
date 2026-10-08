# Tuto 1 — Passer son dépôt en monorepo

**Durée :** 20 à 30 minutes
**Point de départ :** votre dépôt de la séance 1 (tokens, bouton, docs)
**Point d'arrivée :** un dépôt organisé en paquets, prêt à accueillir Storybook et votre projet

---

## Ce qu'on va faire, et pourquoi

Aujourd'hui, votre dépôt mélange tout au même niveau : les tokens, le bouton, la page de spécimen. Ça marche pour un projet. Mais le jour où un deuxième projet veut utiliser votre bouton, la seule solution est de le copier-coller. Et chaque copie devra être corrigée séparément.

Un **monorepo**, c'est un seul dépôt Git qui contient plusieurs **paquets** indépendants. Chaque paquet a un nom, comme un paquet qu'on installerait depuis internet. Les projets les importent par ce nom au lieu de copier leurs fichiers.

On va ranger le dépôt en trois paquets :

| Paquet | Dossier | Rôle |
| --- | --- | --- |
| `@ds/tokens` | `packages/tokens/` | Les variables CSS : couleurs, espacements, typo. La matière première |
| `@ds/ui` | `packages/ui/` | Les composants (Button, TextField…), construits avec les tokens |
| `@ds/web` | `apps/web/` | Votre projet de fin d'année, qui utilise les composants |

Le `@ds` devant, c'est un nom de famille commun (`ds` pour *design system*). Il permet de reconnaître tout ce qui vient de votre design system.

**La règle d'or :** les imports ne vont que dans un sens.

```
apps/web  ──importe──▶  @ds/ui  ──importe──▶  @ds/tokens
```

Un token ne sait pas qu'un bouton existe. Un bouton ne sait pas dans quelle application il sera utilisé. Jamais l'inverse.

On n'installe aucun outil pour ça : **npm sait déjà gérer un monorepo**, grâce à une fonctionnalité qui s'appelle les *workspaces*.

---

## Étape 0 — Vérifier son poste

Ouvrez un terminal **à la racine de votre dépôt** (le dossier qui contient `README.md` et `tokens/`).

> **Sous Windows :** utilisez **Git Bash**, pas PowerShell. Certaines commandes du tuto (`mkdir -p`, `ls -la`) n'existent pas sous PowerShell.

```bash
node -v
```

**Ce que vous devez voir :** `v22.x.x` (une version 20 récente peut aussi fonctionner). Si la commande n'est pas reconnue ou si la version est plus ancienne, installez Node 22 depuis [nodejs.org](https://nodejs.org).

```bash
git status
```

**Ce que vous devez voir :** `nothing to commit, working tree clean`. Si vous avez des modifications en cours, commitez-les d'abord :

```bash
git add -A
git commit -m "fin de la séance 1"
```

---

## Étape 1 — Travailler sur une branche

```bash
git checkout -b seance-2
```

**Pourquoi :** on va déplacer beaucoup de fichiers. Sur une branche, votre version de la séance 1 reste intacte sur `main`. Si quelque chose tourne mal, vous pouvez toujours revenir en arrière avec `git checkout main`.

---

## Étape 2 — Créer les dossiers

```bash
mkdir -p packages/tokens packages/ui/src/button apps/web
```

**Pourquoi `-p` :** cette option crée les dossiers parents s'ils n'existent pas encore. Une seule commande suffit au lieu de cinq.

---

## Étape 3 — Déplacer les fichiers existants

```bash
git mv tokens/primitives.css tokens/semantic.css tokens/foundations.css packages/tokens/
git mv components/button.css packages/ui/src/button/
```

**Pourquoi `git mv` et pas un glisser-déposer :** `git mv` dit à Git que le fichier a été *déplacé*, pas supprimé puis recréé. Vous gardez tout l'historique de vos modifications.

> Si vos fichiers ne portent pas exactement ces noms, adaptez la commande. Le principe : tout ce qui était dans `tokens/` va dans `packages/tokens/`, tout ce qui était dans `components/` va dans `packages/ui/src/<nom-du-composant>/`.

Les anciens dossiers sont maintenant vides. On les supprime :

```bash
rmdir tokens components
```

L'ancien `index.html` (la page spécimen de la séance 1) pointait vers `tokens/…`, qui n'existe plus. Storybook va le remplacer, on le supprime :

```bash
git rm index.html
```

**Ce que vous devez voir :** `ls` à la racine affiche maintenant `apps`, `docs`, `packages`, `DECISIONS.md`, `README.md`. Plus de `tokens/` ni de `components/`.

---

## Étape 4 — Le paquet `@ds/tokens`

### 4.1 — Un point d'entrée unique

Créez le fichier `packages/tokens/index.css` :

```css
@import "./primitives.css";
@import "./semantic.css";
@import "./foundations.css";
```

**Pourquoi :** celui qui utilise vos tokens n'a pas à savoir qu'il y a trois fichiers. Il importe le paquet, et `index.css` charge tout dans le bon ordre : d'abord les primitives, puis les sémantiques qui s'appuient dessus.

### 4.2 — La carte d'identité du paquet

Créez le fichier `packages/tokens/package.json` :

```json
{
  "name": "@ds/tokens",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./index.css",
    "./*": "./*"
  }
}
```

Ligne par ligne :

| Champ | Ce qu'il veut dire |
| --- | --- |
| `name` | Le nom sous lequel on importera ce paquet : `import '@ds/tokens'` |
| `version` | La version actuelle. On en reparlera dans la partie gouvernance |
| `type: module` | On utilise la syntaxe moderne `import` / `export` |
| `exports` `"."` | Ce qu'on reçoit quand on importe `@ds/tokens` tout court : `index.css` |
| `exports` `"./*"` | Autorise aussi à importer un fichier précis, par exemple `@ds/tokens/semantic.css` |

---

## Étape 5 — Le paquet `@ds/ui`

### 5.1 — La carte d'identité

Créez le fichier `packages/ui/package.json` :

```json
{
  "name": "@ds/ui",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./src/index.js"
  },
  "dependencies": {
    "@ds/tokens": "0.1.0"
  }
}
```

**Le point important, c'est `dependencies`** : on écrit noir sur blanc que l'UI a besoin des tokens. C'est la flèche `@ds/ui ──▶ @ds/tokens` de la règle d'or, mais dans le code.

### 5.2 — La porte d'entrée de la bibliothèque

Créez le fichier `packages/ui/src/index.js` :

```js
// Porte d'entrée de la bibliothèque : chaque composant sera exporté ici (tuto 2).
export {};
```

**Pourquoi un fichier presque vide :** le `package.json` annonce que `@ds/ui` commence par `src/index.js`. On crée la porte maintenant ; on y fera passer le Button au tuto 2.

---

## Étape 6 — Réserver la place du projet

Le dossier `apps/web` accueillera votre projet au tuto 4. Git ne versionne pas les dossiers vides, donc on y met un fichier vide pour qu'il soit conservé :

```bash
touch apps/web/.gitkeep
```

---

## Étape 7 — Le `package.json` racine

C'est **le fichier qui transforme le dépôt en monorepo**. Créez `package.json` à la racine :

```json
{
  "name": "design-system",
  "private": true,
  "type": "module",
  "workspaces": ["packages/*", "apps/*"]
}
```

| Champ | Ce qu'il veut dire |
| --- | --- |
| `private: true` | Ce dossier racine n'est pas un paquet à publier, c'est juste le conteneur |
| `workspaces` | « Les paquets de ce dépôt sont dans `packages/` et dans `apps/` ». npm va les chercher là et les relier entre eux |

Mettez aussi à jour le `.gitignore` à la racine :

```
node_modules/
storybook-static/
dist/
.DS_Store
```

**Pourquoi :** `node_modules/` contient des milliers de fichiers téléchargés, qu'on ne versionne jamais. `storybook-static/` et `dist/` seront générés plus tard par Storybook et par Vite.

---

## Étape 8 — Relier les paquets avec `npm install`

Toujours **depuis la racine** :

```bash
npm install
```

npm lit les workspaces, trouve vos deux paquets, et crée des **raccourcis** vers eux dans `node_modules`.

### Vérification 1 : les raccourcis existent

```bash
ls -la node_modules/@ds
```

**Ce que vous devez voir :**

```
tokens -> ../../packages/tokens
ui -> ../../packages/ui
```

La flèche `->` signifie « ceci est un raccourci vers ». **Ce n'est pas une copie.** Quand vous modifiez `packages/ui`, tout projet qui importe `@ds/ui` voit la modification immédiatement. C'est tout l'intérêt.

### Vérification 2 : npm comprend les dépendances

```bash
npm ls --workspaces
```

**Ce que vous devez voir :**

```
design-system@
+-- @ds/tokens@0.1.0 -> ./packages/tokens
`-- @ds/ui@0.1.0 -> ./packages/ui
  `-- @ds/tokens@0.1.0 deduped -> ./packages/tokens
```

Lisez la dernière ligne : `@ds/ui` dépend de `@ds/tokens`. npm a compris la règle d'or.

### Vérification 3 : les noms se résolvent

```bash
node --input-type=module -e "console.log(import.meta.resolve('@ds/tokens')); console.log(import.meta.resolve('@ds/ui'))"
```

**Ce que vous devez voir :** deux chemins qui finissent par `packages/tokens/index.css` et `packages/ui/src/index.js`. Quand un fichier écrira `import '@ds/tokens'`, c'est exactement là qu'il arrivera.

---

## Étape 9 — Commiter et pousser

```bash
git add -A
git status
```

Vérifiez la liste : les fichiers déplacés doivent apparaître avec un `R` (*renamed*), pas comme supprimés puis ajoutés. C'est `git mv` qui a fait ça.

Le fichier `package-lock.json` apparaît aussi : il est **à commiter**. Il garantit que tout le monde installe exactement les mêmes versions.

```bash
git commit -m "chore: passage en monorepo (workspaces npm)"
git push -u origin seance-2
```

---

## Récapitulatif : votre dépôt maintenant

```
design-system/
├── package.json              ← déclare les workspaces
├── package-lock.json
├── .gitignore
├── README.md
├── DECISIONS.md
├── docs/                     ← inchangé : fiche projet, wireframes, inventaire
├── packages/
│   ├── tokens/               ← @ds/tokens
│   │   ├── package.json
│   │   ├── index.css
│   │   ├── primitives.css
│   │   ├── semantic.css
│   │   └── foundations.css
│   └── ui/                   ← @ds/ui
│       ├── package.json
│       └── src/
│           ├── index.js
│           └── button/
│               └── button.css
└── apps/
    └── web/                  ← votre projet (tuto 4)
        └── .gitkeep
```

### Checklist avant de passer au tuto 2

- [ ] `node_modules/@ds` contient `tokens` et `ui`, en raccourcis
- [ ] `npm ls --workspaces` montre que `@ds/ui` dépend de `@ds/tokens`
- [ ] Plus de dossier `tokens/` ni `components/` à la racine
- [ ] `button.css` ne contient toujours aucune primitive ni couleur en dur (la règle de la séance 1)
- [ ] La branche `seance-2` est poussée sur GitHub

---

## En cas de problème

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `node: command not found` | Node n'est pas installé | Installer Node 22 depuis nodejs.org, puis rouvrir le terminal |
| `mkdir: invalid option -- 'p'` ou commande inconnue | Vous êtes sous PowerShell | Ouvrir Git Bash |
| `fatal: not under version control` sur `git mv` | Le fichier n'a jamais été commité, ou le nom est différent | `git status` pour voir les vrais noms, ou `mv` simple puis `git add -A` |
| `rmdir: failed to remove 'tokens': Directory not empty` | Il reste un fichier dans l'ancien dossier | `ls tokens` pour le trouver et le déplacer aussi |
| `node_modules/@ds` n'existe pas | Le `package.json` racine n'a pas de `workspaces`, ou `npm install` a été lancé ailleurs | Vérifier le fichier, revenir à la racine, relancer `npm install` |
| Un `node_modules` est apparu dans `packages/ui` | `npm install` lancé depuis le sous-dossier | Le supprimer (`rm -rf packages/ui/node_modules`) et toujours lancer npm depuis la racine |
| `npm error code EJSONPARSE` | Une virgule en trop ou manquante dans un `package.json` | Relire le fichier indiqué dans l'erreur : pas de virgule après le dernier élément |

---

## Pour aller plus loin

En entreprise, les gros monorepos ajoutent souvent un outil par-dessus npm : **pnpm**, **Turborepo** ou **Nx**. Ils accélèrent les installations et les builds quand il y a des dizaines de paquets. Le principe reste exactement celui que vous venez de mettre en place : des paquets nommés, déclarés comme workspaces, reliés par des raccourcis.

**Suite : Tuto 2 — Installer Storybook et écrire sa première story.**
