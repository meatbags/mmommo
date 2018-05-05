const http = require('http');
const WebSocketServer = require('websocket').server;

class Socket {
  constructor(port, onRequest) {
    this.server = http.createServer((req, res) => {});
    this.server.listen(port, () => {});
    this.ws = new WebSocketServer({httpServer: this.server});
    this.ws.on('request', onRequest);
    console.log(`Listening on ${port}`);
  }
}

export { Socket };
