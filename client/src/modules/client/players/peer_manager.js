import { Peer } from './peer';

class PeerManager {
  constructor() {
    this.id = null;
    this.peers = {};
    this.peerCount = 0;
  }

  setMyId(id) {
    this.id = id;
  }

  purge() {
    // reset everything
    this.id = null;
    this.peers = {};
    this.peerCount = 0;
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

  handleNameData(data) {
    // handle server name packet
    for (var i=0, len=data.length; i<len; ++i) {
      const id = data[i].id;

      if (id != this.id) {
        if (!this.peers[id]) {
          this.add(id);
        }

        this.peers[id].setName(data[i].name);
      }
    }
  }

  handlePositionData(data) {
    // handle server position packet
    for (var i=0, len=data.length; i<len; ++i) {
      const id = data[i].id;

      if (id != this.id) {
        if (!this.peers[id]) {
          this.add(id);
        }

        this.peers[id].setPosition(data[i]);
      }
    }
  }
}

export { PeerManager };
