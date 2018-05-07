import { Chat } from './chat';

class Client {
  constructor(url) {
    this.url = url;
    this.reconnectCount = 0;
    this.reconnectMaxTries = 3;
    this.reconnectTimeout = 3000;
    this.connect();

    // hook up chat
    this.chat = new Chat(this);
  }

  connect() {
    if (!this.closed) {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => { this.onConnected(); };
      this.socket.onmessage = (e) => { this.onMessage(e); };
      this.socket.onerror = (e) => { console.warn(e); };
      this.socket.onclose = () => { this.onDisconnected(); };
    }
  }

  onMessage(e) {
    // process message
    const res = JSON.parse(e.data);

    switch (res.type) {
      case 'message':
        this.chat.printMessage(res.data.from, res.data.message);
        break;
      default:
        break;
    }
  }

  sendMessage(msg) {
    this.sendPacket('message', msg);
  }

  sendPacket(type, data) {
    if (this.socket.readyState === this.socket.OPEN) {
      const msg = JSON.stringify({type: type, data: data});
      this.socket.send(msg);
    } else {
      this.chat.printNotice('Not connected.');
    }
  }

  onConnected() {
    this.reconnectCount = 0;
    this.chat.printNotice('Connected.');
  }

  onDisconnected() {
    // try to re-establish connection
    if (!this.reconnectLock) {
      this.reconnectLock = true;

      if (++this.reconnectCount <= this.reconnectMaxTries) {
        this.chat.printNotice(`No connection. Retrying ${this.reconnectCount}/${this.reconnectMaxTries}`);

        setTimeout(() => {
          this.reconnectLock = false;
          this.connect();
        }, this.reconnectTimeout);
      } else {
        this.chat.printNotice('Connection failed.')
      }
    }
  }
}

export { Client };
