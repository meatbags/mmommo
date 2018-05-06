import * as Module from './modules';

class Server {
  constructor() {
    this.manager = new Module.ClientManager();
    this.socket = new Module.Socket(1337, (req) => { this.onRequest(req); });
  }

  onRequest(req) {
    var user = req.accept(null, req.origin);
    this.manager.add(user);
  }
}

var server = new Server();
