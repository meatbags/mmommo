import { Socket } from './modules/socket';

class Server {
  constructor() {
    this.users = [];
    this.messages = [];
    this.socket = new Socket(1337, (req) => { this.onRequest(req); });
  }

  onRequest(req) {
    const user = req.accept(null, req.origin);

    // add user
    this.users.push(user);

    // on message received
    user.on('message', (msg) => {
      if (msg.type === 'utf8') {
        console.log((new Date()) + 'Msg ' + msg.utf8Data);
        var obj = {text: msg.utf8Data};
        this.messages.push(obj);

        // broadcast
        var packet = JSON.stringify({type: 'message', data: obj});
        for (var i=0; i<this.users.length; ++i) {
          this.users[i].sendUTF(packet);
        }
      }
    });

    // on user dc
    user.on('close', function(conn) {
      console.log('Closed', conn);
    });
  }
}

var server = new Server();
