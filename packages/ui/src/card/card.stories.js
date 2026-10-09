import { createCard } from './card.js';
import placeholder from './placeholder.svg';

/** Fabrique la Card, avec ou sans image selon le contrôle « avec image » */
const render = ({ withImage, ...props }) =>
  createCard({ ...props, image: withImage ? { src: placeholder, alt: '' } : null });

export default {
  title: 'Composants/Card',
  render,
  argTypes: {
    title: { control: 'text' },
    tag: { control: 'text' },
    text: { control: 'text' },
    meta: { control: 'text' },
    actionLabel: { control: 'text' },
    withImage: { control: 'boolean', name: 'avec image' },
    headingLevel: { control: 'select', options: [2, 3, 4] },
  },
  args: {
    title: 'Atelier vélo solidaire du samedi',
    href: '#',
    tag: 'Mobilité',
    text: 'Venez réparer votre vélo avec des bénévoles : outils prêtés, pièces d’occasion, café offert.',
    meta: '12 places · Paris 18e',
    actionLabel: 'S’inscrire',
    withImage: true,
    headingLevel: 3,
  },
};

export const ParDefaut = { name: 'Par défaut' };

export const SansImage = {
  name: 'Sans image',
  args: { withImage: false },
};

/** Tirez la poignée en bas à droite */
export const Redimensionnable = {
  render: (args) => {
    const piece = document.createElement('div');
    piece.style.cssText =
      'width: 22rem; min-width: 15rem; max-width: 100%; padding: 1rem; border: 2px dashed #9aa3b5; resize: horizontal; overflow: auto;';
    piece.append(render(args));
    return piece;
  },
};

/** La même Card dans trois pièces */
export const TroisLargeurs = {
  name: 'Trois largeurs',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: grid; gap: 2rem;';
    for (const width of ['18rem', '38rem', '54rem']) {
      const piece = document.createElement('div');
      piece.style.cssText = `width: ${width}; max-width: 100%;`;
      const label = document.createElement('p');
      label.textContent = `Pièce de ${width}`;
      label.style.cssText = 'margin: 0 0 .5rem; font: 600 .875rem system-ui;';
      piece.append(label, render(args));
      wrap.append(piece);
    }
    return wrap;
  },
};
