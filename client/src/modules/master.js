import { Renderer } from './render';
import { Client } from './socket';
import { Scene } from './scene';
import { Timer } from './utils';

class Master {
  constructor() {
    // set up game & connection
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene.getScene(), this.scene.getCamera());
    this.client = new Client();
    this.timer = new Timer();

    // run the main loop
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    this.timer.update();
    var delta = this.timer.getDelta();
    this.scene.update(delta);
    this.renderer.render(delta);
  }

  resize() {
    this.scene.resize();
    this.renderer.resize();
  }
}

export { Master };
