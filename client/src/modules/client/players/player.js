import { Config } from './config';

class Player {
  constructor() {
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
    this.disabled = false;
    this.accel = 0;
    this.acceleration = Config.acceleration;
    this.speed = Config.speed;
    this.diagonalReduction = 1 / (Math.sqrt(2));
    this.keys = {};
    document.onkeydown = (e) => { this.onKeyDown(e); };
    document.onkeyup = (e) => { this.onKeyUp(e); };
    document.body.onblur = () => { console.log('body_blurred'); };
  }

  onKeyDown(e) {
    if (!this.disabled) {
      this.keys[e.code] = true;
    }
  }

  onKeyUp(e) {
    if (!this.disabled) {
      this.keys[e.code] = false;
    }
  }

  changed() {
    // check if moved
    if (this.previous) {
      if (!this.motion.equals(this.previous.motion) || (
        this.motion.x == 0 &&
        this.motion.y == 0 &&
        this.motion.z == 0 &&
        !this.position.equals(this.previous.position)
      )) {
        this.previous.motion.copy(this.motion);
        this.previous.position.copy(this.position);
        return true;
      } else {
        return false;
      }
    } else {
      this.previous = {
        motion: new THREE.Vector3(),
        position: new THREE.Vector3()
      };
      return true;
    }
  }

  move(delta) {
    this.motion.x = (this.keys['KeyA'] || this.keys['ArrowLeft'] ? this.speed : 0) - (this.keys['KeyD'] || this.keys['ArrowRight'] ? this.speed : 0);
    this.motion.z = (this.keys['KeyW'] || this.keys['ArrowUp'] ? this.speed : 0) - (this.keys['KeyS'] || this.keys['ArrowDown'] ? this.speed : 0);

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

    // move
    this.position.x += this.motion.x * delta * this.accel;
    this.position.z += this.motion.z * delta * this.accel;
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
