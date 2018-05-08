import { ACTION } from '../../../../../shared';

class PacketUtils {
  constructor(socket) {
    this.socket = socket;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  sendSetName(name) {
    return this.send(ACTION.SET_NAME, name);
  }

  sendPing(data) {
    return this.send(ACTION.PING, data);
  }

  sendMessage(message) {
    return this.send(ACTION.MESSAGE, message);
  }

  send(type, data) {
    if (this.connectionOK()) {
      const msg = JSON.stringify({type: type, data: data});
      this.socket.send(msg);
      return true;
    } else {
      return false;
    }
  }

  connectionOK() {
    return this.socket.readyState === this.socket.OPEN;
  }
}

export { PacketUtils };
