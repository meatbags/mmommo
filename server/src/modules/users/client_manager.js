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
    // add new client, ping client
    const id = this.token.getUnique();
    const onAction = (action, id, data) => { this.onUserAction(action, id, data); };
    this.clients[id] = new Client(client, id, onAction);
    this.packet.ping(id);
  }

  remove(id) {
    // remove client, broadcast removal
    delete this.clients[id];
    this.token.unregister(id);
    this.packet.broadcastRemovePlayer(id);
    console.log('Disconnected', id);
  }

  onUserAction(action, id, data) {
    // handle valid client actions
    if (action != ACTION.MOVE) {
      //console.log(action, data);
    }

    switch (action) {
      case ACTION.MOVE: {
        this.packet.broadcastPlayerStates(id);
        break;
      }
      case ACTION.MESSAGE: {
        this.packet.broadcastMessage(data.from, data.message);
        break;
      }
      case ACTION.MUTE: {
        this.packet.notify(id, `Don't spam. Muted ${data} seconds.`);
        break;
      }
      case ACTION.SET_NAME: {
        this.packet.notify(id, `Welcome ${data}!`);
        this.packet.broadcastPlayerName(id, data);
        break;
      }
      case ACTION.CONNECTION_CLOSED: {
        this.remove(id);
        break;
      }
      default: {
        break;
      }
    }
  }
}

export { ClientManager };
