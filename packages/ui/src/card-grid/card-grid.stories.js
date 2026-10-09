import { createCardGrid } from './card-grid.js';
import { createCard } from '../card/card.js';
import placeholder from '../card/placeholder.svg';

const ateliers = [
  { tag: 'Mobilité', title: 'Atelier vélo solidaire', text: 'Outils prêtés, pièces d’occasion, café offert.', meta: '12 places' },
  { tag: 'Numérique', title: 'Initiation au numérique pour les seniors du quartier', text: 'Envoyer un mail, faire une visio avec ses petits-enfants, éviter les arnaques en ligne.', meta: '8 places' },
  { tag: 'Alimentation', title: 'Cuisine anti-gaspi', text: 'On cuisine les invendus du marché.', meta: 'Complet' },
  { tag: 'Culture', title: 'Bibliothèque de rue', text: 'Déposez un livre, prenez-en un. Tous les dimanches matin devant la mairie.', meta: 'Accès libre' },
  { tag: 'Emploi', title: 'Relecture de CV par des pros du recrutement', text: 'Trente minutes en tête-à-tête.', meta: '5 places' },
  { tag: 'Nature', title: 'Jardin partagé', text: 'Semis d’automne et compost.', meta: '20 places' },
];

export default {
  title: 'Composants/CardGrid',
  argTypes: {
    largeur: { control: { type: 'range', min: 16, max: 80, step: 1 }, name: 'largeur (rem)' },
    aligned: { control: 'boolean', name: 'alignée (subgrid)' },
  },
  args: { largeur: 70, aligned: false },
  render: ({ largeur, aligned }) => {
    const piece = document.createElement('div');
    piece.style.cssText = `width: ${largeur}rem; max-width: 100%;`;
    const cards = ateliers.map((props) =>
      createCard({ ...props, href: '#', actionLabel: 'S’inscrire', image: { src: placeholder, alt: '' } }),
    );
    piece.append(createCardGrid(cards, { label: 'Ateliers du mois', aligned }));
    return piece;
  },
};

export const Grille = {};
export const Alignee = { name: 'Alignée', args: { aligned: true } };
