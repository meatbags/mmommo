import { ColourGrid } from './db';
import { User } from './users';
import { SessionToken, PacketUtils } from './utils';
import { ACTION } from '../../../shared';

class Manager {
  constructor(grid) {
    this.token = new SessionToken();
    this.clients = {};
    this.packet = new PacketUtils(this.clients);
    this.grid = new ColourGrid();
    this.initUserActions();
  }

  add(client) {
    // add new client, ping client
    const id = this.token.getUnique();
    const onAction = (action, id, data) => { this.onUserAction(action, id, data); };
    this.clients[id] = new User(client, id, onAction);

    // send client info
    this.packet.initialise(id);
    this.packet.sessionImageData(id, this.grid.getSessionImageData());
  }
  
  initUserActions() {
    this.on = {};
    this.on[ACTION.MOVE] = (id, data) => { this.packet.broadcastPlayerStates(id); };
    this.on[ACTION.PAINT] = (id, data) => {
      if (this.grid.setPixel(data)) {
        this.packet.broadcastPaint(this.grid.getChanged());
        this.grid.flush();
      }
    };
    this.on[ACTION.MESSAGE] = (id, data) => { this.packet.broadcastMessage(data.from, data.message); };
    this.on[ACTION.PING] = (id, data) => { this.packet.pong(id, data); };
    this.on[ACTION.MUTE] = (id, data) => { this.packet.notify(id, `Don't spam. Muted ${data} seconds.`); };
    this.on[ACTION.SET_NAME] = (id, data) => { this.packet.notify(id, `Welcome ${data}!`); };
    this.on[ACTION.CONNECTION_CLOSED] = (id, data) => {
      delete this.clients[id];
      this.token.unregister(id);
      this.packet.broadcastRemovePlayer(id);
      console.log('Disconnected', id);
    };
  }

  onUserAction(action, id, data) {
    // handle valid client actions
    if (action != ACTION.MOVE && action != ACTION.PAINT && action != ACTION.PING) {
      console.log(action, data);
    }

    if (this.on[action]) {
      this.on[action](id, data);
    }
  }
}

export { Manager };
