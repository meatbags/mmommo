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

  sendPong(data) {
    return this.send(ACTION.PONG, data);
  }

  sendMessage(message) {
    return this.send(ACTION.MESSAGE, message);
  }

  sendMove(player) {
    return this.send(ACTION.MOVE, {
      p: this.jsonVector(player.position),
      v: this.jsonVector(player.motion)
    });
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

  jsonVector(v) {
    return {x: v.x, y: v.y, z: v.z};
  }

  connectionOK() {
    return this.socket.readyState === this.socket.OPEN;
  }
}

export { PacketUtils };
