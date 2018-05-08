import { Client } from './client';
import { SessionToken, PacketUtils } from '../utils';
import { ACTION } from '../../../../shared';

class ClientManager {
  constructor() {
    this.token = new SessionToken();
    this.clients = {};
    this.packet = new PacketUtils(this.clients);
  }

  add(client) {
    // add new client
    const id = this.token.getUnique();
    const onAction = (action, id, data) => { this.onUserAction(action, id, data); };
    this.clients[id] = new Client(client, id, onAction);

    // ping client
    const data = {id: id, rate: this.clients[id].getRate()};
    this.packet.ping(id, data);
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
      case ACTION.MUTE: {
        this.packet.notify(id, `Don't spam. Muted ${data} seconds.`);
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
}

export { ClientManager };
