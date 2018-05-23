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
    this.playerModel = new PlayerModel(this.scene);
    this.peerModels = [];
    this.lights = {
      a: new THREE.AmbientLight(0xffffff, 0.125),
      d: {
        key: new THREE.DirectionalLight(0xffffff, 0.5),
        back: new THREE.DirectionalLight(0xffffff, 0.25)
      }
    };
    this.lights.d.key.position.set(1, 0.5, 0.5);
    this.lights.d.back.position.set(-1, 0.25, -0.5);
    this.scene.add(this.lights.a, this.lights.d.key, this.lights.d.back);
  }

  updatePlayerObjects() {
    // player
    this.playerModel.update(this.player);

    // conform peer mesh array
    const keys = this.peerManager.getKeys();
    const count = keys.length;

    if (count > this.peerModels.length) {
      for (var i=0, len=count-this.peerModels.length; i<len; ++i) {
        this.peerModels.push(new PlayerModel(this.scene));
      }
    } else if (count < this.peerModels.length) {
      for (var i=0, len=this.peerModels.length - count; i<len; ++i) {
        const index = this.peerModels.length - 1;
        this.peerModels[index].remove();
        this.peerModels.splice(index, 1);
      }
    }

    // move peer meshes
    for (var i=0, len=keys.length; i<len; ++i) {
      if (this.peerModels.length > i) {
        this.peerModels[i].update(this.peerManager.getPeer(keys[i]));
      }
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
