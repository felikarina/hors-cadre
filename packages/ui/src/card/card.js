import './card.css';

/**
 * La Card — à construire à l'étape 1 du tuto 5.
 * Pour l'instant, elle n'affiche que son titre : c'est juste pour vérifier que le labo fonctionne.
 */
export function createCard({ title = 'Titre de la carte' } = {}) {
  const card = document.createElement('article');
  card.className = 'card';
  card.textContent = `Card à construire (étape 1) : ${title}`;
  return card;
}
