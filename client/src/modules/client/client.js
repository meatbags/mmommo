import { ACTION } from '../../../../shared';
import { Socket, PacketUtils, EventEmitter } from './connexion';
import { Player, PeerManager } from './players';
import { Chat, HUD } from './interface';

class Client {
  constructor(url) {
    // handle server connection and player input
    this.url = url;
    this.id = null;

    // hook up
    this.chat = new Chat((action, data) => { this.onChat(action, data); });
    this.socket = new Socket(this.url, this.chat, () => { this.onConnect(); }, (e) => { this.onMessage(e); });
    this.packet = new PacketUtils(this.socket.getSocket());
    this.hud = new HUD();
    
    // input
    this.rate = 1;
    this.rateInterval = 1;
    this.player = new Player();
    this.peerManager = new PeerManager();
    this.movementEmitter = new EventEmitter(this.rateInterval, () => {
      if (this.player.changed()) {
        this.packet.sendMove(this.player.position, this.player.motion);
      }
    });
  }

  onConnect() {
    // reset connection
    this.peerManager.purge();
    this.packet.setSocket(this.socket.getSocket());
  }

  onMessage(e) {
    // process message from server
    const res = JSON.parse(e.data);

    switch (res.type) {
      case ACTION.PEERS: {
        this.peerManager.handlePositionData(res.data);
        break;
      }
      case ACTION.MESSAGE: {
        this.chat.printMessage(res.data.from, res.data.message);
        break;
      }
      case ACTION.NOTICE: {
        this.chat.printNotice(res.data.message);
        break;
      }
      case ACTION.PEER_SET_NAME: {
        this.peerManager.handleNameData(res.data);
        break;
      }
      case ACTION.PEER_DISCONNECT: {
        this.peerManager.handlePeerDisconnect(res.data);
        break;
      }
      case ACTION.PING: {
        console.log('Ping', res.data);
        this.id = res.data.id;
        this.rate = res.data.rate;
        this.rateInterval = 1 / this.rate;
        this.movementEmitter.setInterval(this.rateInterval);
        this.peerManager.setMyId(this.id);
        this.peerManager.handleStateData(res.data.peers);

        // send pong back
        this.packet.sendPong(this);
        break;
      }
      default: {
        break;
      }
    }
  }

  onChat(action, data) {
    // process chat action
    switch (action) {
      case ACTION.MESSAGE: {
        this.packet.sendMessage(data);
        break;
      }
      case ACTION.SET_NAME: {
        if (this.packet.sendSetName(data)) {
          this.chat.setName(data);
        } else {
          var target = this.chat.el.nameForm.querySelector('.form-window__notice');
          target.innerHTML = '<br />Awaiting connection.';
        }
        break;
      }
      case ACTION.DISABLE_INPUT: {
        this.player.disableInput();
        break;
      }
      case ACTION.ENABLE_INPUT: {
        this.player.enableInput();
        break;
      }
      default: {
        break;
      }
    }
  }

  update(delta) {
    this.player.update(delta);
    this.movementEmitter.update(delta);
    this.peerManager.update(delta);
  }
}

export { Client };
