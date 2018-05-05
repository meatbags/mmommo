class Client {
  constructor() {
    this.socket = new WebSocket('ws://localhost:1337');
    this.socket.onopen = () => {
      this.start();
    };
    this.socket.onmessage = (e) => {
      console.log('Res:', e);
    };
    this.socket.onclose = () => {
      console.log('Connection closed.');
    };
  }

  start() {
    setTimeout(() => {
      this.send(`${Math.random()}`);
      this.start();
    }, 1000);
  }

  send(msg) {
    this.socket.send(msg);
  }
}

var client = new Client();
