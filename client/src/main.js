import * as Module from './modules';

class App {
  constructor() {
    // connect
    this.client = new Module.Client(`ws://${window.location.host}:1337`);

    // game
    this.scene = new Module.Scene(this.client.player);
    this.renderer = new Module.Renderer(this.scene.getScene(), this.scene.getCamera());
    this.timer = new Module.Timer();

    // events
    this.events();
    this.loop();
  }

  loop() {
    // requestAnimationFrame(() => { this.loop(); });

    // update and draw
    this.timer.update();
    this.scene.update(this.timer.delta);
    this.renderer.render(this.timer.delta);
  }

  events() {
    window.onresize = () => {
      this.scene.resize();
      this.renderer.resize();
    };
  }
}

window.onload = () => {
  var app = new App();
};
