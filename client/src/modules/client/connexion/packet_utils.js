import { ACTION } from '../../../../../shared';

class PacketUtils {
  constructor(socket) {
    this.socket = socket;
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

  setSocket(socket) {
    this.socket = socket;
  }

  sendState(state) {
    return this.send(ACTION.STATE, state);
  }

  sendPing() {
    return this.send(ACTION.PING, {timestamp: (new Date()).getTime()});
  }

  sendPong() {
    return this.send(ACTION.PONG, {});
  }

  sendMessage(message) {
    return this.send(ACTION.MESSAGE, message);
  }

  sendMove(p, v) {
    return this.send(ACTION.MOVE, {p: p, v: v});
  }

  sendSetName(name) {
    return this.send(ACTION.SET_NAME, {name: name});
  }

  connectionOK() {
    return this.socket.readyState === this.socket.OPEN;
  }
}

export { PacketUtils };
