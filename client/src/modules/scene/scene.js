class Scene {
  constructor(player, peerManager) {
    // scene handler
    this.player = player;
    this.peerManager = peerManager;
    this.scene = new THREE.Scene();
    this.init();

    // camera
    this.ratio = window.innerWidth / window.innerHeight;
    this.size = 20;
    const w = this.size * this.ratio;
    const h = this.size;
    this.camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 1000);
    this.offset = new THREE.Vector3(-10, 10, -10);
    this.adjust = 8;

    // initial position
    this.camera.position.copy(this.offset);
    this.camera.lookAt(this.player.position);
  }

  init() {
    // set up scene
    const mat = new THREE.MeshPhongMaterial({});
    const floor = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 1, 20), mat);
    const block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 2, 1), mat);
    floor.position.y = -1;
    block.position.x = 10;
    block.position.z = 10;
    this.scene.add(floor, block);

    // players
    this.playerMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 16, 16), new THREE.MeshPhongMaterial({emissive: 0xffffff}));
    this.peerMeshes = [];
    this.scene.add(this.playerMesh);

    // some lights
    this.lights = {
      a: new THREE.AmbientLight(0xffffff, 0.125),
      d: new THREE.DirectionalLight(0xffffff, 0.125)
    }
    this.scene.add(this.lights.a, this.lights.d);
  }

  updatePlayerObjects() {
    // player
    this.playerMesh.position.set(
      this.player.position.x,
      this.player.position.y,
      this.player.position.z
    );

    // conform peer mesh array
    const peers = Object.keys(this.peerManager.peers);

    if (peers.length > this.peerMeshes.length) {
      for (var i=0, len=peers.length - this.peerMeshes.length; i<len; ++i) {
        const clone = this.playerMesh.clone();
        this.peerMeshes.push(clone);
        this.scene.add(clone);
      }
    } else if (peers.length < this.peerMeshes.length) {
      for (var i=0, len=this.peerMeshes.length - peers.length; i<len; ++i) {
        this.scene.remove(this.peerMeshes[i]);
        this.peerMeshes.splice(i, 1);
      }
    }

    // move peer meshes
    for (var i=0, len=peers.length; i<len; i++) {
      const p = this.peerManager.peers[peers[i]];
      this.peerMeshes[i].position.set(
        p.target.position.x,
        p.target.position.y,
        p.target.position.z
      )
    }
  }

  update(delta) {
    // move camera to player
    const f = this.adjust * delta;
    this.camera.position.set(
      this.camera.position.x + ((this.player.position.x + this.offset.x) - this.camera.position.x) * f,
      this.camera.position.y + ((this.player.position.y + this.offset.y) - this.camera.position.y) * f,
      this.camera.position.z + ((this.player.position.z + this.offset.z) - this.camera.position.z) * f
    );

    this.updatePlayerObjects();
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
