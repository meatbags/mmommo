class PlayerModel {
  constructor(scene) {
    this.scene = scene;
    this.colour = 0;
    this.group = new THREE.Group();
    this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.5, 5, 0.5), new THREE.MeshPhongMaterial({emissive: 0xffffff}));
    this.mesh.position.y = 2.5;
    this.group.add(this.mesh);
    this.scene.add(this.group);
  }

  update(target) {
    if (this.colour != target.colour) {
      this.colour = target.colour;
      this.mesh.material.emissive.set(target.colour);
    }
    this.group.position.set(target.position.x, target.position.y, target.position.z);
  }

  clone() {
    return new PlayerModel(this.scene);
  }
}

export { PlayerModel };
