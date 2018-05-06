class Scene {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 1, 1000);
  }

  update(delta) {
    // do stuff
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.ratio = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
}

export { Scene };
