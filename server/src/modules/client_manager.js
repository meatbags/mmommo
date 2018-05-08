import { Client } from './client';
import { SessionToken } from './session_token';
import { PacketUtils } from './packet_utils';
import { ACTION } from '../../../shared';

class ClientManager {
  constructor() {
    this.token = new SessionToken();
    this.clients = {};
    this.rate = 10;
    this.packet = new PacketUtils(this.clients);
  }

  add(client) {
    if (this.validate(client)) {
      const id = this.token.getUnique();
      const onAction = (action, id, data) => { this.onUserAction(action, id, data); };
      this.clients[id] = new Client(client, id, this.rate, onAction);
      this.packet.ping(id, {rate: this.rate});
    }
  }

  onUserAction(action, id, data) {
    console.log(action, data);

    switch (action) {
      case ACTION.MESSAGE: {
        this.packet.broadcastMessage(data.from, data.message);
        break;
      }
      case ACTION.CONNECTION_CLOSED: {
        this.token.unregister(id);
        console.log('User DC', id);
        break;
      }
      case ACTION.SET_NAME: {
        this.clients[id].setName(data);
        var name = this.clients[id].getName();
        this.packet.notify(id, `Welcome ${name}!`);
        break;
      }
      default: {
        break;
      }
    }
  }

  validate(client) {
    return true;
  }
}

export { ClientManager };
