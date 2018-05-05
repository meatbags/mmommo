class Client {
  constructor() {
    var d = document.createElement('div');
    d.innerHTML = 'Hello Client!';
    document.body.appendChild(d);
  }
}

var client = new Client();
