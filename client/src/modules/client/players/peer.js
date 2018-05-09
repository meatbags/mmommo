class Peer {
  constructor(id) {
    this.id = id;
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
  }

  set(p, v) {
    this.position.copy(p);
    this.motion.copy(v);
  }
}

export { Peer };
