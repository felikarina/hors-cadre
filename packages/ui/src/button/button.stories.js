import { createButton } from './button.js';

export default {
  title: 'Composants/Button',
  render: (args) => createButton(args),
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Envoyer', variant: 'primary', disabled: false },
};

export const Primary = {};
export const Secondary = { args: { variant: 'secondary' } };
export const Disabled = { args: { disabled: true } };