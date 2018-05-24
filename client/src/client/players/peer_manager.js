/*
 * PeerManager
 * -- manage positions/ attributes of peers
 * -- update peers from server instructions
 */

import { Peer } from './peer';

class PeerManager {
  constructor() {
    // container for peer positions, labels, colours
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

        // update position
        if (this.reset) {
          this.reset = false;
          this.peers[id].setInitialPosition(data[i]);
        } else {
          this.peers[id].updatePosition(data[i]);
        }

        // set name, colour
        if (this.peers[id].name != data[i].name) {
          this.peers[id].name = data[i].name;
        }
        if (this.peers[id].colour != data[i].colour) {
          this.peers[id].colour = data[i].colour;
        }
      }
    }
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

  getColoursInCell(x, y) {
    const keys = Object.keys(this.peers);
    const arr = [];

    for (var i=0, len=keys.length; i<len; ++i) {
      if (keys[i] != this.id) {
        const peer = this.peers[keys[i]];
        if (peer.cell.x == x && peer.cell.y == y && peer.colour != null) {
          arr.push(peer.colour);
        }
      }
    }

    return arr;
  }
}

export { PeerManager };
