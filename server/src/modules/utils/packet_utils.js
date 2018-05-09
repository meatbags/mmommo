import { ACTION } from '../../../../shared';
import { RateLimiter } from './rate_limiter';

class PacketUtils {
  constructor(clients) {
    this.clients = clients;
    this.queue = [];
    this.broadcastRate = new RateLimiter(8, 1);
  }

  ping(id) {
    // ping player, give info
    this.clients[id].sendMessage(ACTION.PING, {
      id: id,
      rate: this.clients[id].getRate(),
      peers: Object.keys(this.clients).map(id => {
        return this.clients[id].getStateJSON();
      })
    });
  }

  message(id, from, message) {
    this.clients[id].sendMessage(ACTION.MESSAGE, {from: from, message: message});
  }

  notify(id, message) {
    this.clients[id].sendMessage(ACTION.NOTICE, {message: message});
  }

  broadcast(action, data) {
    for (var id in this.clients) {
      if (this.clients.hasOwnProperty(id)) {
        this.clients[id].sendMessage(action, data);
      }
    }
  }

  broadcastMessage(from, message) {
    this.broadcast(ACTION.MESSAGE, {from: from, message: message});
  }

  broadcastNotice(message) {
    this.broadcast(ACTION.NOTICE, {message: message});
  }

  broadcastPlayerName(id, name) {
    this.broadcastExclusive(ACTION.PEER_SET_NAME, [{id: id, name: name}], id);
  }

  broadcastRemovePlayer(id) {
    this.broadcast(ACTION.PEER_DISCONNECT, {id: id});
  }

  broadcastExclusive(action, data, exclude) {
    for (var id in this.clients) {
      if (this.clients.hasOwnProperty(id) && id != exclude) {
        this.clients[id].sendMessage(action, data);
      }
    }
  }

  broadcastPlayerStates(id) {
    // broadcast positions/ state of moved players
    if (this.queue.indexOf(id) == -1) {
      this.queue.push(id);
    }

    // rate limit
    if (this.broadcastRate.inLimit()) {
      this.broadcast(ACTION.PEERS, this.queue.map(id => {
        return this.clients[id].getStateJSON();
      }));
      this.queue = [];
    }
  }
}

export { PacketUtils };
