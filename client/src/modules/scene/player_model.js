class PlayerModel {
  constructor(scene) {
    this.scene = scene;
    this.colour = 0;
    this.group = new THREE.Group();
    this.mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.25, 12, 12),
      new THREE.MeshPhongMaterial({emissive: 0xffffff})
    );
    this.group.add(this.mesh);
    this.scene.add(this.group);
  }

  update(target) {
    if (this.colour != target.colour) {
      this.mesh.material.emissive.set(target.colour);
    }
    this.group.position.set(target.position.x, target.position.y, target.position.z);
  }

  clone() {
    return new PlayerModel(this.scene);
  }
}

export { PlayerModel };
