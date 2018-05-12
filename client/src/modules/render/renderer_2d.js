class Renderer2D {
  constructor(scene, camera) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.resize();
    this.cvs.classList.add('overlay-canvas');
    document.body.appendChild(this.cvs);
    this.offsetY = -20;

    // targets
    this.scene = scene;
    this.camera = camera;
    this.player = scene.player;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centre = {x: this.width / 2, y: this.height / 2};
    this.cvs.width = this.width;
    this.cvs.height = this.height;
  }

  renderName(position, name) {
    const vec = position.clone();
    vec.project(this.camera);
    const x = this.centre.x * vec.x + this.centre.x - (name.length * 2.5);
    const y = -this.centre.y * vec.y + this.centre.y + this.offsetY;
    this.ctx.fillText(name, x, y);
  }

  render(delta) {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    // render player
    this.renderName(this.player.position, this.player.name);

    // render users
    const keys = Object.keys(this.scene.peerManager.peers);

    for (var i=0, len=keys.length; i<len; ++i) {
      const peer = this.scene.peerManager.peers[keys[i]];
      this.renderName(peer.target.position, peer.name);
    }
  }
}

export { Renderer2D };
