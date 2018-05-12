import { ACTION, Config } from '../../../../shared';
import { RateLimiter } from './rate_limiter';

class PacketUtils {
  constructor(clients) {
    this.clients = clients;
    this.queue = [];
    this.limit = Config.limit.server;
    this.broadcastRate = new RateLimiter(this.limit.broadcast.rate, this.limit.broadcast.period);
    this.peerDataKeys = ['id', 'name', 'p', 'v'];
  }

  initialise(id) {
    // send id and peers
    this.clients[id].sendMessage(ACTION.STATE, {id: id});
    this.clients[id].sendMessage(ACTION.PEERS, Object.keys(this.clients).map(id => {
      return this.clients[id].state.getPartJSON(this.peerDataKeys);
    }));

    // request state (case server disconnect)
    this.clients[id].sendMessage(ACTION.STATE_REQUEST, this.peerDataKeys);
  }

  ping(id) {
    this.clients[id].sendMessage(ACTION.PING, null);
  }

  pong(id, data) {
    this.clients[id].sendMessage(ACTION.PONG, {timestamp: data});
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
    // broadcast player data
    if (this.queue.indexOf(id) == -1) {
      this.queue.push(id);
    }

    // rate limit
    if (this.broadcastRate.inLimit()) {
      this.broadcast(ACTION.PEERS, this.queue.map(id => {
        return this.clients[id].state.getPartJSON(this.peerDataKeys);
      }));

      // empty queue
      this.queue = [];
    }
  }
}

export { PacketUtils };
