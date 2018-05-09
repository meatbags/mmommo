class Socket {
  constructor(url, output, onConnect, onMessage) {
    this.url = url;
    this.console = output;
    this.reconnect = {count: 0, max: 3, timeout: 3000, lock: false};
    this.onConnect = onConnect;
    this.onMessage = onMessage;
    this.connect();
  }

  connect(onConnect, onMessage, onDisconnect) {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      this.reconnect.count = 0;
      this.console.printNotice('Connected.');
      this.onConnect();
    };
    this.socket.onmessage = (e) => { this.onMessage(e); };
    this.socket.onerror = (e) => { console.warn(e); };
    this.socket.onclose = () => { this.onDisconnect(); };
  }

  onDisconnect() {
    // try to re-establish connection
    if (!this.reconnect.lock) {
      this.reconnect.lock = true;

      if (++this.reconnect.count <= this.reconnect.max) {
        this.console.printNotice(`No connection. Retrying ${this.reconnect.count}/${this.reconnect.max}`);

        setTimeout(() => {
          this.reconnect.lock = false;
          this.connect();
        }, this.reconnect.timeout);
      } else {
        this.console.printNotice('Connection failed.')
      }
    }
  }

  getSocket() {
    return this.socket;
  }
}

export { Socket };
