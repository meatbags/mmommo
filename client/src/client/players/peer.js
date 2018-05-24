import { Config } from './config';
import { Config as GlobalConfig } from '../../../../shared';

class Peer {
  constructor(id) {
    // container for peer position, label, colour
    this.id = id;
    this.name = 'player';
    this.colour = null;
    this.accel = 0;
    this.acceleration = Config.acceleration;
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
    this.cell = {x: 0, y: 0};
    this.target = { position: new THREE.Vector3() };
    this.adjust = 0.075;
    this.size = GlobalConfig.global.grid.size;
    this.step = GlobalConfig.global.grid.step;
  }

  setInitialPosition(data) {
    this.position.set(data.p.x, data.p.y, data.p.z);
    this.motion.set(data.v.x, data.v.y, data.v.z);
    this.target.position.set(data.p.x, data.p.y, data.p.z);
  }

  updatePosition(data) {
    this.position.set(data.p.x, data.p.y, data.p.z);
    this.motion.set(data.v.x, data.v.y, data.v.z);
  }

  update(delta) {
    // accelerate & move
    if (!(this.motion.x == 0 && this.motion.z == 0)) {
      this.accel += (1 - this.accel) * this.acceleration;
    } else {
      this.accel = 0;
    }

    this.position.x += this.motion.x * delta * this.accel;
    this.position.z += this.motion.z * delta * this.accel;
    this.target.position.x += (this.position.x - this.target.position.x) * this.adjust;
    this.target.position.z += (this.position.z - this.target.position.z) * this.adjust;

    // set cell
    this.cell.x = Math.floor((this.position.x / this.step) + this.size / 2);
    this.cell.y = Math.floor((this.position.z / this.step) + this.size / 2);
  }
}

export { Peer };
