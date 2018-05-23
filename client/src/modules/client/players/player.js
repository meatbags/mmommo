import { Config } from './config';
import { Config as GlobalConfig } from '../../../../../shared';

class Player {
  constructor() {
    // grid settings
    this.size = GlobalConfig.global.grid.size;
    this.step = GlobalConfig.global.grid.step;
    this.bound = this.size * this.step;
    this.halfBound = this.bound / 2;

    // spawn position
    const range = GlobalConfig.global.grid.playerSpawnRange;
    this.position = new THREE.Vector3();
    this.position.x = Math.floor(Math.random() * range - range/2) * this.step - this.step / 2;
    this.position.z = Math.floor(Math.random() * range - range/2) * this.step - this.step / 2;

    // game props
    this.motion = new THREE.Vector3();
    this.previous = {};
    this.name = '';
    this.disabled = false;
    this.accel = 0;
    this.colour = 0x00ff00;
    this.acceleration = Config.acceleration;
    this.speed = Config.speed;
    this.diagonalReduction = 1 / (Math.sqrt(2));

    // handle input
    this.keys = {};
    document.onkeydown = (e) => { this.onKeyDown(e); };
    document.onkeyup = (e) => { this.onKeyUp(e); };
  }

  onKeyDown(e) {
    if (document.body == document.activeElement) {
      this.keys[e.code] = true;
    }
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
  }

  getGridCell() {
    // get current containing cell
    return {
      x: Math.floor((this.position.x / this.step) + this.size / 2),
      y: Math.floor((this.position.z / this.step) + this.size / 2)
    };
  }

  inNewGridCell() {
    // check if moved to new cell
    if (this.previous.cell) {
      const cell = this.getGridCell();
      if (!(cell.x == this.previous.cell.x && cell.y == this.previous.cell.y)) {
        this.previous.cell = cell;
        return true;
      } else {
        return false;
      }
    } else {
      this.previous.cell = this.getGridCell();
      return true;
    }
  }

  changed() {
    // check if moved
    if (this.previous.position) {
      if (!this.motion.equals(this.previous.motion) || (this.motion.x == 0 && this.motion.y == 0 && this.motion.z == 0 && !this.position.equals(this.previous.position))) {
        this.previous.motion.copy(this.motion);
        this.previous.position.copy(this.position);
        return true;
      } else {
        return false;
      }
    } else {
      this.previous.position = new THREE.Vector3();
      this.previous.motion = new THREE.Vector3();
      return true;
    }
  }

  move(delta) {
    this.motion.x = -(this.keys['KeyA'] || this.keys['ArrowLeft'] ? this.speed : 0) + (this.keys['KeyD'] || this.keys['ArrowRight'] ? this.speed : 0);
    this.motion.z = -(this.keys['KeyW'] || this.keys['ArrowUp'] ? this.speed : 0) + (this.keys['KeyS'] || this.keys['ArrowDown'] ? this.speed : 0);

    // reduce speed on diagonals
    if (this.motion.x != 0 && this.motion.z != 0) {
      this.motion.x *= this.diagonalReduction;
      this.motion.z *= this.diagonalReduction;
    }

    // accelerate
    if (!(this.motion.x == 0 && this.motion.z == 0)) {
      this.accel += (1 - this.accel) * this.acceleration;
    } else {
      this.accel = 0;
    }

    // move & wrap in bounds
    this.position.x += this.motion.x * delta * this.accel;
    this.position.z += this.motion.z * delta * this.accel;
    this.position.x = (this.position.x > this.halfBound) ? this.halfBound : ((this.position.x < -this.halfBound) ? -this.halfBound : this.position.x);
    this.position.z = (this.position.z > this.halfBound) ? this.halfBound : ((this.position.z < -this.halfBound) ? -this.halfBound : this.position.z);
  }

  enableInput() {
    this.disabled = false;
  }

  disableInput() {
    this.disabled = true;

    // disable any pressed keys
    for (var prop in this.keys) {
      if (this.keys.hasOwnProperty(prop)) {
        this.keys[prop] = false;
      }
    }
  }

  update(delta) {
    this.move(delta);
  }
}

export { Player };
