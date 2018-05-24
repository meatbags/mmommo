/*
 * Console
 * -- console UI element (chat & server messages)
 */

import { div } from './div';

class Console {
  constructor(client) {
    // handle the chat, server notices
    this.client = client;
    this.limit = 12;
    this.fadeFrom = 9;
    this.active = false;

    // doc
    this.el = {};
    this.el.list = document.querySelector('.chat-list__inner');
    this.el.form = document.querySelector('#chat-form');
    this.el.input = document.querySelector('.chat-input__input');

    // events
    this.el.form.onsubmit = (e) => { this.submitMessage(e); };
  }

  submitMessage(e) {
    // send input to server
    e.preventDefault();
    document.activeElement.blur();

    if (this.el.input.value.length) {
      this.client.packet.sendMessage(this.el.input.value)
      this.el.input.value = '';
    }
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

  limitChat() {
    // remove excess item
    if (this.el.list.children.length >= this.limit) {
      this.el.list.removeChild(this.el.list.children[0]);
    }

    // fade out upper items
    var j = 0;
    var range = (this.limit + 1) - this.fadeFrom;
    for (var i=this.el.list.children.length, end=-1; i>end; --i) {
      if (++j > this.fadeFrom) {
        this.el.list.children[i].style.opacity = 1 - (j - this.fadeFrom) / range;
      }
    }
  }
}

export { Console };
