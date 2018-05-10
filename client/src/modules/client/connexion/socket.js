class Socket {
  constructor(client) {
    this.client = client;
    this.reconnect = {count: 0, max: 3, timeout: 3000, lock: false};
    this.connect();
  }

  connect(onConnect, onMessage, onDisconnect) {
    this.socket = new WebSocket(this.client.url);
    this.socket.onopen = () => {
      this.reconnect.count = 0;
      this.client.console.printNotice('Connected.');
      this.client.onConnect();
    };
    this.socket.onmessage = (e) => { this.client.handleMessage(e); };
    this.socket.onerror = (e) => { console.warn(e); };
    this.socket.onclose = () => { this.onDisconnect(); };
  }

  onDisconnect() {
    // try to re-establish connection
    if (!this.reconnect.lock) {
      this.reconnect.lock = true;

      if (++this.reconnect.count <= this.reconnect.max) {
        this.client.console.printNotice(`No connection. Retrying ${this.reconnect.count}/${this.reconnect.max}`);

        setTimeout(() => {
          this.reconnect.lock = false;
          this.connect();
        }, this.reconnect.timeout);
      } else {
        this.client.console.printNotice('Connection failed.');
      }
    }
  }

  getSocket() {
    return this.socket;
  }
}

export { Socket };
