# Exercice 3 — Finir le Button, créer le TextField

**Durée :** 1 heure, en autonomie
**Point de départ :** la fin du tuto 2 (Storybook affiche votre Button dans trois stories)
**Ce que vous rendez :** deux composants terminés dans `@ds/ui`, chacun avec ses stories, zéro violation d'accessibilité, et aucune primitive dans leur CSS

Pas de code fourni ici : à chaque étape, des **questions à vous poser** et des **pistes**. La correction sera partagée à la fin de l'exercice.

---

## Les trois règles qui valent pour tout l'exercice

1. **Un composant ne consomme que des tokens sémantiques.** Jamais de couleur en dur (`#2952cc`, `rgb(…)`), jamais de primitive (`--color-brand-600`).
2. **S'il vous manque un token, vous le créez.** D'abord la primitive dans `primitives.css` si la valeur n'existe pas encore, puis le token sémantique dans `semantic.css`. Vous ne l'écrivez jamais en dur dans le composant.
3. **Un composant est terminé quand il est terminé dans Storybook :** une story par état, zéro violation dans le panneau Accessibility, et testé au clavier.

Laissez Storybook ouvert pendant tout l'exercice (`npm run storybook`) : chaque enregistrement se voit en direct.

---

## Partie A — Finir le Button (25 min)

Votre fichier `packages/ui/src/button/button.css` existe depuis la séance 1. Il s'agit maintenant de couvrir **tous ses états**.

### A1 — Lister les états avant de coder

Prenez une minute, sur papier ou dans un commentaire en haut du fichier.

> **À vous poser :** dans quelles situations un utilisateur peut-il voir ce bouton ? Avec une souris ? Au clavier ? Quand il ne peut pas encore cliquer ?

Vous devriez trouver au moins cinq situations. Deux d'entre elles sont des **variantes** (le bouton a un autre rôle), les autres sont des **états** (le même bouton, à un autre moment).

### A2 — Préparer des variables propres au composant

> **À vous poser :** si la couleur de fond change au survol, puis encore pour la variante secondaire, combien de fois allez-vous réécrire `background`, `border-color` et `color` ?

**Piste :** en haut de `.button`, déclarez quelques variables **locales au composant** (par exemple `--button-bg`, `--button-fg`) qui pointent vers des tokens sémantiques. Le reste du CSS n'utilise que ces variables. Ensuite, un état ou une variante n'a plus qu'à **changer la valeur d'une variable**, pas à réécrire les propriétés.

### A3 — Le survol

> **À vous poser :** quelle couleur au survol ? Existe-t-elle déjà comme token sémantique ?

**Pistes :**

- Si le token n'existe pas, créez-le (règle 2). Son nom doit dire **à quoi il sert**, pas de quelle couleur il est.
- Un bouton désactivé ne doit pas réagir au survol. Cherchez comment cibler « survolé **et pas** désactivé » en CSS.

### A4 — Le focus clavier

C'est l'état le plus important pour l'accessibilité.

> **À vous poser :** quelle est la différence entre `:focus` et `:focus-visible` ? Lequel affiche le contour seulement quand on navigue au clavier ?

**Pistes :**

- Ne supprimez **jamais** le contour (`outline: none`) sans le remplacer par quelque chose de mieux.
- L'épaisseur et la couleur du contour viennent de tokens : vous les avez créés en séance 1 (`foundations.css`, `semantic.css`).
- Le RGAA demande un contraste d'au moins **3:1** entre le contour et ce qui l'entoure.

### A5 — La variante secondaire

> **À vous poser :** qu'est-ce qui change visuellement entre primaire et secondaire ? Le fond ? Le texte ? La bordure ?

**Pistes :**

- Regardez dans `button.js` quelle classe la fonction ajoute quand `variant` vaut `secondary`. C'est cette classe qu'il faut cibler.
- Grâce à l'étape A2, la variante devrait tenir en deux ou trois lignes.
- Vérifiez le contraste du texte sur le fond de la page, pas sur le fond du bouton : il n'y en a plus.

### A6 — L'état désactivé

> **À vous poser :** comment l'utilisateur comprend-il qu'il ne peut pas cliquer ? Par la couleur seulement ? Par le curseur ?

