import { ACTION, ClientState, Config } from '../../../../shared';
import { Socket, PacketUtils, Emitter } from './connexion';
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
    this.emitter = new Emitter(this);

    // colour grid target
    this.grid = null;
  }

  onConnect() {
    // on new or reset connection
    this.peerManager.purge();
    this.packet.setSocket(this.socket.getSocket());
    this.namePicker.force('dev');
  }

  handleMessage(e) {
    // process message from server
    const res = JSON.parse(e.data);

    switch (res.type) {
      case ACTION.PEERS: {
        this.peerManager.handleData(res.data);
        break;
      }
      case ACTION.PAINT: {
        this.grid.drawPixelArray(res.data);
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
    this.emitter.update(delta);
  }

  setName(name) {
    this.state.set({name: name});
    this.player.name = name;
  }

  setGrid(grid) {
    this.grid = grid;
  }

  getPlayer() {
    return this.player;
  }

  getPeers() {
    return this.peerManager;
  }
}

export { Client };
