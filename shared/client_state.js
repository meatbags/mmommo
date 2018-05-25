import { Vector } from './vector';
import { Config } from './config';

class ClientState {
  constructor() {
    this.state = {
      id: null,
      name: '',
      p: new Vector(0, 0, 0),
      v: new Vector(0, 0, 0),
      colour: null,
      ping: '...',
      cellsColoured: 0
    };
  }

  set(state) {
    const keys = Object.keys(state);

    for (var i=0, len=keys.length; i<len; ++i) {
      const k = keys[i];
      if (k == 'p' || k == 'v') {
        this.state[k].set(state[k]);
      } else {
        this.state[k] = state[k];
      }
    }
  }

  get(key) {
    if (key == 'p' || key == 'v') {
      return this.state[key].getJSON();
    } else {
      return this.state[key];
    }
  }

  getPartJSON(keys) {
    const state = {};

    for (var i=0, len=keys.length; i<len; ++i) {
      state[keys[i]] = this.get(keys[i]);
    }

    return state;
  }

  getJSON() {
    const state = {};
    const keys = Object.keys(this.state);

    for (var i=0, len=keys.length; i<len; ++i) {
      state[keys[i]] = this.get(keys[i]);
    }

    return state;
  }
}

export { ClientState };
