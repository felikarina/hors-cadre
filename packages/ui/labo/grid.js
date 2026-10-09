import '@ds/tokens';
import './labo.css';
import { createCard, createCardGrid } from '@ds/ui';
import placeholder from '../src/card/placeholder.svg';

// Des titres et des textes de longueurs volontairement inégales
const ateliers = [
  { tag: 'Mobilité', title: 'Atelier vélo solidaire', text: 'Outils prêtés, pièces d’occasion, café offert.', meta: '12 places' },
  { tag: 'Numérique', title: 'Initiation au numérique pour les seniors du quartier', text: 'Envoyer un mail, faire une visio avec ses petits-enfants, éviter les arnaques en ligne.', meta: '8 places' },
  { tag: 'Alimentation', title: 'Cuisine anti-gaspi', text: 'On cuisine les invendus du marché.', meta: 'Complet' },
  { tag: 'Culture', title: 'Bibliothèque de rue', text: 'Déposez un livre, prenez-en un. Tous les dimanches matin devant la mairie.', meta: 'Accès libre' },
  { tag: 'Emploi', title: 'Relecture de CV par des pros du recrutement', text: 'Trente minutes en tête-à-tête.', meta: '5 places' },
  { tag: 'Nature', title: 'Jardin partagé', text: 'Semis d’automne et compost.', meta: '20 places' },
];

const piece = document.querySelector('#piece');
const largeur = document.querySelector('#largeur');
const valeur = document.querySelector('#valeur');
const aligne = document.querySelector('#aligne');

function afficher() {
  piece.style.width = `${largeur.value}rem`;
  valeur.textContent = largeur.value;
  const cards = ateliers.map((atelier) =>
    createCard({ ...atelier, href: '#', actionLabel: 'S’inscrire', image: { src: placeholder, alt: '' } }),
  );
  piece.replaceChildren(createCardGrid(cards, { label: 'Ateliers du mois', aligned: aligne.checked }));
}

largeur.addEventListener('input', afficher);
aligne.addEventListener('change', afficher);
afficher();
