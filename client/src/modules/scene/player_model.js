class PlayerModel {
  constructor(scene, target) {
    this.position = target.position;
    this.motion = target.motion;
    this.model = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 12, 12),
      new THREE.MeshPhongMaterial({color: 0xffffff})
    );
  }

  update() {
  }
}

export { PlayerModel };
