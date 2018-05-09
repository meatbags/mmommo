class Renderer2D {
  constructor(player, peerManager) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = 100;
    this.cvs.height = 200;

    // targets
    this.player = player;
    this.peerManager = peerManager;

    // add to doc
    this.cvs.classList.add('overlay-canvas');
    document.body.appendChild(this.cvs);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.cvs.width = 100;
    this.cvs.height = 200;
  }

  render(delta) {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillText('...', 20, 40);
  }
}

export { Renderer2D };
