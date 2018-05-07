class Client {
  constructor() {
    this.socket = new WebSocket('ws://localhost:1337');
    this.socket.onopen = () => { this.onOpen(); };
    this.socket.onmessage = (e) => { this.onMessage(e); };
    this.socket.onclose = () => { this.onClose(); };
  }

  onOpen() {
    const hello = {
      type: 'message',
      data: 'Hello!'
    };
    this.socket.send(JSON.stringify(hello));
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
