import './button.css';

export function createButton({ label = 'Bouton', variant = 'primary', disabled = false, onClick } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = ['button', variant !== 'primary' && `button--${variant}`].filter(Boolean).join(' ');
  button.textContent = label;
  button.disabled = disabled;
  if (onClick) button.addEventListener('click', onClick);
  return button;
}