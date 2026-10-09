import '@ds/tokens';
import './style.css';
import { createButton, createTextField, createCard, createCardGrid } from '@ds/ui';
import placeholder from './placeholder.svg';

// Fabrique les props d'un atelier
const atelier = (title, tag, text, meta) => ({
  title, tag, text, meta, href: '#', actionLabel: 'S’inscrire', image: { src: placeholder, alt: '' },
});

const ateliers = [
  atelier('Atelier vélo solidaire', 'Mobilité', 'Outils prêtés, pièces d’occasion, café offert.', '12 places'),
  atelier('Initiation au numérique pour les seniors du quartier', 'Numérique', 'Envoyer un mail, faire une visio, éviter les arnaques.', '8 places'),
  atelier('Cuisine anti-gaspi', 'Alimentation', 'On cuisine les invendus du marché.', 'Complet'),
  atelier('Bibliothèque de rue', 'Culture', 'Déposez un livre, prenez-en un. Tous les dimanches.', 'Accès libre'),
];

// La MÊME Card, dans trois pièces de largeurs différentes
document.querySelector('#une').append(
  createCard(atelier('Grande collecte de vêtements d’hiver', 'Solidarité',
    'Manteaux, bonnets et gants pour les maraudes de décembre. Dépôt au local de l’association.', '6 décembre')),
);
document.querySelector('#grille').append(
  createCardGrid(ateliers.map((props) => createCard(props)), { label: 'Tous les ateliers' }),
);
document.querySelector('#proche').append(createCard(ateliers[0]));

// Le formulaire du tuto 4, inchangé
const form = document.querySelector('#signup');
const email = createTextField({ label: 'Adresse e-mail', type: 'email', required: true });
const submit = createButton({ label: 'Créer un compte' });
submit.type = 'submit';
form.append(email, submit);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Bienvenue !');
});
