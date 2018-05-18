import { Grid } from './grid';
import { PlayerModel } from './player_model';

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
    this.offset = new THREE.Vector3(10, 10, 10);
    this.adjust = 8;

    // initial position
    this.camera.position.copy(this.player.position);
    this.camera.position.add(this.offset);
    this.camera.lookAt(this.player.position);
  }

  init() {
    // colour grid
    this.grid = new Grid(this.scene);

    // players
    this.playerMesh = new PlayerModel(this.scene);
    this.peerMeshes = [];

    // some lights
    this.lights = {
      a: new THREE.AmbientLight(0xffffff, 0.125),
      d: new THREE.DirectionalLight(0xffffff, 0.125)
    };
    //this.scene.add(this.lights.a, this.lights.d);
  }

  updatePlayerObjects() {
    // player
    this.playerMesh.update(this.player);

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
      this.peers[i].update(this.peerManager.peers[peers[i]]);
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

    // move players
    this.updatePlayerObjects();

    // colour grid
    this.grid.update();
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

  getGrid() {
    return this.grid;
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }
}

export { Scene };
