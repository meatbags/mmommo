class Client {
  constructor() {
    this.socket = new WebSocket('ws://localhost:1337');
    this.socket.onopen = () => { this.onOpen(); };
    this.socket.onmessage = (e) => { this.onMessage(e); };
    this.socket.onclose = () => { this.onClose(); };
  }

  onOpen() {
    var obj = {x: 0};
    this.socket.send(JSON.stringify(obj));
  }

  onMessage(e) {
    var data = JSON.parse(e.data);
    console.log(data);
  }

  onClose() {
    console.log('Connection closed.');
  }
}

export { Client };
