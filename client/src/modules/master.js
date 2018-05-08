import { Renderer } from './render';
import { Client } from './client';
import { Scene } from './scene';
import { Timer } from './utils';

class Master {
  constructor() {
    // connect
    this.client = new Client('ws://localhost:1337');

    // game
    this.scene = new Scene(this.client.player);
    this.renderer = new Renderer(this.scene.getScene(), this.scene.getCamera());
    this.timer = new Timer();

    // run the main loop
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });

    // update and draw
    this.timer.update();
    this.scene.update(this.timer.delta);
    this.renderer.render(this.timer.delta);
  }

  resize() {
    this.scene.resize();
    this.renderer.resize();
  }
}

export { Master };
