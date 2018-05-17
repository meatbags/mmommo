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
    this.handleActions();
  }

  onConnect() {
    // on new or reset connection
    this.peerManager.purge();
    this.packet.setSocket(this.socket.getSocket());
    this.namePicker.force('dev');
    this.state.set({colour: 0x0f0f0f});
  }

  handleMessage(e) {
    // process messages from server
    if (typeof(e.data) == 'string') {
      const res = JSON.parse(e.data);

      if (this.on[res.type]) {
        this.on[res.type](res.data);
      }
    } else {
      // binary map data
      if (e.data instanceof ArrayBuffer) {
        const uint8 = new Uint8Array(e.data);
        const b64 = btoa(String.fromCharCode.apply(null, uint8));
        const src = 'data:image/png;base64,' + b64;
        this.grid.parseMap(src);
      }
    }
  }

  handleActions() {
    this.on = {};
    this.on[ACTION.PEERS] = data => { this.peerManager.handleData(data); };
    this.on[ACTION.PAINT] = data => { this.grid.drawPixelArray(data); };
    this.on[ACTION.STATE_REQUEST] = data => { this.packet.sendState(this.state.getPartJSON(data)); };
    this.on[ACTION.MESSAGE] = data => { this.console.printMessage(data.from, data.message); };
    this.on[ACTION.NOTICE] = data => { this.console.printNotice(data.message); };
    this.on[ACTION.PEER_DISCONNECT] = data => { this.peerManager.handlePeerDisconnect(data); };
    this.on[ACTION.STATE] = data => {
      this.state.set(data);
      this.peerManager.setMyId(this.state.get('id'));
    };
    this.on[ACTION.PING] = data => { this.packet.sendPong(); };
    this.on[ACTION.PONG] = data => { this.state.set({ping: (new Date()) - (new Date(data.timestamp))}); }
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
