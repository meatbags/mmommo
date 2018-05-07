import { Client } from './client';
import { SessionToken } from './session_token';
import * as Action from './actions';

class ClientManager {
  constructor() {
    this.token = new SessionToken();
    this.clients = {};
    this.rate = 10;
  }

  add(client) {
    if (this.validate(client)) {
      const token = this.token.getUnique();
      const onAction = (action, token, data) => { this.onUserAction(action, token, data); };
      this.clients[token] = new Client(client, token, this.rate, onAction);
      this.clients[token].ping();
    }
  }

  onUserAction(action, token, data) {
    switch (action) {
      case Action.ACTION_MESSAGE:
        this.broadcast(data);
        break;
      case Action.ACTION_CLOSED:
        this.token.unregister(token);
        console.log('User disconnected', token);
        break;
      default:
        break;
    }
  }

  broadcast(msg) {
    for (var client in this.clients) {
      if (this.clients.hasOwnProperty(client)) {
        this.clients[client].sendMessage('message', msg);
      }
    }
  }

  validate(client) {
    return true;
  }
}

export { ClientManager };
