import './card.css';
import { createButton } from '../button/button.js';

/**
 * Crée une Card.
 * Ordre du HTML = ordre de lecture (titre d'abord). L'ordre VISUEL
 * est décidé par la grille CSS, pas par le HTML.
 */
export function createCard({
  title = 'Titre de la carte',
  href = '#',
  headingLevel = 3,
  tag,
  text,
  meta,
  image, // { src, alt = '' }
  actionLabel,
  onAction,
} = {}) {
  const card = document.createElement('article');
  card.className = 'card';

  const inner = document.createElement('div');
  inner.className = 'card__inner';
  card.append(inner);

  // En-tête : titre puis étiquette (remontée visuellement par le CSS)
  const header = document.createElement('header');
  header.className = 'card__header';

  const heading = document.createElement(`h${headingLevel}`);
  heading.className = 'card__title';
  const link = document.createElement('a');
  link.className = 'card__link';
  link.href = href;
  link.textContent = title;
  heading.append(link);
  header.append(heading);

  if (tag) {
    const tagEl = document.createElement('p');
    tagEl.className = 'card__tag';
    tagEl.textContent = tag;
    header.append(tagEl);
  }
  inner.append(header);

  if (image?.src) {
    const figure = document.createElement('figure');
    figure.className = 'card__media';
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt ?? ''; // décorative par défaut : le titre dit déjà tout
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 640;
    img.height = 360;
    figure.append(img);
    inner.append(figure);
  }

  if (text) {
    const p = document.createElement('p');
    p.className = 'card__text';
    p.textContent = text;
    inner.append(p);
  }

  if (meta || actionLabel) {
    const footer = document.createElement('footer');
    footer.className = 'card__footer';
    if (meta) {
      const metaEl = document.createElement('p');
      metaEl.className = 'card__meta';
      metaEl.textContent = meta;
      footer.append(metaEl);
    }
    if (actionLabel) {
      footer.append(createButton({ label: actionLabel, variant: 'secondary', onClick: onAction }));
    }
    inner.append(footer);
  }

  return card;
}
