import * as crypto from 'crypto';
import { Client } from './client';

class ClientManager {
  constructor() {
    this.clients = {};
    this.sessions = [];
  }

  add(client) {
    const token = this.getSessionToken();
    this.sessions.push(token);
    this.clients[token] = new Client(client, token);
    this.clients[token].on('message', (msg) => { this.onUserMessage(msg); });
    this.clients[token].on('close', (conn) => { this.onUserClosed(conn); });

    // ping new client
    this.ping(this.clients[token]);
  }

  ping(client) {
    const packet = JSON.stringify({type: 'ping', data: {}});
    client.send(packet);
  }

  onUserMessage(msg) {
    if (msg.type === 'utf8') {
      const data = JSON.parse(msg.utf8Data);
      console.log(data);
    }
  }

  onUserClosed(conn) {
    console.log(conn);
  }

  getSessionToken() {
    // get new session token
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    let hex = hash.digest('hex');

    // prevent collision
    while (this.clients[hex]) {
      hash.update(Math.random().toString());
      hex = hash.digest('hex');
    }

    return hex;
  }
}

export { ClientManager };
