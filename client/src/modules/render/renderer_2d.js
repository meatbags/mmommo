class Renderer2D {
  constructor(scene, camera) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.resize();
    this.cvs.classList.add('overlay-canvas');
    document.body.appendChild(this.cvs);
    this.offsetY = -60;
    this.offsetPerLetter = 1;
    this.ctx.font = '18px Arial';

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

  renderLabel(position, name) {
    const vec = position.clone();
    vec.project(this.camera);
    const x = Math.floor(this.centre.x * vec.x + this.centre.x - (name.length * this.offsetPerLetter));
    const y = Math.floor(-this.centre.y * vec.y + this.centre.y + this.offsetY);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(name, x + 0.75, y + 0.75);
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(name, x, y);
  }

  render(delta) {
    // render model labels
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.renderLabel(this.scene.playerModel.group.position, this.scene.playerModel.label);

    for (var i=0, len=this.scene.peerModels.length; i<len; ++i) {
      this.renderLabel(this.scene.peerModels[i].group.position, this.scene.peerModels[i].label);
    }
  }
}

export { Renderer2D };
