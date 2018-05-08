import { ACTION } from '../../../../shared';
import { Chat, Peers, PacketUtils } from './modules';

class Client {
  constructor(url) {
    this.url = url;

    // settings
    this.reconnectCount = 0;
    this.reconnectMaxTries = 3;
    this.reconnectTimeout = 3000;

    // hook up
    this.connect();
    this.chat = new Chat((action, data) => { this.onChat(action, data); });
    this.packet = new PacketUtils(this.socket);
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => { this.onConnect(); };
    this.socket.onmessage = (e) => { this.onMessage(e); };
    this.socket.onerror = (e) => { console.warn(e); };
    this.socket.onclose = () => { this.onDisconnected(); };
  }

  onConnect() {
    // reset data
    this.reconnectCount = 0;
    this.chat.printNotice('Connected.');
    this.peers = new Peers();
    this.packet.setSocket(this.socket);
  }

  onMessage(e) {
    // process message
    const res = JSON.parse(e.data);

    switch (res.type) {
      case ACTION.MESSAGE: {
        this.chat.printMessage(res.data.from, res.data.message);
        break;
      }
      case ACTION.NOTICE: {
        this.chat.printNotice(res.data.message);
        break;
      }
      case ACTION.PING: {
        const data = this.chat.isActive() ? {name: this.chat.getName()} : {};
        this.packet.sendPing(data);

        // set internal rate
        if (!isNaN(res.data.rate) && res.data.rate > 0) {
          this.rate = res.data.rate;
          this.rateInterval = 1 / res.data.rate;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  onChat(action, data) {
    switch (action) {
      case ACTION.MESSAGE: {
        this.packet.sendMessage(data);
        break;
      }
      case ACTION.SET_NAME: {
        if (this.packet.sendSetName(data)) {
          this.chat.setName(data);
        } else {
          this.chat.el.name.notice.innerHTML = '<br />Awaiting connection.';
        }
        break;
      }
      default: {
        break;
      }
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
}

export { Client };
