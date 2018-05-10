import { ACTION } from '../../../../shared';
import { Socket, PacketUtils, EventEmitter } from './connexion';
import { Player, PeerManager } from './players';
import { Console, HUD, NamePicker } from './interface';

class Client {
  constructor(url) {
    // handle server connection and player input
    this.url = url;
    this.state = {
      id: null,
      name: '',
      rate: 1,
      rateInterval: 1
    };

    // hook up ui
    this.namePicker = new NamePicker(this);
    this.console = new Console(this);
    this.hud = new HUD();

    // sockets
    this.socket = new Socket(this);
    this.packet = new PacketUtils(this.socket.getSocket());

    // input
    this.player = new Player();
    this.peerManager = new PeerManager();
    this.movementEmitter = new EventEmitter(this.state.rateInterval, () => {
      if (this.player.changed()) {
        this.packet.sendMove(this.player.position, this.player.motion);
      }
    });

    // dev mode
    //setTimeout(() => { this.namePicker.force('Test'); }, 250);
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
        this.peerManager.handlePositionData(res.data);
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

        // set state
        this.setState({
          id: res.data.id,
          rate: res.data.rate,
          rateInterval: 1 / res.data.rate
        });
        this.movementEmitter.setInterval(this.state.rateInterval);
        this.peerManager.setMyId(this.state.id);
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

  setState(state) {
    const keys = Object.keys(state);

    for (var i=0, len=keys.length; i<len; ++i) {
      this.state[keys[i]] = state[keys[i]];
    }
  }

  getState() {
    const state = {};
    const keys = Object.keys(this.state);

    for (var i=0, len=keys.length; i<len; ++i) {
      state[keys[i]] = this.state[keys[i]];
    }

    return state;
  }

  disableInput() {
    this.player.disableInput();
  }

  enableInput() {
    this.player.enableInput();
  }

  update(delta) {
    this.player.update(delta);
    this.movementEmitter.update(delta);
    this.peerManager.update(delta);
  }
}

export { Client };
