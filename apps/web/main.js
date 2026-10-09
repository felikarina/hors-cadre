import '@ds/tokens';
import './style.css';
import { createButton } from '@ds/ui';

const actions = document.querySelector('#actions');

actions.append(
  createButton({ label: 'Créer un compte', onClick: () => alert('Bienvenue !') }),
  createButton({ label: 'En savoir plus', variant: 'secondary' }),
);