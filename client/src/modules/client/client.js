import { ACTION, ClientState, Config } from '../../../../shared';
import { Socket, PacketUtils, EventEmitter } from './connexion';
import { Player, PeerManager } from './players';
import { Console, HUD, NamePicker } from './interface';

class Client {
  constructor(url) {
    // handle server connection and player input
    this.url = url;
    this.state = new ClientState();

    // hook ui to socket
    this.namePicker = new NamePicker(this);
    this.console = new Console(this);
    this.hud = new HUD();
    this.socket = new Socket(this);
    this.packet = new PacketUtils(this.socket.getSocket());

    // input
    this.player = new Player();
    this.peerManager = new PeerManager();
    this.emitter = {
      ping: new EventEmitter(
        Config.client.emitPingRate,
        Config.client.emitPingPeriod,
        () => { this.packet.sendPing(); }
      ),
      movement: new EventEmitter(
        Config.client.emitMovementRate,
        Config.client.emitMovementPeriod,
        () => {
          if (this.player.changed()) {
            this.state.set({p: this.player.position, v: this.player.motion});
            this.packet.sendMove(this.state.get('p'), this.state.get('v'));
          }
        }
      )
    };
  }

  onConnect() {
    // on new or reset connection
    this.peerManager.purge();
    this.packet.setSocket(this.socket.getSocket());
  }

  handleMessage(e) {
    // process message from server
    const res = JSON.parse(e.data);

    switch (res.type) {
      case ACTION.PEERS: {
        this.peerManager.handleData(res.data);
        break;
      }
      case ACTION.STATE_REQUEST: {
        this.packet.sendState(this.state.getPartJSON(res.data));
        break;
      }
      case ACTION.MESSAGE: {
        this.console.printMessage(res.data.from, res.data.message);
        break;
      }
      case ACTION.NOTICE: {
        this.console.printNotice(res.data.message);
        break;
      }
      case ACTION.PEER_DISCONNECT: {
        this.peerManager.handlePeerDisconnect(res.data);
        break;
      }
      case ACTION.STATE: {
        this.state.set(res.data);
        this.peerManager.setMyId(this.state.get('id'));
        break;
      }
      case ACTION.PING: {
        this.packet.sendPong();
        break;
      }
      case ACTION.PONG: {
        this.state.set({ping: (new Date()) - (new Date(res.data.timestamp))});
        break;
      }
      default: {
        break;
      }
    }
  }

  update(delta) {
    this.player.update(delta);
    this.peerManager.update(delta);
    this.emitter.movement.update(delta);
    this.emitter.ping.update(delta);
  }
}

export { Client };
