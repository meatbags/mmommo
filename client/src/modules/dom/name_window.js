import { div } from './div';

function nameWindow(title, onSubmit) {
  // elements
  const wrapper = div({className: 'window form-window'});
  const upper = div({className: 'form-window__title', innerHTML: title});
  const form = document.createElement('form');
  const input = document.createElement('input');
  const send = document.createElement('input');
  const notice = div({className: 'form-window__notice'});

  // settings
  form.onsubmit = onSubmit;
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'input');
  input.setAttribute('maxlength', 25);
  send.setAttribute('type', 'submit');
  send.setAttribute('value', 'send');

  // build
  form.appendChild(input);
  form.appendChild(send);
  wrapper.appendChild(upper);
  wrapper.appendChild(form);
  wrapper.appendChild(notice);

  return wrapper;
}

export { nameWindow };