**Piste :** le sélecteur CSS qui correspond à l'attribut `disabled` existe tout fait. Pas besoin d'ajouter une classe.

### A7 — Deux détails qui font la différence

- **La taille de la zone cliquable.** Sur mobile, un doigt n'est pas une souris. Le minimum exigé est de 24 × 24 px, la recommandation est de **44 px de haut**. Quelle propriété garantit une hauteur minimale, quel que soit le texte ?
- **Les animations.** Si vous ajoutez une transition, sa durée doit venir d'un token. Vérifiez dans `foundations.css` : ce token passe-t-il à `0` quand l'utilisateur a demandé de réduire les animations dans son système ?

### Vérifications de la partie A

- [ ] Une story par variante et par état : Primary, Secondary, Disabled
- [ ] Le survol change la couleur, sauf sur le bouton désactivé
- [ ] `Tab` dans le canvas : le contour de focus est bien visible, sur les deux variantes
- [ ] Panneau Accessibility : zéro violation sur chaque story
- [ ] Aucune primitive ni couleur en dur. Vérifiez avec ces deux commandes, qui ne doivent **rien** afficher :

```bash
grep -oE -- "--[a-z0-9-]+" packages/tokens/primitives.css | sort -u | grep -Ff - packages/ui/src/button/button.css
grep -nE "#[0-9a-fA-F]{3,8}\b|rgb|hsl" packages/ui/src/button/button.css
```

La première cherche dans votre bouton chacun des noms déclarés dans `primitives.css`. La seconde cherche les couleurs écrites en dur.

---

## Partie B — Créer le TextField (35 min)

Un champ de formulaire : un libellé, une zone de saisie, et un message quand la saisie est incorrecte. C'est le composant où l'accessibilité compte le plus : un formulaire mal fait bloque complètement un utilisateur de lecteur d'écran.

### B1 — Dessiner l'anatomie avant de coder

Sur papier ou dans Excalidraw, dessinez le composant et nommez chaque morceau.

> **À vous poser :** de quelles parties est fait un champ de formulaire ? Lesquelles sont toujours là, lesquelles apparaissent seulement dans certains cas ?

Puis listez ses états, comme pour le Button. Vous devriez en trouver au moins trois.

### B2 — Le HTML que vous voulez obtenir

Avant d'écrire la fonction, écrivez le HTML final **à la main**, en commentaire ou sur papier. Quatre questions à résoudre :

1. **Relier le libellé et le champ.** Comment le navigateur sait-il que ce texte est le libellé de ce champ ? *Test :* cliquer sur le libellé doit placer le curseur dans le champ.
2. **Des identifiants uniques.** Si la page contient trois TextField, leurs `id` doivent être différents. Comment la fonction peut-elle générer un `id` différent à chaque appel ? *Piste :* une variable déclarée en dehors de la fonction, qui augmente à chaque appel.
3. **Annoncer l'erreur.** Un utilisateur de lecteur d'écran ne voit pas le texte rouge sous le champ. Quels attributs ARIA permettent de dire « ce champ est invalide » et « voici le message qui l'explique » ? *Piste :* l'un des deux attributs pointe vers l'`id` du message.
4. **Le champ obligatoire.** Un astérisque rouge seul suffit-il ? Pour qui n'est-il pas compréhensible ?

> **Rappel RGAA :** une information ne doit jamais être donnée uniquement par la couleur. Et un bon message d'erreur dit **comment corriger**, pas seulement qu'il y a une erreur.

### B3 — Choisir les options du composant

> **À vous poser :** qu'est-ce qui change d'un champ à l'autre sur une page ? Qu'est-ce que la personne qui utilise votre composant doit pouvoir régler ?

**Piste :** quatre options suffisent pour commencer. Donnez à chacune une valeur par défaut raisonnable, comme dans `createButton`.

### B4 — Écrire la fonction `createTextField`

Créez le dossier `packages/ui/src/text-field/` et le fichier `text-field.js`.

**Pistes :**

- Inspirez-vous de la structure de `createButton` : importer son CSS, recevoir des options, fabriquer un élément, le **renvoyer**.
- Cette fois, le composant contient plusieurs éléments. Il faut donc un élément qui les englobe tous.
- Deux façons de fabriquer l'intérieur : `document.createElement` élément par élément, ou un gabarit avec `innerHTML` et des backticks. Les deux sont acceptables ici.
- Le message d'erreur et les attributs ARIA ne doivent apparaître **que** s'il y a une erreur.

