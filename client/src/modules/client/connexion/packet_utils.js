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

  sendPong(client) {
    const data = client.getState();
    data.p = this.vectorToJSON(client.player.position);
    data.v = this.vectorToJSON(client.player.motion);

    return this.send(ACTION.PONG, data);
  }

  sendMessage(message) {
    return this.send(ACTION.MESSAGE, message);
  }

  sendMove(position, motion) {
    return this.send(ACTION.MOVE, {
      p: this.vectorToJSON(position),
      v: this.vectorToJSON(motion)
    });
  }

  sendSetName(name) {
    return this.send(ACTION.SET_NAME, name);
  }

  setSocket(socket) {
    this.socket = socket;
  }

  vectorToJSON(v) {
    return {x: v.x, y: v.y, z: v.z};
  }

  connectionOK() {
    return this.socket.readyState === this.socket.OPEN;
  }
}

export { PacketUtils };
