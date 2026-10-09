import '@ds/tokens';
import './style.css';
import { createButton, createTextField } from '@ds/ui';

const form = document.querySelector('#signup');
const email = createTextField({ label: 'Adresse e-mail', type: 'email', required: true });
const submit = createButton({ label: 'Créer un compte' });
submit.type = 'submit';

form.append(email, submit);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Bienvenue !');
});
