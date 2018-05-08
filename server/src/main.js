import * as Module from './modules';
import * as http from 'http';
import {server as WebSocketServer} from 'websocket';

class Server {
  constructor() {
    this.port = 1337;
    this.manager = new Module.ClientManager();

    // create ws server
    this.server = http.createServer((req, res) => {});
    this.server.listen(this.port, () => {
      console.log((new Date()), `Listening on port: ${this.port}`);
    });
    this.ws = new WebSocketServer({httpServer: this.server, autoAcceptConnections: false});
    this.ws.on('request', (req) => {
      if (this.verify(req)) {
        this.manager.add(req.accept(null, req.origin));
      } else {
        req.reject();
      }
    });
  }

  verify(req) {
    // TODO: prevent spamming from IP with rate limiter
    console.log('User connected', req.origin, req.remoteAddress);
    return true;
  }
}

var server = new Server();
