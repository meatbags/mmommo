import { Chat } from './chat';
import { Peers } from './peers';

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

  onConnected() {
    // reset data
    this.reconnectCount = 0;
    this.chat.printNotice('Connected.');
    this.peers = new Peers();
  }

  onMessage(e) {
    // process message
    const res = JSON.parse(e.data);

    switch (res.type) {
      case 'message':
        this.chat.printMessage(res.data.from, res.data.message);
        break;
      case 'ping':
        // ping back some info
        this.setRate(res.data.rate);
        this.sendPing();
        break;
      default:
        break;
    }
  }

  setRate(rate) {
    if (!isNaN(rate) && rate > 0) {
      this.rate = rate;
      this.rateInterval = 1 / rate;
    }
  }

  sendMessage(msg) {
    this.sendPacket('message', msg);
  }

  sendPing() {
    // send ping back to server
    const data = {};

    if (this.chat.isActive()) {
      data.name = this.chat.getName();
    }

    this.sendPacket('ping', data);
  }

  sendPacket(type, data) {
    if (this.connectionOK()) {
      const msg = JSON.stringify({type: type, data: data});
      this.socket.send(msg);
    } else {
      this.chat.printNotice('Not connected.');
    }
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

  connectionOK() {
    return (this.socket.readyState === this.socket.OPEN);
  }
}

export { Client };
