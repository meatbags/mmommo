import { ACTION, Config } from '../../../../shared';
import { RateLimiter } from './rate_limiter';

class PacketUtils {
  constructor(clients) {
    this.clients = clients;
    this.broadcastRate = new RateLimiter(Config.server.limitBroadcastRate, Config.server.limitBroadcastPeriod);
    this.broadcastPaintRate = new RateLimiter(Config.server.limitBroadcastPaintRate, Config.server.limitBroadcastPaintPeriod);
    this.peerDataKeys = ['id', 'name', 'p', 'v'];
    this.queue = {
      peers: []
    };
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

  map(id, data) {
    if (data !== false) {
      this.clients[id].sendBytes(data);
    }
  }

  sessionImageData(id, data) {
    this.clients[id].sendMessage(ACTION.PAINT, data);
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

  broadcastPaint(data) {
    // broadcast paint data
    if (this.broadcastPaintRate.inLimit()) {
      this.broadcast(ACTION.PAINT, data);
    }
  }

  broadcastPlayerStates(id) {
    // broadcast player data
    if (this.queue.peers.indexOf(id) == -1) {
      this.queue.peers.push(id);
    }

    // rate limit
    if (this.broadcastRate.inLimit()) {
      this.broadcast(ACTION.PEERS, this.queue.peers.map(id => {
        return this.clients[id].state.getPartJSON(this.peerDataKeys);
      }));

      // empty queue
      this.queue.peers = [];
    }
  }
}

export { PacketUtils };
