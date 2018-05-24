import * as Module from './modules';

class App {
  constructor() {
    // start modules
    this.url = `ws://${window.location.host}:1337`;
    this.client = new Module.Client(this.url);
    this.scene = new Module.Scene(this.client);
    this.renderer = new Module.Renderer(this.scene, this.client);
    this.timer = new Module.Timer();
    this.client.init(this.scene);
    
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

window.onload = () => {
  var app = new App();
};
