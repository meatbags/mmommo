class Player {
  constructor() {
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
    this.disabled = false;
    this.speed = 10;
    this.keys = {};
    document.onkeydown = (e) => { this.onKeyDown(e); };
    document.onkeyup = (e) => { this.onKeyUp(e); };
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
    this.position.x += this.motion.x * delta;
    this.position.z += this.motion.z * delta;
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
