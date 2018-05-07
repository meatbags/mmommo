import { Chat } from './chat';

class Client {
  constructor() {
    this.socket = new WebSocket('ws://localhost:1337');
    this.socket.onopen = () => { this.sendMessage('Hello server!'); };
    this.socket.onmessage = (e) => { this.onMessage(e); };
    this.socket.onclose = () => { this.onClose(); };
    this.socket.onerror = (e) => { this.onError(e); };

    console.log(this.socket);

    // hook up chat
    this.chat = new Chat(this);
  }

  onMessage(e) {
    const res = JSON.parse(e.data);

    if (res.type == 'message') {
      this.chat.receive(res.data.from, res.data.message);
    }
  }

  onError(e) {
    this.chat.error(e.type);
  }

  sendMessage(msg) {
    if (this.connectionOK()) {
      this.sendPacket('message', msg);
    } else {
      this.chat.error('Not connected.');
    }
  }

  sendPacket(type, data) {
    console.log(this.socket);
    // server will only accept json
    const msg = JSON.stringify({type: type, data: data});
    this.socket.send(msg);
  }

  connectionOK() {
    return (this.socket.readyState === this.socket.OPEN);
  }

  onClose() {
    this.chat.error('Connection closed.');
  }
}

export { Client };
