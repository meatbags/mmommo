import { ACTION, ClientState, Vector, Config } from '../../../../shared';
import { RateLimiter } from '../utils';
import * as valid from '../utils/validation';

class User {
  constructor(client, id, onAction) {
    this.onAction = onAction;

    // player props
    this.id = id;
    this.state = new ClientState();
    this.state.set({id: id, name: 'User_' + id.substr(0, 10)});

    // limits
    this.rate = {
      request: new RateLimiter(Config.server.limitRequestRate, Config.server.limitRequestPeriod),
      spam: new RateLimiter(Config.server.limitSpamRate, Config.server.limitSpamPeriod)
    };
    this.muted = {
      state: false,
      time: -1,
      timeout: Config.server.userMuteTimeout
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
    if (this.rate.request.inLimit() && valid.request(msg)) {
      try {
        const res = JSON.parse(msg.utf8Data);

        if (res.type && res.data) {
          switch (res.type) {
            case ACTION.MOVE: {
              this.setPosition(res.data);
              break;
            }
            case ACTION.PAINT: {
              if (valid.int(res.data.x) && valid.int(res.data.y) && valid.colour(res.data.colour) && valid.bounds(res.data.x, res.data.y)) {
                this.onAction(ACTION.PAINT, this.id, {x: res.data.x, y: res.data.y, colour: res.data.colour});
              }
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
            case ACTION.STATE: {
              this.setName(res.data);
              this.setPosition(res.data);
              break;
            }
            case ACTION.PING: {
              if (res.data.timestamp) {
                this.onAction(ACTION.PING, this.id, res.data.timestamp);
              }
              break;
            }
            case ACTION.PONG: {
              // process pong
              break;
            }
            default: {
              break;
            }
          }
        }
      } catch(e) {
        // invalid JSON
        this.sendMessage(ACTION.ERROR, null);
      }
    }
  }

  setChatMessage(data) {
    if (!this.isMuted()) {
      if (this.rate.spam.inLimit()) {
        const clean = valid.sanitise(data);

        if (valid.stringLength(clean)) {
          this.onAction(ACTION.MESSAGE, this.id, {from: this.state.get('name'), message: clean});
        }
      } else {
        this.onAction(ACTION.MUTE, this.id, this.muted.timeout);
        this.mute();
      }
    }
  }

  setName(data) {
    if (data.name !== undefined && !this.nameLock) {
      const clean = valid.sanitise(data.name);

      if (valid.stringLength(clean)) {
        this.nameLock = true; // lock name
        this.state.set({name: clean});
        this.onAction(ACTION.SET_NAME, this.id, clean);
      }
    }
  }

  setPosition(data) {
    if (data.p && data.v && valid.vector(data.p) && valid.vector(data.v)) {
      this.state.set({p: data.p, v: data.v});
      this.onAction(ACTION.MOVE, this.id, null);
    }
  }

  mute() {
    // mute player for spamming
    this.muted.state = true;
    this.muted.time = (new Date()).getTime() + this.muted.timeout * 1000;
    this.muted.timeout += Config.server.userMuteTimeoutIncrement;
  }

  isMuted() {
    // check if still muted
    if (this.muted.state) {
      this.muted.state = (new Date()).getTime() <= this.muted.time;
    }

    return this.muted.state;
  }
}

export { User };