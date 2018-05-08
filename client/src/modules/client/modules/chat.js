import { div, formWindow } from '../../dom';
import { ACTION } from '../../../../../shared';

class Chat {
  constructor(onEvent) {
    this.onEvent = onEvent;
    this.limit = 12;
    this.fadeFrom = 9;
    this.active = false;
    this.name = '';

    // doc elements
    this.el = {};
    this.el.list = document.querySelector('.chat-list');
    this.el.form = document.querySelector('#chat-form');
    this.el.input = document.querySelector('.chat-input__input');

    // create name picker window
    this.el.nameForm = formWindow('Choose a display name:', (e) => {
      e.preventDefault();
      this.submitName();
    });
    this.el.nameFormInput = this.el.nameForm.querySelector('input');
    this.el.nameFormInput.onblur = () => { this.enableInput(); };
    this.el.nameFormInput.onfocus = () => { this.disableInput(); };
    document.body.appendChild(this.el.nameForm);

    // events
    this.el.form.onsubmit = (e) => {
      e.preventDefault();
      this.submit();
    };
    this.el.input.onblur = () => { this.enableInput(); }
    this.el.input.onfocus = () => { this.disableInput(); }
  }

  printMessage(from, message) {
    this.el.list.appendChild(
      div({
        className: 'chat-list__item',
        innerHTML: `<span class='bold'>${from}</span> ${message}`
      })
    );
    this.limitChat();
  }

  printNotice(message) {
    this.el.list.appendChild(
      div({
        className: 'chat-list__item',
        innerHTML: `<span class='error'>${message}</span>`
      })
    );
    this.limitChat();
  }

  submitName() {
    var name = this.el.nameForm.getElementsByTagName('input')[0].value;

    if (name.length == 0) {
      var target = this.el.nameForm.querySelector('.form-window__notice');
      target.innerHTML = '<br />Input is empty.'
    } else {
      this.onEvent(ACTION.SET_NAME, name);
    }
  }

  setName(name) {
    this.active = true;
    this.name = name;
    document.body.removeChild(this.el.nameForm);
  }

  disableInput() {
    this.onEvent(ACTION.DISABLE_INPUT, null);
  }

  enableInput() {
    this.onEvent(ACTION.ENABLE_INPUT, null);
  }

  submit() {
    // send input to server
    if (this.el.input.value.length) {
      this.onEvent(ACTION.MESSAGE, this.el.input.value);
      this.el.input.value = '';
    }
  }

  getName() {
    return this.name;
  }

  isActive() {
    return this.active;
  }

  limitChat() {
    // remove excess item
    if (this.el.list.children.length >= this.limit) {
      this.el.list.removeChild(this.el.list.children[0]);
    }

    // fade out
    var j = 0;
    var range = (this.limit + 1) - this.fadeFrom;
    for (var i=this.el.list.children.length, end=-1; i>end; --i) {
      if (++j > this.fadeFrom) {
        this.el.list.children[i].style.opacity = 1 - (j - this.fadeFrom) / range;
      }
    }
  }
}

export { Chat };
