import { createButton } from '../button/button';
import './card.css';

/**
 * La Card — à construire à l'étape 1 du tuto 5.
 * Pour l'instant, elle n'affiche que son titre : c'est juste pour vérifier que le labo fonctionne.
 */
export function createCard({ 
  title = 'Titre de la carte',
  href = '',
  headingLevel = 3,
  tag = '',
  text = '',
  meta = '',
  image = null, // {src, alt}
  actionLabel = '',
  onAction,
  } = {}) {
  const h = `h${headingLevel}`;
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="card__inner">
      <header class="card__header">
        <${h} class="card__title"><a href="${href}" class="card__link">${title}</a></${h}>
        ${tag ? `<span class="card__tag">${tag}</span>` : ''}
      </header>
      ${image ? `
        <figure class="card__media">
          <img src="${image.src}" alt="${image.alt}">
        </figure>
        ` : '' }
      ${text ? `<p class="card__text">${text}</p>` : ''}
      <footer class="card__footer">
        ${meta ? `<p class="card__meta">${meta}</p>` : ''}
      </footer>
    </div>`;

    if (actionLabel) {
      card.querySelector('.card__footer').append(
        createButton({ label: actionLabel, variant: 'secondary', onClick: onAction })
      );
    }

  return card;
}
