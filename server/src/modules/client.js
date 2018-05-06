class Client {
  constructor(client, token) {
    this.client = client;
    this.sessionToken = token;
  }

  on(evt, func) {
    this.client.on(evt, func);
  }

  send(msg) {
    this.client.sendUTF(msg);
  }
}

export { Client };
