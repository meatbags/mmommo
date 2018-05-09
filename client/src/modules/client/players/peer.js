class Peer {
  constructor(id) {
    this.id = id;
    this.name = 'player';
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
  }

  setName(name) {
    this.name = name;
  }

  setPosition(data) {
    this.position.set(data.p.x, data.p.y, data.p.z);
    this.motion.set(data.v.x, data.v.y, data.v.z);
  }

  update(delta) {
    this.position.x += this.motion.x * delta;
    this.position.y += this.motion.y * delta;
    this.position.z += this.motion.z * delta;
  }
}

export { Peer };
