/**
 ** Renderer2D
 ** Render the 2d screen-space overlays (over the WebGL canvas)
 **/

import { Config } from '../../../shared';

class Renderer2D {
  constructor(scene, camera, client) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.resize();
    this.cvs.classList.add('overlay-canvas');
    this.cvs.style.pointerEvents = 'none';
    document.body.appendChild(this.cvs);
    this.offsetY = -60;
    this.offsetPerLetter = 1;
    this.textColour = '#002';
    this.textOutlineColour = '#aaa';
    this.step = Config.global.grid.step;

    // targets
    this.scene = scene;
    this.camera = camera;
    this.client = client;
    this.player = scene.player;
  }

  resize() {
    this.width = window.innerWidth - Config.global.hudSize;
    this.height = window.innerHeight;
    this.centre = {x: this.width / 2, y: this.height / 2};
    this.cvs.width = this.width;
    this.cvs.height = this.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  toScreenPosition(vector) {
    // convert world position to screen
    const vec = vector.clone();
    vec.project(this.camera);
    return {
      x: this.centre.x * vec.x + this.centre.x,
      y: -this.centre.y * vec.y + this.centre.y
    };
  }

  renderWorldLabel(position, label) {
    const p = this.toScreenPosition(position);
    const x = Math.floor(p.x - (name.length * this.offsetPerLetter));
    const y = Math.floor(p.y + this.offsetY);
    this.ctx.fillStyle = this.textColour;
    this.ctx.fillText(label, x + 0.5, y + 0.5);
    this.ctx.fillStyle = this.textOutlineColour;
    this.ctx.fillText(label, x, y);
  }

  print() {
    for (var i=0; i<arguments.length; ++i) {
      const x = 20;
      const y = 30 + i * 20;
      //this.ctx.fillStyle = this.textColour;
      //this.ctx.fillText(arguments[i], x + 0.5, y + 0.5);
      this.ctx.fillStyle = '#11c';//this.textOutlineColour;
      this.ctx.fillText(arguments[i], x, y);
    }
  }

  render(delta) {
    this.clear();

    // draw selected cell
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.textOutlineColour;
    const cell = this.client.player.cursor.cell.clone();
    const p1 = this.toScreenPosition(cell);
    const p2 = this.toScreenPosition(cell.setX(cell.x + this.step));
    const p3 = this.toScreenPosition(cell.setZ(cell.z + this.step));
    const p4 = this.toScreenPosition(cell.setX(cell.x - this.step));
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineTo(p3.x, p3.y);
    this.ctx.lineTo(p4.x, p4.y);
    this.ctx.closePath();
    this.ctx.stroke();

    // draw selected path
    if (this.client.player.waypoints.length > 0) {
      this.ctx.beginPath();
      var p = this.toScreenPosition(this.client.player.position);
      this.ctx.moveTo(p.x, p.y);
      for (var i=0, len=this.client.player.waypoints.length; i<len; ++i) {
        p = this.toScreenPosition(this.client.player.waypoints[i]);
        this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.stroke();
    }

    // print fun stuff
    this.ctx.font = '12px Karla';
    const n = this.client.state.get('cellsColoured');
    this.print(
      `ping ${this.client.state.get('ping')}`,
      `pencils in server ${this.client.peerManager.peerCount + 1}`,
      `cell ${this.client.player.cell.x}, ${this.client.player.cell.y}`,
      `cells filled ${n}`,
      `status: ${this.client.player.status}`
    );

    // render player & peer namesa
    this.ctx.font = '20px Karla';
    this.renderWorldLabel(this.scene.playerModel.group.position, this.scene.playerModel.label);

    for (var i=0, len=this.scene.peerModels.length; i<len; ++i) {
      this.renderWorldLabel(this.scene.peerModels[i].group.position, this.scene.peerModels[i].label);
    }
  }
}

export { Renderer2D };