### B5 — Le CSS

Créez `text-field.css` dans le même dossier.

**Pistes :**

- Nommez les classes en BEM, comme le Button : un bloc, des éléments (`__`), une variante d'état (`--`).
- Le libellé est **au-dessus** du champ, toujours visible. Pas de libellé qui disparaît dans le champ quand on commence à taper.
- Le focus du champ doit ressembler à celui du bouton. Quels tokens pouvez-vous réutiliser tels quels ?
- La bordure du champ doit avoir un contraste d'au moins **3:1** avec le fond, sinon on ne voit pas où cliquer.
- L'état d'erreur a besoin d'une couleur « danger ». Elle n'existe sans doute pas encore dans vos tokens : règle 2.
- Même hauteur minimale de 44 px que le bouton.

### B6 — Les stories

Créez `text-field.stories.js` sur le modèle de `button.stories.js`.

> **À vous poser :** quels états voulez-vous pouvoir montrer à quelqu'un qui découvre le composant ?

**Piste :** au minimum, une story par défaut et une story avec une erreur. Pour l'erreur, écrivez un vrai message utile, pas « Erreur ».

### B7 — Ouvrir la porte

> **À vous poser :** pourquoi votre page `apps/web` ne pourra-t-elle pas utiliser `createTextField` pour l'instant ?

**Piste :** relisez l'étape 4 du tuto 2.

### Vérifications de la partie B

- [ ] Le TextField apparaît dans Storybook, sous `Composants/TextField`
- [ ] Cliquer sur le libellé place le curseur dans le champ
- [ ] Dans la story avec erreur, inspectez le HTML (clic droit puis « Inspecter ») : l'attribut qui pointe vers le message correspond bien à l'`id` du message
- [ ] Le caractère obligatoire est compréhensible sans voir les couleurs
- [ ] `Tab` : le focus est visible dans le champ
- [ ] Panneau Accessibility : zéro violation sur chaque story
- [ ] Les deux commandes de vérification de la partie A ne trouvent rien dans `text-field.css`
- [ ] `createTextField` est exporté dans `packages/ui/src/index.js`

---

## Les pièges que vous allez probablement rencontrer

Ils arrivent à tout le monde. Si ça bloque, vérifiez d'abord cette liste avant d'appeler.

| Ce que vous voyez | Ce qu'il faut vérifier |
| --- | --- |
| La story est vide | La fonction renvoie-t-elle bien l'élément ? |
| Le composant n'a pas de style | Le CSS est-il importé en haut du fichier `.js` ? |
| La couleur ne s'applique pas | Le token existe-t-il vraiment ? Une faute de frappe dans un nom de variable ne produit aucune erreur, juste rien |
| Cliquer sur le libellé ne fait rien | L'attribut du libellé et l'`id` du champ sont-ils exactement identiques ? |
| Deux champs se « partagent » le même libellé | Les `id` sont-ils vraiment différents à chaque appel ? |
| Le menu Storybook n'affiche pas le TextField | Le fichier finit-il bien par `.stories.js` ? |
| Le survol du bouton désactivé change quand même la couleur | Le sélecteur de survol exclut-il l'état désactivé ? |

---

## Bonus, si vous avez fini en avance

- **Une variante `danger` du Button**, pour les actions destructrices (« Supprimer mon compte »). Quel token sémantique créer ? Quel est son nom ?
- **Un état désactivé du TextField.** Quel attribut HTML ? Quelle story ?
- **Un texte d'aide** sous le champ, toujours visible (« 8 caractères minimum »). Comment le relier au champ pour qu'il soit lu par un lecteur d'écran, en même temps que l'éventuel message d'erreur ?
- **Un troisième composant de votre top 5**, en suivant exactement les mêmes étapes : lister les états, dessiner l'anatomie, écrire le HTML voulu, puis la fonction, le CSS, les stories, l'export.

---

## Avant de commiter

```bash
git add -A
git commit -m "feat(ui): Button complet et TextField"
git push
```

La correction sera partagée à la fin de l'exercice. Comparez-la avec votre version : il y a souvent plusieurs bonnes réponses, l'important est de savoir **justifier** vos choix.
