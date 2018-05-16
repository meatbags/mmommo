import * as Module from './modules';

class App {
  constructor() {
    // connect
    this.client = new Module.Client(`ws://${window.location.host}:1337`);

    // game
    this.scene = new Module.Scene(this.client.getPlayer(), this.client.getPeers());
    this.renderer = new Module.Renderer(this.scene);
    this.timer = new Module.Timer();

    // hook colour grid
    this.client.setGrid(this.scene.getGrid());

    // events
    this.events();
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    this.timer.update();

    // update game logic
    this.client.update(this.timer.delta);
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
