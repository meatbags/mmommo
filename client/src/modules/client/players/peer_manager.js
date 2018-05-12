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

        // set position, name
        if (this.reset) {
          this.reset = false;
          this.peers[id].setInitialPosition(data[i]);
        } else {
          this.peers[id].updatePosition(data[i]);
        }

        if (this.peers[id].name != data[i].name) {
          this.peers[id].setName(data[i].name);
        }
      }
    }
  }
}

export { PeerManager };
