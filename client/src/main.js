import * as Module from './modules';

class App {
  constructor() {
    this.master = new Module.Master();
    window.onresize = () => { this.master.resize(); };
  }
}

window.onload = () => {
  var app = new App();
};
