import { ACTION } from '../../../../shared';
import { RateLimiter, Vector } from '../utils';

class Client {
  constructor(client, id, onAction) {
    this.id = id;
    this.onAction = onAction;

    // player attr
    this.name = 'User_' + id.substr(0, 10);
    this.position = new Vector(0, 0, 0);
    this.motion = new Vector(0, 0, 0);

    // limiters
    this.maxMessageSize = 250;
    this.muted = {
      state: false,
      time: -1,
      timeout: 10
    };
    this.rate = {
      request: new RateLimiter(4, 1),
      spam: new RateLimiter(5, 5)
    };

    // events
    this.client = client;
    this.client.on('message', (msg) => { this.onMessage(msg); });
    this.client.on('close', (conn) => { this.onAction(ACTION.CONNECTION_CLOSED, this.id, null); });
  }

  onMessage(msg) {
    // handle message from client
    if (this.rate.request.inLimit() && msg.type === 'utf8') {
      try {
        const res = JSON.parse(msg.utf8Data);

        switch (res.type) {
          case ACTION.MOVE: {
            const p = this.verifyVector(res.data.p);
            const v = this.verifyVector(res.data.v);

            if (p && v) {
              this.position.set(p);
              this.motion.set(v);
              this.onAction(ACTION.MOVE, this.id, null);
            }

            break;
          }
          case ACTION.MESSAGE: {
            if (!this.isMuted()) {
              if (this.rate.spam.inLimit()) {
                const clean = this.sanitise(res.data);

                if (this.isValidString(clean)) {
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
            if (!this.nameLock) {
              const clean = this.sanitise(res.data);

              if (this.isValidString(clean)) {
                this.nameLock = true; // lock name
                this.name = clean;
                this.onAction(ACTION.SET_NAME, this.id, this.name);
              }
            }

            break;
          }
          case ACTION.PONG: {
            if (res.data.name) {
              const clean = this.sanitise(res.data.name);
              if (this.isValidString(clean)) {
                this.onAction(ACTION.SET_NAME, this.id, clean);
              }
            }
            break;
          }
          default: {
            break;
          }
        }
      } catch(e) {
        // invalid JSON
        this.sendMessage(ACTION.ERROR, null);
      }
    }
  }

  sendMessage(type, data) {
    this.client.sendUTF(
      JSON.stringify({
        type: type,
        data: data
      })
    );
  }

  getStateJSON() {
    return {
      id: this.id,
      name: this.name,
      p: this.position.getJSON(),
      v: this.motion.getJSON()
    };
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

  verifyVector(v) {
    if (isNaN(v.x) || isNaN(v.y) || isNaN(v.z)) {
      return false;
    } else {
      return {x: v.x, y: v.y, z: v.z};
    }
  }

  isValidString(str) {
    return (str.length && str.length < this.maxMessageSize);
  }
}

export { Client };
