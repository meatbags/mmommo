/*
 * HUD
 * -- ?
 */

class HUD {
  constructor() {
    this.hud = document.querySelector('#hud');
    this.help = document.querySelector('#help-button');
    this.overlay = {
      help: document.querySelector('#help-overlay')
    };

    // events
    this.help.onclick = () => {
      this.help.classList.toggle('active');
      this.overlay.help.classList.toggle('active');
    };
  }
}

export { HUD };
