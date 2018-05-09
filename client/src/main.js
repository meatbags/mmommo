import * as Module from './modules';

class App {
  constructor() {
    // connect
    this.client = new Module.Client(`ws://${window.location.host}:1337`);

    // game
    this.scene = new Module.Scene(this.client.player, this.client.peerManager);
    this.renderer = new Module.Renderer(this.scene.getScene(), this.scene.getCamera());
    this.renderer2d = new Module.Renderer2D(this.scene.getScene(), this.scene.getCamera());
    this.timer = new Module.Timer();

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
    this.renderer2d.render(this.timer.delta);
  }

  events() {
    window.onresize = () => {
      this.scene.resize();
      this.renderer.resize();
      this.renderer2d.resize();
    };
  }
}

window.onload = () => {
  var app = new App();
};
