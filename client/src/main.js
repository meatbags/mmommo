import { Client } from './client';
import { Renderer, Scene } from './render';
import { Timer } from './utils';

class App {
  constructor() {
    // start modules
    this.url = `ws://${window.location.host}:1337`;
    this.client = new Client(this.url);
    this.scene = new Scene(this.client);
    this.renderer = new Renderer(this.scene, this.client);
    this.timer = new Timer();
    this.client.init(this.scene, this.renderer);

    // resize on window change
    window.onresize = () => {
      this.scene.resize();
      this.renderer.resize();
    };

    // go!
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });

    // update game logic
    var delta = this.timer.update();
    this.client.update(delta);
    this.scene.update(delta);
    this.renderer.render(delta);
  }
}

window.onload = () => { var app = new App(); };
