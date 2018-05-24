import { ColourGrid } from './colour_grid';
import { PlayerModel } from './player_model';

class Scene {
  constructor(client) {
    // scene
    this.scene = new THREE.Scene();
    this.colourGrid = new ColourGrid(this.scene, client);
    this.playerModel = new PlayerModel(this.scene);

    // camera
    this.ratio = window.innerWidth / window.innerHeight;
    this.size = 20;
    const w = this.size * this.ratio;
    const h = this.size;
    this.camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 1000);
    this.offset = new THREE.Vector3(10, 10, 10);
    this.adjust = 8;

    // player & peer manager
    this.player = client.player;
    this.peerManager = client.peerManager;
    this.peerModels = [];
    this.camera.position.copy(this.player.position);
    this.camera.position.add(this.offset);
    this.camera.lookAt(this.player.position);

    // lighting
    const a1 = new THREE.AmbientLight(0xffffff, 0.125);
    const d1 = new THREE.DirectionalLight(0xffffff, 0.5);
    const d2 = new THREE.DirectionalLight(0xffffff, 0.25);
    d1.position.set(1, 0.5, 0.5);
    d2.position.set(-1, 0.25, -0.5);
    this.scene.add(a1, d1, d2);
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

  update(delta, client) {
    // move camera to player
    const f = this.adjust * delta;
    this.camera.position.set(
      this.camera.position.x + ((this.player.position.x + this.offset.x) - this.camera.position.x) * f,
      this.camera.position.y + ((this.player.position.y + this.offset.y) - this.camera.position.y) * f,
      this.camera.position.z + ((this.player.position.z + this.offset.z) - this.camera.position.z) * f
    );

    // move players
    this.updatePlayerObjects();

    // update colour grid
    this.colourGrid.update();
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
