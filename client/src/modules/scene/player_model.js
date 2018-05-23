import { minAngleTo } from '../utils/maths';

class PlayerModel {
  constructor(scene) {
    this.scene = scene;
    this.isSet = false;
    this.colour = 0;
    this.adjust = 0.25;
    this.buildModel();
  }

  buildModel() {
    this.group = new THREE.Group();
    this.material = {
      shade: new THREE.MeshPhongMaterial({}),
      wood: new THREE.MeshPhongMaterial({color: 0xffaa66})
    };

    // pencil geometry
    const radius = 0.5;
    const tip = 1.5;
    const height = 8;
    const segments = 6;
    this.tube = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height - tip, segments), this.material.shade);
    this.shaft = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius/2, tip/2, segments, 1, true), this.material.wood);
    this.tip = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius/2, 0, tip/2, segments, 1, true), this.material.shade);
    this.tube.position.y = (height - tip)/2 + tip;
    this.shaft.position.y = tip/2 + tip/4;
    this.tip.position.y = tip/4;

    // wrap in group
    this.group.add(this.tube, this.shaft, this.tip);
    this.scene.add(this.group);
  }

  update(target) {
    if (!this.isSet) {
      this.isSet = true;
      this.position = new THREE.Vector3();
      this.position.set(target.position.x, target.position.y, target.position.z);
    }

    this.position.x = (target.position.x - this.position.x) * this.adjust;
    this.group.position.set(target.position.x, target.position.y, target.position.z);

    if (this.colour != target.colour) {
      this.colour = target.colour;
      this.material.shade.color.set(target.colour);
    }
  }

  remove() {
    this.scene.remove(this.group);
  }
}

export { PlayerModel };
