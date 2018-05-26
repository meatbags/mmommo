/*
 * Server
 * -- setup websockets & server
 */

import { Manager } from './manager';
import { server as WebSocketServer } from 'websocket';
import * as http from 'http';

class Server {
  constructor() {
    // app logic
    this.manager = new Manager();

    // http & ws server
    this.port = 1337;
    this.server = http.createServer((req, res) => {});
    this.server.listen(this.port, () => {
      console.log((new Date()), `Listening on port: ${this.port}`);
    });
    this.ws = new WebSocketServer({httpServer: this.server, autoAcceptConnections: false});
    this.ws.on('request', (req) => {
      if (this.verify(req)) {
        this.manager.add(req);
      } else {
        req.reject();
      }
    });
  }

  verify(req) {
    // TODO: IP connect rate limit
    return true;
  }
}

var server = new Server();
