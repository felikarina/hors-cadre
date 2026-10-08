# Exercice 5 — Enrichir la Card

**Durée :** 35 minutes, en autonomie. **Branche :** `seance-3`.

Pendant la démo, vous avez construit une Card qui change de mise en page selon la place qu'on lui donne. Maintenant, vous la rendez **vraiment utilisable dans votre projet de fin d'année**.

Pour chaque mission, vous avez des questions pour vous guider et une piste. Pas de code à recopier : la correction est dans `CORRECTION-EXERCICE-5.md`, à n'ouvrir qu'à la fin.

**La règle de la séance, toujours valable :** aucune `@media` dans `packages/ui/`. Seule la page (`apps/web`) a le droit d'en écrire.

---

## Mission 1 — Le thème sombre (10 min)

Ouvrez `packages/tokens/semantic.css`. Le bloc `[data-theme="dark"]` est vide depuis la séance 1.

**Les questions à vous poser :**

1. Dans quel fichier écrivez-vous ? Les primitives, les sémantiques, ou le CSS de la Card ?
2. Combien de lignes de `card.css` devez-vous modifier pour que la Card passe en sombre ?
3. Il vous manque peut-être des couleurs foncées (un `brand-900`, un `neutral-950`). Où les ajoutez-vous ?
4. Comment voir le résultat dans Storybook sans recharger à chaque fois ?

**Pistes :**

- Si votre réponse à la question 2 n'est pas « zéro », c'est qu'il reste une couleur en dur ou une primitive dans un composant. Corrigez-la d'abord.
- Dans `.storybook/preview.js`, Storybook accepte des `globalTypes` (un bouton dans la barre d'outils) et des `decorators` (une fonction qui s'exécute avant chaque story). Le décorateur peut poser `data-theme` sur `document.documentElement`.
- Ajoutez `color-scheme: dark;` dans le bloc sombre : les barres de défilement et les champs natifs suivent.

**Fini quand :** la story *Trois largeurs* s'affiche en sombre, et le panneau Accessibility ne signale aucun problème de contraste.

---

## Mission 2 — La variante compacte (10 min)

Pour une barre latérale ou une liste dense, vous voulez une Card plus serrée : moins de marge, coins moins arrondis, titre plus petit.

**Les questions à vous poser :**

1. Quelles **variables locales** la Card expose-t-elle déjà ? (Regardez le haut de `.card` dans `card.css`.)
2. Est-ce qu'une variante a besoin de réécrire des propriétés, ou seulement de changer des variables ?
3. Le titre utilise `clamp(…cqi…)`. Comment laisser une variante le surcharger sans casser la version par défaut ?
4. Comment l'utilisateur de la bibliothèque choisit-il la variante : une classe, un paramètre de `createCard` ?

**Pistes :**

- Une bonne variante tient en 3 ou 4 lignes, et ne contient **que** des variables.
- `var(--ma-variable, valeur-par-défaut)` : la deuxième valeur sert quand la variable n'est pas définie.
- Inspirez-vous de `createButton` : il ajoute une classe `button--secondary` selon le paramètre `variant`.
- Ajoutez une story *Compacte*, et le contrôle `variant` dans `argTypes`.

**Fini quand :** la story *Compacte* existe et la story *Trois largeurs* fonctionne toujours en mode compact (changez le contrôle).

---

## Mission 3 — La Card de VOTRE projet (15 min le matin, puis l'après-midi)

Ouvrez votre fiche projet et vos wireframes. La Card de l'atelier vélo n'est qu'un exemple.

**Les questions à vous poser :**

1. Sur vos wireframes, où une Card apparaît-elle ? Combien de « pièces » de tailles différentes ?
2. Quelles informations contient-elle ? Lesquelles sont obligatoires, lesquelles optionnelles ?
3. Ces seuils de 34rem et 50rem conviennent-ils à **votre** contenu ? À partir de quelle largeur votre texte tient-il à côté de l'image ?
4. Votre Card contient-elle un deuxième élément cliquable ? Passe-t-il bien au-dessus du lien étendu ?
5. Dans votre page, faut-il aligner les Cards d'une rangée (`aligned`), ou les laisser s'adapter seules ? Notez votre choix et sa raison dans `DECISIONS.md`.

**Pistes :**

- Changez les données de la story avant de changer le CSS. Souvent, le contenu réel suffit à révéler les vrais seuils.
- Testez avec un titre très long et un texte très court : c'est là que les mises en page cassent.
- Le test clavier : Tab, combien d'arrêts ? Le contour de focus est-il visible sur toute la carte ?

**Fini quand :** votre page `apps/web` affiche vos propres Cards dans au moins deux pièces de largeur différente.

---

## Mission bonus — Le carrousel (si vous avez fini)

Sur mobile, une rangée de Cards qui défile horizontalement, et chaque carte s'aimante en place.

**Questions :** quelles propriétés de grille faut-il changer pour que tout tienne sur une seule rangée ? Que font `scroll-snap-type` et `scroll-snap-align` ? Une zone qui défile est-elle atteignable au clavier si elle ne contient rien de focusable ?

**Piste :** `grid-auto-flow: column` et `grid-auto-columns`. Et regardez le critère RGAA 7.3.

---

## L'après-midi (14h – 16h) — en autonomie

| Horaire | Quoi |
| --- | --- |
| 14h00 | **Votre contrat.** Une phrase : ce qui sera visible à 16h. Exemple : « Ma page d'accueil affiche mes 3 cartes d'événements dans la grille et une carte à la une. » |
| 14h10 – 15h00 | **Bloc 1 · Finir la mission 3.** Votre Card, vos données, vos seuils, dans au moins deux pièces de `apps/web`. Point rapide avec Koni vers 14h40 |
| 15h00 – 15h30 | Pause |
| 15h30 – 15h50 | **Bloc 2 · Un deuxième composant** de votre inventaire qui vit dans plusieurs pièces (bannière, liste, en-tête de section, formulaire). Même règle : zéro `@media` dans `packages/ui/` |
| 15h50 – 16h00 | **Revue croisée.** Testez la page de l'autre : 3 largeurs, Tab, thème sombre. Chaque problème trouvé = une issue sur son dépôt |

**Bloqué·e sur votre Card ?** Gardez celle de la branche `seance-3` telle quelle, changez seulement les données et les seuils. L'objectif est une Card de votre projet dans votre page, pas une Card réécrite de zéro.

**Fini avant 15h30 ?** Mission bonus, puis le test clavier de votre Card en thème sombre.

---

## Checklist de fin de séance

- [ ] Aucune `@media` dans vos composants : `grep -rn "@media" packages/ui/src --include=*.css` ne renvoie rien (le dossier `src/stories/`, créé par l'installation de Storybook, n'est pas à vous et peut être supprimé)
- [ ] Aucune couleur en dur ni primitive dans `card.css`
- [ ] La story *Trois largeurs* montre 3 mises en page différentes
- [ ] Thème sombre fonctionnel, zéro violation dans le panneau Accessibility
- [ ] Deux arrêts clavier par Card (lien + bouton), focus visible
- [ ] Le choix `aligned` ou non est noté dans `DECISIONS.md`
- [ ] Au moins une issue ouverte sur le dépôt de l'autre (revue croisée)
- [ ] Commit : `git commit -m "seance 3 : card"`
