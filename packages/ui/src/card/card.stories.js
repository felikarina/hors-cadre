import { createCard } from './card.js';
import placeholder from './placeholder.svg';

const exemple = {
  title: 'Atelier vélo solidaire du samedi',
  href: '#',
  tag: 'Mobilité',
  text: 'Venez réparer votre vélo avec des bénévoles : outils prêtés, pièces d’occasion, café offert.',
  meta: '12 places · Paris 18e',
  actionLabel: 'S’inscrire',
  image: { src: placeholder, alt: '' },
};

/** Enveloppe la Card dans un conteneur de largeur donnée. */
function inContainer(card, width) {
  const box = document.createElement('div');
  box.style.inlineSize = width;
  box.append(card);
  return box;
}

export default {
  title: 'Composants/Card',
  render: ({ withImage, ...args }) =>
    createCard({ ...args, image: withImage ? args.image : undefined }),
  argTypes: {
    title: { control: 'text' },
    tag: { control: 'text' },
    text: { control: 'text' },
    meta: { control: 'text' },
    actionLabel: { control: 'text' },
    withImage: { control: 'boolean', name: 'avec image' },
    headingLevel: { control: { type: 'select' }, options: [2, 3, 4] },
    image: { table: { disable: true } },
  },
  args: { ...exemple, withImage: true, headingLevel: 3 },
};

export const ParDefaut = { name: 'Par défaut' };

export const SansImage = {
  name: 'Sans image (:has)',
  args: { withImage: false },
};

/** LA story de la séance : tirez la poignée en bas à droite. */
export const Redimensionnable = {
  name: 'Redimensionnable (container query)',
  render: (args) => {
    const box = document.createElement('div');
    box.style.cssText =
      'resize: inline; overflow: auto; inline-size: 22rem; min-inline-size: 15rem; max-inline-size: 100%; padding: 1rem; border: 2px dashed #9aa3b5;';
    box.append(createCard({ ...args, image: args.withImage ? args.image : undefined }));
    return box;
  },
};

/** Même Card, même écran, trois pièces différentes. */
export const TroisLargeurs = {
  name: 'Trois largeurs',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: grid; gap: 2rem;';
    for (const w of ['18rem', '38rem', '54rem']) {
      const label = document.createElement('p');
      label.textContent = `Conteneur de ${w}`;
      label.style.cssText = 'margin: 0 0 .5rem; font: 600 .875rem system-ui;';
      const box = inContainer(createCard({ ...args, image: args.withImage ? args.image : undefined }), w);
      box.style.maxInlineSize = '100%';
      box.prepend(label);
      wrap.append(box);
    }
    return wrap;
  },
};
