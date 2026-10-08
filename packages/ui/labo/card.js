// Le labo utilise la Card exactement comme une vraie page : en l'important depuis @ds/ui
import '@ds/tokens';
import './labo.css';
import { createCard } from '@ds/ui';
import placeholder from '../src/card/placeholder.svg';

// Les props de l'exemple : changez-les pour tester (titre très long, pas de bouton…)
const exemple = {
  title: 'Atelier vélo solidaire du samedi',
  href: '#',
  tag: 'Mobilité',
  text: 'Venez réparer votre vélo avec des bénévoles : outils prêtés, pièces d’occasion, café offert.',
  meta: '12 places · Paris 18e',
  actionLabel: 'S’inscrire',
  image: { src: placeholder, alt: '' },
};

document.querySelector('#piece-18').append(createCard(exemple));
document.querySelector('#piece-38').append(createCard(exemple));
document.querySelector('#piece-38-sans-image').append(createCard({ ...exemple, image: null }));
document.querySelector('#piece-54').append(createCard(exemple));
document.querySelector('#piece-resize').append(createCard(exemple));
