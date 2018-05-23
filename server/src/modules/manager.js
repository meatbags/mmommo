import { ColourGrid } from './grid';
import { User } from './user';
import { SessionToken, PacketUtils } from './utils';
import { ACTION } from '../../../shared';

class Manager {
  constructor(grid) {
    this.token = new SessionToken();
    this.clients = {};
    this.clientCount = 0;
    this.packet = new PacketUtils(this.clients);
    this.grid = new ColourGrid(this);
    this.initUserActions();
  }

  add(req) {
    // add new client, ping client
    const client = req.accept(null, req.origin);
    const id = this.token.getUnique();
    const onAction = (action, id, data) => { this.onUserAction(action, id, data); };
    this.clients[id] = new User(client, id, onAction);

    // send client info
    this.packet.initialise(id);
    this.packet.map(id, this.grid.getImageSrc());
    this.packet.sessionImageData(id, this.grid.getSessionImageData());

    // log remoteAddress
    this.clientCount += 1;
    console.log(`User ${id.substr(0, 10)}... @ ${req.origin} ${req.remoteAddress} connected.`);
  }

  remove(id) {
    delete this.clients[id];
    this.token.unregister(id);
    this.packet.broadcastRemovePlayer(id);
    this.clientCount = Math.max(0, this.clientCount - 1);
    console.log(`User ${id.substr(0, 10)}... disconnected.`);
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
    this.on[ACTION.SET_COLOUR] = (id, data) => {};
    this.on[ACTION.SET_NAME] = (id, data) => { this.packet.notify(id, `Welcome ${data}!`); };
    this.on[ACTION.CONNECTION_CLOSED] = (id, data) => { this.remove(id); };
  }

  onUserAction(action, id, data) {
    // handle valid client actions
    if (action != ACTION.MOVE && action != ACTION.PAINT && action != ACTION.PING) {
      console.log(id.substr(0, 8), action, data);
    }

    if (this.on[action]) {
      this.on[action](id, data);
    }
  }
}

export { Manager };
