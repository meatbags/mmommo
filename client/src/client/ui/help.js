/*
 * Help
 * -- the help UI
 */

class Help {
  constructor() {
    this.overlay = document.querySelector('.help-overlay');
    this.button = document.querySelector('#help-button');
    this.elements = {
      colour: document.querySelector('.help-colour'),
      map: document.querySelector('.help-minimap'),
      general: document.querySelector('.help-general'),
      chat: document.querySelector('.help-chat'),
      player: document.querySelector('.help-player')
    };
    this.targets = {
      colour: document.querySelector('#colour-target'),
      map: document.querySelector('#map-target'),
      chat: document.querySelector('.chat-list')
    };

    // evts
    this.button.onclick = () => { this.toggle(); };
    this.overlay.onclick = () => { this.close(); };
  }

  snapTo(el, target) {
    const rect = target.getBoundingClientRect();
    this.position(el, rect.left, rect.top);
  }

  position(el, x, y) {
    el.style.top = y + 'px';
    el.style.left = x + 'px';
  }

  close() {
    this.overlay.classList.remove('active');
  }

  toggle() {
    this.overlay.classList.toggle('active');

    if (this.overlay.classList.contains('active')) {
      // general/ controls
      this.position(this.elements.general, 16, 16);
      this.position(this.elements.player, (window.innerWidth - 300)/2, window.innerHeight/2);

      // toolbar
      this.snapTo(this.elements.colour, this.targets.colour);
      this.snapTo(this.elements.map, this.targets.map);
      this.snapTo(this.elements.chat, this.targets.chat);
    }
  }
}

export { Help };
