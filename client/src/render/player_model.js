import { minAngleTo } from '../utils/maths';

class PlayerModel {
  constructor(scene) {
    this.scene = scene;
    this.isSet = false;
    this.label = '';
    this.colour = 0;
    this.adjust = 0.2;
    this.isSet = false;
    this.maxTilt = Math.PI / 8;
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
    // label
    this.label = `${target.name}`;

    // move
    if (!this.isSet) {
      this.isSet = true;
      this.group.position.set(target.position.x, target.position.y, target.position.z);
    } else {
      this.group.position.x += (target.position.x - this.group.position.x) * this.adjust;
      this.group.position.z += (target.position.z - this.group.position.z) * this.adjust;
    }

    // tilt pencil
    if (target.accel == 0) {
      this.group.rotation.z += -this.group.rotation.z * this.adjust;
    } else {
      this.group.rotation.z += (this.maxTilt - this.group.rotation.z) * this.adjust;
      this.group.rotation.y += minAngleTo(this.group.rotation.y, Math.atan2(-target.motion.z, target.motion.x)) * this.adjust;
    }

    // change material
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
