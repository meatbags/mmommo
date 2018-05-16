import { User } from './user';
import { SessionToken, PacketUtils } from '../utils';
import { ACTION } from '../../../../shared';

class UserManager {
  constructor(requestWrite) {
    this.token = new SessionToken();
    this.clients = {};
    this.packet = new PacketUtils(this.clients);
    this.requestWrite = requestWrite;
  }

  add(client) {
    // add new client, ping client
    const id = this.token.getUnique();
    const onAction = (action, id, data) => { this.onUserAction(action, id, data); };
    this.clients[id] = new User(client, id, onAction);
    this.packet.initialise(id);
  }

  onUserAction(action, id, data) {
    // handle valid client actions
    if (action != ACTION.MOVE && action != ACTION.PING) {
      console.log(action, data);
    }

    switch (action) {
      case ACTION.MOVE: {
        this.packet.broadcastPlayerStates(id);
        break;
      }
      case ACTION.PAINT: {
        // paint, write to DB
        break;
      }
      case ACTION.MESSAGE: {
        this.packet.broadcastMessage(data.from, data.message);
        break;
      }
      case ACTION.PING: {
        this.packet.pong(id, data);
        break;
      }
      case ACTION.MUTE: {
        this.packet.notify(id, `Don't spam. Muted ${data} seconds.`);
        break;
      }
      case ACTION.SET_NAME: {
        this.packet.notify(id, `Welcome ${data}!`);
        break;
      }
      case ACTION.CONNECTION_CLOSED: {
        delete this.clients[id];
        this.token.unregister(id);
        this.packet.broadcastRemovePlayer(id);
        console.log('Disconnected', id);
        break;
      }
      default: {
        break;
      }
    }
  }
}

export { UserManager };
