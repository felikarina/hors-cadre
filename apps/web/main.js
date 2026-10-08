import '@ds/tokens';
import { createCard, createCardGrid } from '@ds/ui';
import placeholder from './placeholder.svg';

const atelier = (title, tag, text, meta) => ({
  title, tag, text, meta, href: '#', actionLabel: 'S’inscrire', image: { src: placeholder },
});

const ateliers = [
  atelier('Atelier vélo solidaire', 'Mobilité', 'Outils prêtés, pièces d’occasion, café offert.', '12 places'),
  atelier('Initiation au numérique pour les seniors du quartier', 'Numérique', 'Envoyer un mail, faire une visio, éviter les arnaques.', '8 places'),
  atelier('Cuisine anti-gaspi', 'Alimentation', 'On cuisine les invendus du marché.', 'Complet'),
  atelier('Bibliothèquessss de rue', 'Culture', 'Déposez un livre, prenez-en un. Tous les dimanches.', 'Accès libre'),
];

// La MÊME Card, posée dans trois pièces différentes :
document.querySelector('#une').append(
  createCard(atelier('Grande collecte de vêtements d’hiver', 'Solidarité',
    'Manteaux, bonnets et gants pour les maraudes de décembre. Dépôt au local de l’association.', '6 décembre'),
  ),
);
document.querySelector('#grille').append(createCardGrid(ateliers.map(createCard), { label: 'Tous les ateliers' }));
document.querySelector('#aside').append(createCard({ ...ateliers[0], headingLevel: 3 }));
