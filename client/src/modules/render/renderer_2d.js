class Renderer2D {
  constructor(scene, camera, client) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.resize();
    this.cvs.classList.add('overlay-canvas');
    document.body.appendChild(this.cvs);
    this.offsetY = -60;
    this.offsetPerLetter = 1;
    this.textColour = '#111';
    this.textOutlineColour = '#ccc';

    // targets
    this.scene = scene;
    this.camera = camera;
    this.client = client;
    this.player = scene.player;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centre = {x: this.width / 2, y: this.height / 2};
    this.cvs.width = this.width;
    this.cvs.height = this.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  renderLabel(position, name) {
    const vec = position.clone();
    vec.project(this.camera);
    const x = Math.floor(this.centre.x * vec.x + this.centre.x - (name.length * this.offsetPerLetter));
    const y = Math.floor(-this.centre.y * vec.y + this.centre.y + this.offsetY);
    this.ctx.fillStyle = this.textColour;
    this.ctx.fillText(name, x + 0.5, y + 0.5);
    this.ctx.fillStyle = this.textOutlineColour;
    this.ctx.fillText(name, x, y);
  }

  print() {
    for (var i=0; i<arguments.length; ++i) {
      const x = 20;
      const y = 30 + i * 24;
      this.ctx.fillStyle = this.textColour;
      this.ctx.fillText(arguments[i], x, y);
    }
  }

  render(delta) {
    this.clear();
    this.ctx.font = '18px Playfair Display';
    this.print(
      `ping ${this.client.state.get('ping')}`,
      `pencils in server ${this.client.peerManager.peerCount + 1}`,
      `cell ${this.client.player.cell.x}, ${this.client.player.cell.y}`
    );

    // render model labels
    this.ctx.font = '22px Playfair Display';
    this.renderLabel(this.scene.playerModel.group.position, this.scene.playerModel.label);

    for (var i=0, len=this.scene.peerModels.length; i<len; ++i) {
      this.renderLabel(this.scene.peerModels[i].group.position, this.scene.peerModels[i].label);
    }
  }
}

export { Renderer2D };
