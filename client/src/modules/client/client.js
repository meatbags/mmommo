import { ACTION, ClientState, Config } from '../../../../shared';
import { Socket, PacketUtils, Emitter } from './network';
import { Player, PeerManager } from './players';
import { Console, HUD, NamePicker, ColourPicker } from './ui';

class Client {
  constructor(url) {
    // handle server connection and player input
    this.url = url;
    this.state = new ClientState();

    // ui/ utils
    this.namePicker = new NamePicker(this);
    this.colourPicker = new ColourPicker(this);
    this.console = new Console(this);
    this.hud = new HUD();
    this.socket = new Socket(this);
    this.packet = new PacketUtils(this.socket.getSocket());
    this.player = new Player();
    this.peerManager = new PeerManager();
    this.emitter = new Emitter(this);
  }

  init(scene) {
    // hook up to scene
    this.colourGrid = scene.colourGrid;

    // actions
    this.on = {};
    this.on[ACTION.PEERS] = data => { this.peerManager.handleData(data); };
    this.on[ACTION.PAINT] = data => { this.colourGrid.drawPixelArray(data); };
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
    this.on[ACTION.MAP] = data => { this.colourGrid.parseMap(data); };
  }

  onConnect() {
    // on new or reset connection
    this.peerManager.purge();
    this.packet.setSocket(this.socket.getSocket());

    // dev
    this.namePicker.force('dev');
    this.colourPicker.random();
  }

  handleMessage(e) {
    // process messages from server
    if (typeof(e.data) == 'string') {
      const res = JSON.parse(e.data);

      if (this.on[res.type]) {
        this.on[res.type](res.data);
      }
    } else {
      // binary data -- ArrayBuffer
      // const uint8 = new Uint8Array(e.data);
      // const str = String.fromCharCode.apply(null, uint8);
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
    this.packet.sendSetName(name);
  }

  setColour(colour) {
    this.state.set({colour: colour});
    this.player.colour = colour;
    this.packet.sendSetColour(colour);
  }
}

export { Client };
