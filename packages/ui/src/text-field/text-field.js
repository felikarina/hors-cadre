import './text-field.css';

let count = 0;

export function createTextField({ label = 'Libellé', type = 'text', required = false, error = '' } = {}) {
  const id = `text-field-${++count}`;
  const wrapper = document.createElement('div');
  wrapper.className = error ? 'text-field text-field--error' : 'text-field';
  wrapper.innerHTML = `
    <label class="text-field__label" for="${id}">${label}${required ? ' (obligatoire)' : ''}</label>
    <input class="text-field__input" id="${id}" type="${type}" ${required ? 'required' : ''}
      ${error ? `aria-invalid="true" aria-describedby="${id}-error"` : ''}>
    ${error ? `<p class="text-field__error" id="${id}-error">${error}</p>` : ''}
  `;
  return wrapper;
}
