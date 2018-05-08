import { ACTION } from '../../../shared';

class Client {
  constructor(client, token, rate, onAction) {
    this.sessionToken = token;
    this.onAction = onAction;
    this.name = token.substr(0, 10);

    // logs
    this.rate = rate;
    this.timestamps = [];

    // events
    this.client = client;
    this.client.on('message', (msg) => { this.onMessage(msg); });
    this.client.on('close', (conn) => { this.onAction(ACTION.CONNECTION_CLOSED, this.sessionToken, null); });
  }

  sendMessage(type, data) {
    this.client.sendUTF(
      JSON.stringify({
        type: type,
        data: data
      })
    );
  }

  onMessage(msg) {
    // handle message from client
    if (this.rateLimit() && msg.type === 'utf8') {
      try {
        const res = JSON.parse(msg.utf8Data);

        switch (res.type) {
          case ACTION.MESSAGE: {
            const data = {from: this.name, message: this.sanitise(res.data)};
            this.onAction(ACTION.MESSAGE, this.sessionToken, data);
            break;
          }
          case ACTION.SET_NAME: {
            this.onAction(ACTION.SET_NAME, this.sessionToken, this.sanitise(res.data));
            break;
          }
          case ACTION.PING: {
            if (res.data.name) {
              this.onAction(ACTION.SET_NAME, this.sessionToken, this.sanitise(res.data.name));
            }
            break;
          }
          default: {
            break;
          }
        }
      } catch(e) {
        // invalid JSON
        this.onError();
      }
    }
  }

  onError() {
    this.sendMessage(ACTION.ERROR, null);
  }

  setName(name) {
    // set name (once)
    if (!this.nameLock) {
      this.nameLock = true;
      this.name = name;
    }
  }

  getName(name) {
    return this.name;
  }

  sanitise(input) {
    return input.toString();
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
