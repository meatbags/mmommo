import { div } from './div';
import { Config } from '../../../../shared';

function getColourString(n) {
  var r = n >> 16;
  var g = n >> 8 & 0xff;
  var b = n & 0xff;
  r = ((r < 16) ? '0' : '') + r.toString(16);
  g = ((g < 16) ? '0' : '') + g.toString(16);
  b = ((b < 16) ? '0' : '') + b.toString(16);

  return `#${r}${g}${b}`;
}

function nameWindow(title, onSubmit) {
  // elements
  const wrapper = div({className: 'window form-window'});
  const upper = div({className: 'form-window__title', innerHTML: title});
  const form = document.createElement('form');
  const input = document.createElement('input');
  const send = document.createElement('input');
  const colours = div({className: 'form-window__options'});
  const notice = div({className: 'form-window__notice'});

  // settings
  form.onsubmit = onSubmit;
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'input');
  input.setAttribute('maxlength', 25);
  send.setAttribute('type', 'submit');
  send.setAttribute('value', 'send');

  // add colour picker
  const onOption = (e) => {
    e.currentTarget.classList.toggle('active');
  };

  Object.keys(Config.global.colours).forEach(key => {
    const opt = div({className: 'option'});
    const n = Config.global.colours[key];
    const c = getColourString(n);
    opt.style.background = c;
    opt.onclick = onOption
    opt.dataset.colour = n;
    colours.appendChild(opt);
  });

  // build
  form.appendChild(input);
  form.appendChild(send);
  wrapper.appendChild(upper);
  wrapper.appendChild(form);
  wrapper.appendChild(colours);
  wrapper.appendChild(notice);

  return wrapper;
}

export { nameWindow };
