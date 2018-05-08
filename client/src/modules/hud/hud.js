class HUD {
  constructor() {
    this.buttons = {
      help: document.querySelector('#help')
    };
    this.menu = {
      help: document.querySelector('#help-menu');
    };

    this.buttons.help.onclick(() => {
      this.menu.help.classList.toggle('active');
    });
  }
}

export { HUD };
