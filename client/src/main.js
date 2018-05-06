import * as Module from './modules';

class App() {
  constructor() {
    this.client = new Module.Client();
  }
}

var app = new App();
