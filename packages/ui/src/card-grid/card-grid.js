import './card-grid.css';

/**
 * Range des Cards dans une liste (ul/li) : un lecteur d'écran annonce « liste, 6 éléments ».
 * aligned: true → titres, textes et boutons alignés d'une Card à l'autre (subgrid),
 * mais les Cards ne changent plus de mise en page selon leur largeur.
 */
export function createCardGrid(cards = [], { label, aligned = false } = {}) {
  const list = document.createElement('ul');
  list.className = ['card-grid', aligned && 'card-grid--aligned'].filter(Boolean).join(' ');
  if (label) list.setAttribute('aria-label', label);
  for (const card of cards) {
    const item = document.createElement('li');
    item.append(card);
    list.append(item);
  }
  return list;
}
