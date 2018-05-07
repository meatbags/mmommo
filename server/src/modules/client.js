import * as Action from './actions';

class Client {
  constructor(client, token, rate, onAction) {
    this.sessionToken = token;
    this.onAction = onAction;
    this.name = token.substr(0, 10);

    // logs
    this.setRate(rate);
    this.timestamps = [];
    this.ping = {
      last: 0,
      timestamp: (new Date())
    };

    // events
    this.client = client;
    this.client.on('message', (msg) => { this.onMessage(msg); });
    this.client.on('close', (conn) => { this.onAction(Action.ACTION_CLOSED, this.sessionToken, null); });
  }

  onMessage(msg) {
    // handle message from client
    if (this.rateLimit() && msg.type === 'utf8') {
      try {
        const res = JSON.parse(msg.utf8Data);

        switch (res.type) {
          case 'message': {
            const text = this.sanitise(res.data);
            const data = {from: this.name, message: text};
            this.onAction(Action.ACTION_MESSAGE, this.sessionToken, data);
            break;
          }
          case 'set_name': {
            const text = this.sanitise(res.data);
            this.onAction(Action.ACTION_SET_NAME, this.sessionToken, text);
            break;
          }
          case 'ping': {
            this.ping.last = (new Date()) - this.ping.timestamp;
            const data = res.data;
            if (res.data.name) {
              const text = this.sanitise(res.data.name);
              this.onAction(Action.ACTION_SET_NAME, this.sessionToken, text);
            }
            console.log('Ping', this.ping.last);
            break;
          }
          default:
            break;
        }
      } catch(e) {
        // invalid JSON, command, or bad values
        this.onError();
      }
    }
  }

  sendPing() {
    this.ping.timestamp = (new Date());
    this.sendMessage('ping', {rate: this.rate});
  }

  onError() {
    this.sendMessage('error', null);
  }

  sanitise(input) {
    return input.toString(); // TODO: .replace(/[^\w\s]/gi, '')
  }

  sendMessage(type, data) {
    const msg = JSON.stringify({
      type: type,
      data: data
    });

    // send
    this.client.sendUTF(msg);
  }

  setRate(rate) {
    this.rate = rate;
  }

  setName(name) {
    if (!this.nameLock) {
      this.nameLock = true;
      this.name = name;
    }
  }

  getName(name) {
    return this.name;
  }

  rateLimit() {
    const t = new Date();

    // get requests within last second
    for (var i=this.timestamps.length-1, end=-1; i>end; --i) {
      if (t - this.timestamps[i] > 1000) {
        this.timestamps.splice(0, i + 1);
        break;
      }
    }

    // keep or discard
    if (this.timestamps.length <= this.rate) {
      this.timestamps.push(t);
      return true;
    } else {
      return false;
    }
  }
}

export { Client };
