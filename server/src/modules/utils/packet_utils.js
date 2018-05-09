import { ACTION } from '../../../../shared';
import { RateLimiter } from './rate_limiter';

class PacketUtils {
  constructor(clients) {
    this.clients = clients;
    this.position = {
      needsUpdate: [],
      rate: new RateLimiter(5, 1)
    };
  }

  message(id, from, message) {
    this.clients[id].sendMessage(ACTION.MESSAGE, {from: from, message: message});
  }

  notify(id, message) {
    this.clients[id].sendMessage(ACTION.NOTICE, {message: message});
  }

  ping(id) {
    const data = {
      id: id,
      rate: this.clients[id].getRate(),
      peers: Object.keys(this.clients).map((id) => {
        return {id: id, name: this.clients[id].name};
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

  broadcastPlayerPositions(id) {
    // broadcast positions of moved players
    if (this.position.needsUpdate.indexOf(id) == -1) {
      this.position.needsUpdate.push(id);
    }

    // apply rate limit
    if (this.position.rate.inLimit()) {
      const data = this.position.needsUpdate.map((id) => {
        return {
          id: id,
          p: this.clients[id].position,
          v: this.clients[id].motion
        };
      });
      this.broadcast(ACTION.PEERS, data);
      this.position.needsUpdate = [];
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
}

export { PacketUtils };
