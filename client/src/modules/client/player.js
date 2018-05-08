class Player {
  constructor() {
    this.position = new THREE.Vector3();
    this.vector = new THREE.Vector3();
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

  move(delta) {
    this.position.z += ((this.keys['KeyW'] || this.keys['ArrowUp'] ? this.speed : 0) - (this.keys['KeyS'] || this.keys['ArrowDown'] ? this.speed : 0)) * delta;
    this.position.x += ((this.keys['KeyA'] || this.keys['ArrowLeft'] ? this.speed : 0) - (this.keys['KeyD'] || this.keys['ArrowRight'] ? this.speed : 0)) * delta;
  }

  update(delta) {
    this.move(delta);
  }
}

export { Player };
