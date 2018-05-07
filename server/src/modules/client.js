import * as Action from './actions';

class Client {
  constructor(client, token, rate, onAction) {
    this.sessionToken = token;
    this.onAction = onAction;
    this.name = token.substr(0, 10);

    // logs
    this.setRate(rate);
    this.timestamps = [];

    // events
    this.client = client;
    this.client.on('message', (msg) => {
      this.onMessage(msg);
    });
    this.client.on('close', (conn) => {
      this.onAction(Action.ACTION_CLOSED, this.sessionToken, null);
    });
  }

  onMessage(msg) {
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
          default:
            break;
        }
      } catch(e) {
        // invalid JSON
        this.onError();
      }
    }
  }

  ping() {
    this.sendMessage('ping', {rate: this.rate});
  }

  onError() {
    this.sendMessage('error', null);
  }

  sanitise(input) {
    return input; // TODO: .replace(/[^\w\s]/gi, '')
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
