import * as http from 'http';
import {server as WebSocketServer} from 'websocket';

class Socket {
  constructor(port, onRequest) {
    // create web-socket server
    this.server = http.createServer((req, res) => {});
    this.server.listen(port, () => {});
    this.ws = new WebSocketServer({httpServer: this.server});
    this.ws.on('request', onRequest);

    // log
    console.log((new Date()), `Listening on port: ${port}`);
  }
}

export { Socket };
