import { ACTION, ClientState, Vector, Config } from '../../../../shared';
import { RateLimiter } from '../utils';
import * as valid from '../utils/validation';

class User {
  constructor(client, id, onAction) {
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
    this.onAction = onAction;
    this.initActions();
    this.client = client;
    this.client.on('message', (msg) => { this.onMessage(msg); });
    this.client.on('close', (conn) => { this.onAction(ACTION.CONNECTION_CLOSED, this.id, null); });
  }

  sendMessage(type, data) {
    this.client.sendUTF(
      JSON.stringify({type: type, data: data})
    );
  }

  initActions() {
    this.on = {};
    this.on[ACTION.MOVE] = data => { this.setPosition(data); };
    this.on[ACTION.PAINT] = data => { this.setPaint(data); };
    this.on[ACTION.MESSAGE] = data => { this.setChatMessage(data); };
    this.on[ACTION.SET_NAME] = data => { this.setName(data); };
    this.on[ACTION.STATE] = data => {
      this.setName(data);
      this.setPosition(data);
    };
    this.on[ACTION.PING] = data => {
      if (data.timestamp) {
        this.onAction(ACTION.PING, this.id, data.timestamp);
      }
    };
    this.on[ACTION.PONG] = data => {};

    // valid actions
    this.actionRegister = Object.keys(this.on);
  }

  onMessage(msg) {
    // validate client messages
    if (this.rate.request.inLimit() && valid.request(msg)) {
      try {
        const res = JSON.parse(msg.utf8Data);

        if (res.type && res.data && this.actionRegister.indexOf(res.type) != -1) {
          this.on[res.type](res.data);
        }
      } catch(e) {
        // invalid req
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

  setPaint(data) {
    if (
      valid.int(data.x) && valid.int(data.y) &&
      valid.colour(data.colour) &&
      valid.bounds(data.x, data.y)
    ) {
      this.onAction(ACTION.PAINT, this.id, {x: data.x, y: data.y, colour: data.colour});
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
