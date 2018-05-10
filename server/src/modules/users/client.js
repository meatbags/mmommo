import { ACTION } from '../../../../shared';
import { RateLimiter, Vector } from '../utils';
import { validVector, sanitise, validStringLength } from '../utils';

class Client {
  constructor(client, id, onAction) {
    this.onAction = onAction;

    // player props
    this.id = id;
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
    this.nameLock = false;

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
    // validate client messages
    if (this.rate.request.inLimit() && msg.type === 'utf8') {
      try {
        const res = JSON.parse(msg.utf8Data);

        switch (res.type) {
          case ACTION.MOVE: {
            this.setPosition(res.data);
            break;
          }
          case ACTION.MESSAGE: {
            this.setChatMessage(res.data);
            break;
          }
          case ACTION.SET_NAME: {
            this.setName(res.data);
            break;
          }
          case ACTION.PONG: {
            console.log("PONG");
            // process pong packet
            if (res.data.name && !this.nameLock) {
              console.log(res.data.name);
              this.setName(res.data.name);
            }
            if (res.data.p && res.data.v) {
              console.log(res.data.p, res.data.v);
              this.setPosition(res.data);
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

  setChatMessage(msg) {
    if (!this.isMuted()) {
      if (this.rate.spam.inLimit()) {
        const clean = sanitise(msg);

        if (validStringLength(clean, this.maxMessageSize)) {
          const data = {from: this.name, message: clean};
          this.onAction(ACTION.MESSAGE, this.id, data);
        }
      } else {
        this.onAction(ACTION.MUTE, this.id, this.muted.timeout);
        this.mute();
      }
    }
  }

  setName(name) {
    if (!this.nameLock) {
      const clean = sanitise(name);

      if (validStringLength(clean, this.maxMessageSize)) {
        this.nameLock = true; // lock name
        this.name = clean;
        this.onAction(ACTION.SET_NAME, this.id, this.name);
      }
    }
  }

  setPosition(data) {
    if (validVector(data.p) && validVector(data.v)) {
      this.position.set(data.p);
      this.motion.set(data.v);
      this.onAction(ACTION.MOVE, this.id, null);
    }
  }

  getRate() {
    // get rate limit
    return this.rate.request.getRate();
  }

  getStateJSON() {
    return {
      id: this.id,
      name: this.name,
      p: this.position.getJSON(),
      v: this.motion.getJSON()
    };
  }

  mute() {
    // mute player for spamming
    this.muted.state = true;
    this.muted.time = (new Date()).getTime() + this.muted.timeout * 1000;
    this.muted.timeout += 5;
  }

  isMuted() {
    // check if still muted
    if (this.muted.state) {
      this.muted.state = (new Date()).getTime() <= this.muted.time;
    }

    return this.muted.state;
  }
}

export { Client };
