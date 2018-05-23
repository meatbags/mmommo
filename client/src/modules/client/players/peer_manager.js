import { Peer } from './peer';

class PeerManager {
  constructor() {
    this.id = null;
    this.peers = {};
    this.peerCount = 0;
    this.reset = true;
  }

  setMyId(id) {
    this.id = id;
  }

  getCount() {
    return this.peerCount;
  }

  getKeys() {
    return Object.keys(this.peers);
  }

  getPeer(key) {
    return this.peers[key];
  }

  purge() {
    // reset everything
    this.id = null;
    this.peers = {};
    this.peerCount = 0;
    this.reset = true;
  }

  add(id) {
    if (id != this.id) {
      this.peers[id] = new Peer(id);
      this.peerCount += 1;
    }
  }

  remove(id) {
    if (this.peers[id]) {
      this.peerCount -= 1;
      delete this.peers[id];
    }
  }

  update(delta) {
    const keys = Object.keys(this.peers);

    for (var i=0, len=keys.length; i<len; ++i) {
      this.peers[keys[i]].update(delta);
    }
  }

  handlePeerDisconnect(data) {
    this.remove(data.id);
  }

  handleData(data) {
    // handle server state packet
    for (var i=0, len=data.length; i<len; ++i) {
      const id = data[i].id;

      if (id != this.id) {
        if (!this.peers[id]) {
          this.add(id);
        }

        // set position, name, colour
        if (this.reset) {
          this.reset = false;
          this.peers[id].setInitialPosition(data[i]);
        } else {
          this.peers[id].updatePosition(data[i]);
        }

        if (this.peers[id].name != data[i].name) {
          this.peers[id].setName(data[i].name);
        }
        
        if (this.peers[id].colour != data[i].colour) {
          this.peers[id].setColour(data[i].colour);
        }
      }
    }
  }
}

export { PeerManager };
