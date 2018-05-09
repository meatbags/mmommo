class Peer {
  constructor(id) {
    this.id = id;
    this.name = 'player';
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
    this.target = {
      position: new THREE.Vector3()
    };
    this.adjust = 0.075;
  }

  setName(name) {
    this.name = name;
  }

  setPosition(data) {
    this.position.set(data.p.x, data.p.y, data.p.z);
    this.motion.set(data.v.x, data.v.y, data.v.z);
    this.target.position.set(data.p.x, data.p.y, data.p.z);
  }

  updatePosition(data) {
    this.position.set(data.p.x, data.p.y, data.p.z);
    this.motion.set(data.v.x, data.v.y, data.v.z);
  }

  update(delta) {
    this.position.x += this.motion.x * delta;
    this.position.y += this.motion.y * delta;
    this.position.z += this.motion.z * delta;
    this.target.position.x += (this.position.x - this.target.position.x) * this.adjust;
    this.target.position.y += (this.position.y - this.target.position.y) * this.adjust;
    this.target.position.z += (this.position.z - this.target.position.z) * this.adjust;
  }
}

export { Peer };
