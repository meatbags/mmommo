class Scene {
  constructor(player) {
    // scene
    this.player = player;
    this.scene = new THREE.Scene();
    this.init();

    // camera
    this.ratio = window.innerWidth / window.innerHeight;
    this.size = 20;
    const w = this.size * this.ratio;
    const h = this.size;
    this.camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 1000);
    this.target = this.player;
    this.offset = new THREE.Vector3(-10, 10, -10);
    this.adjust = 8;

    // initial position
    this.camera.position.copy(this.offset);
    this.camera.lookAt(this.target.position);
  }

  init() {
    // set up scene
    const geo = new THREE.BoxBufferGeometry(20, 1, 20);
    const mat = new THREE.MeshPhongMaterial({});
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);

    // some lights
    this.lights = {
      a: new THREE.AmbientLight(0xffffff, 0.125),
      d: new THREE.DirectionalLight(0xffffff, 0.125)
    }
    this.scene.add(this.lights.a, this.lights.d);
  }

  update(delta) {
    // move player & camera
    this.player.update(delta);
    const f = this.adjust * delta;
    this.camera.position.set(
      this.camera.position.x + ((this.target.position.x + this.offset.x) - this.camera.position.x) * f,
      this.camera.position.y + ((this.target.position.y + this.offset.y) - this.camera.position.y) * f,
      this.camera.position.z + ((this.target.position.z + this.offset.z) - this.camera.position.z) * f
    );
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  resize() {
    this.ratio = window.innerWidth / window.innerHeight;
    const w = this.size * this.ratio;
    const h = this.size;
    this.camera.left = w / -2;
    this.camera.right = w / 2;
    this.camera.top = h / 2;
    this.camera.bottom = h / -2;
    this.camera.updateProjectionMatrix();
  }
}

export { Scene };
