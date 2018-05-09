import { ACTION } from '../../../../shared';
import { RateLimiter } from './rate_limiter';

class PacketUtils {
  constructor(clients) {
    this.clients = clients;
    this.state = {
      needUpdate: [],
      rate: new RateLimiter(10, 1)
    };
  }

  message(id, from, message) {
    this.clients[id].sendMessage(ACTION.MESSAGE, {from: from, message: message});
  }

  notify(id, message) {
    this.clients[id].sendMessage(ACTION.NOTICE, {message: message});
  }

  ping(id) {
    // ping player, give info
    const data = {
      id: id,
      rate: this.clients[id].getRate(),
      peers: Object.keys(this.clients).map((id) => {
        return this.clients[id].getStateJSON();
      })
    };

    this.clients[id].sendMessage(ACTION.PING, data);
  }

  broadcast(action, data) {
    for (var id in this.clients) {
      if (this.clients.hasOwnProperty(id)) {
        this.clients[id].sendMessage(action, data);
      }
    }
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
    if (this.state.needUpdate.indexOf(id) == -1) {
      this.state.needUpdate.push(id);
    }

    // apply rate limit
    if (this.state.rate.inLimit()) {
      const data = this.state.needUpdate.map((id) => { return this.clients[id].getStateJSON(); });
      this.broadcast(ACTION.PEERS, data);
      this.state.needUpdate = [];
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
}

export { PacketUtils };
