import { ACTION } from '../../../../shared';

class PacketUtils {
  constructor(clients) {
    this.clients = clients;
  }

  message(id, from, message) {
    this.clients[id].sendMessage(ACTION.MESSAGE, {from: from, message: message});
  }

  notify(id, message) {
    this.clients[id].sendMessage(ACTION.NOTICE, {message: message});
  }

  ping(id, data) {
    this.clients[id].sendMessage(ACTION.PING, data);
  }

  broadcastMessage(from, message) {
    const data = {from: from, message: message};

    for (var id in this.clients) {
      if (this.clients.hasOwnProperty(id)) {
        this.clients[id].sendMessage(ACTION.MESSAGE, data);
      }
    }
  }

  broadcastNotice(message) {
    const data = {message: message};

    for (var id in this.clients) {
      if (this.clients.hasOwnProperty(id)) {
        this.clients[id].sendMessage(ACTION.NOTICE, data);
      }
    }
  }
}

export { PacketUtils };
