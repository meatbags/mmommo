/*
 * NamePicker
 * -- name picker UI element (window)
 */

import { div } from './div';

class NamePicker {
  constructor(client) {
    // hook name picker to client
    this.client = client;
    this.createWindow();
    this.input = this.form.querySelector('input');
    document.body.appendChild(this.form);
  }

  closeWindow() {
    if (document.body.contains(this.form)) {
      document.body.removeChild(this.form);
    }
  }

  error(msg) {
    this.form.querySelector('.form-window__notice').innerHTML = msg;
  }

  force(name) {
    this.client.setName(name);
    this.closeWindow();
  }

  onForm(e) {
    e.preventDefault();

    if (this.input.value.length) {
      this.client.setName(this.input.value);
      this.closeWindow();
    } else {
      this.error('<br />Input is empty.');
    }
  }

  createWindow() {
    this.form = div({className: 'window form-window'});

    // elements
    const title = 'Choose a display name.';
    const upper = div({className: 'form-window__title', innerHTML: title});
    const form = document.createElement('form');
    const input = document.createElement('input');
    const send = document.createElement('input');
    const notice = div({className: 'form-window__notice'});

    // settings
    form.onsubmit = e => { this.onForm(e); };
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'input');
    input.setAttribute('maxlength', 25);
    send.setAttribute('type', 'submit');
    send.setAttribute('value', 'send');

    // build
    form.appendChild(input);
    form.appendChild(send);
    this.form.appendChild(upper);
    this.form.appendChild(form);
    this.form.appendChild(notice);
  }
}

export { NamePicker };
