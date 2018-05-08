import { ACTION } from '../../../../shared';
import { RateLimiter } from '../utils';

class Client {
  constructor(client, id, onAction) {
    this.id = id;
    this.onAction = onAction;
    this.name = 'User_' + id.substr(0, 10);

    // logs
    this.muted = {
      state: false,
      time: -1,
      timeout: 10
    };
    this.rate = {
      request: new RateLimiter(10, 1),
      spam: new RateLimiter(5, 5)
    };

    // events
    this.client = client;
    this.client.on('message', (msg) => { this.onMessage(msg); });
    this.client.on('close', (conn) => { this.onAction(ACTION.CONNECTION_CLOSED, this.id, null); });
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
    if (this.rate.request.inLimit() && msg.type === 'utf8') {
      try {
        const res = JSON.parse(msg.utf8Data);

        switch (res.type) {
          case ACTION.MESSAGE: {
            if (!this.isMuted()) {
              if (this.rate.spam.inLimit()) {
                const clean = this.sanitise(res.data);

                if (clean.length) {
                  const data = {from: this.name, message: clean};
                  this.onAction(ACTION.MESSAGE, this.id, data);
                }
              } else {
                this.onAction(ACTION.MUTE, this.id, this.muted.timeout);
                this.mute();
              }
            }
            break;
          }
          case ACTION.SET_NAME: {
            this.onAction(ACTION.SET_NAME, this.id, this.sanitise(res.data));
            break;
          }
          case ACTION.PING: {
            if (res.data.name) {
              this.onAction(ACTION.SET_NAME, this.id, this.sanitise(res.data.name));
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

  getRate() {
    return this.rate.request.getRate();
  }

  mute() {
    this.muted.state = true;
    this.muted.time = (new Date()).getTime() + this.muted.timeout * 1000;
    this.muted.timeout += 5;
  }

  isMuted() {
    // check if muted period is over
    if (this.muted.state) {
      this.muted.state = (new Date()).getTime() <= this.muted.time;
    }

    return this.muted.state;
  }

  sanitise(input) {
    return input.toString().replace(/[^a-zA-Z0-9 .,?'"!@#$%^&*()_\-+]/gi, '');
  }
}

export { Client };
