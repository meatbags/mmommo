import { div } from '../dom';

class Chat {
  constructor(client) {
    this.client = client;
    this.limit = 12;
    this.fadeFrom = 9;

    // doc elements
    this.el = {};
    this.el.list = document.querySelector('.chat-list');
    this.el.form = document.querySelector('#chat-form');
    this.el.input = document.querySelector('.chat-input__input');

    // events
    this.el.form.onsubmit = (e) => {
      e.preventDefault();
      this.submit();
    };
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
        const alpha = 1.0 - (j - this.fadeFrom) / range;
        console.log(alpha);
        this.el.list.children[i].style.opacity = alpha;
      }
    }
  }

  receive(from, message) {
    this.el.list.appendChild(
      div({
        className: 'chat-list__item',
        innerHTML: `<span class='bold'>${from}</span> ${message}`
      })
    );
    this.limitChat();
  }

  error(message) {
    this.el.list.appendChild(
      div({
        className: 'chat-list__item',
        innerHTML: `<span class='error'>${message}</span>`
      })
    );
    this.limitChat();
  }

  submit() {
    const text = this.el.input.value;

    if (text.length) {
      this.client.sendMessage(text);
      this.el.input.value = '';
    }
  }
}

export { Chat };
