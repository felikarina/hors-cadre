import './card-grid.css';

/**
 * Range des Cards dans une liste <ul>.
 * Un lecteur d'écran annonce « liste, 6 éléments » : on sait combien de Cards attendent.
 * aligned: true → titres, textes et boutons alignés d'une Card à l'autre (étape 9 du tuto 5).
 */
export function createCardGrid(cards = [], { label = '', aligned = false } = {}) {
  const list = document.createElement('ul');
  list.className = aligned ? 'card-grid card-grid--aligned' : 'card-grid';
  if (label) list.setAttribute('aria-label', label);

  for (const card of cards) {
    const item = document.createElement('li');
    item.append(card);
    list.append(item);
  }
  return list;
}
