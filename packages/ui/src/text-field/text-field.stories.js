import { createTextField } from './text-field.js';

export default {
  title: 'Composants/TextField',
  render: (args) => createTextField(args),
  args: { label: 'Adresse e-mail', type: 'email', required: true, error: '' },
};

export const Default = {};
export const WithError = { args: { error: 'Saisissez une adresse e-mail valide, par exemple nom@domaine.fr' } };
