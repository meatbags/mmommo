import { ACTION } from '../../../../shared';
import { Socket, PacketUtils } from './connexion';
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

    // create player input object
    this.player = new Player();
  }

  onConnect() {
    // reset connection
    this.peerManager = new PeerManager();
    this.packet.setSocket(this.socket.getSocket());
  }

  onMessage(e) {
    // process message from server
    const res = JSON.parse(e.data);

    switch (res.type) {
      case ACTION.MESSAGE: {
        this.chat.printMessage(res.data.from, res.data.message);
        break;
      }
      case ACTION.NOTICE: {
        this.chat.printNotice(res.data.message);
        break;
      }
      case ACTION.PING: {
        this.rate = res.data.rate;
        this.rateInterval = 1 / this.rate;
        this.id = res.data.id;
        console.log('Session', this.id);

        // send pong back
        const data = this.chat.isActive() ? {name: this.chat.getName()} : {};
        this.packet.sendPong(data);
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
}

export { Client };
