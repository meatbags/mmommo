/*
 * Client
 * -- handle connection & server req/ res
 * -- hook UI & player controls to server requests
 */

import { Config, ACTION, ClientState } from '../../../shared';
import { PacketUtils, Socket, EventEmitter } from './network';
import { Player, PeerManager } from './players';
import { ColourPicker, Console, Help, NamePicker } from './ui';
import { averageColours, getStatus } from '../utils';

class Client {
  constructor(url) {
    this.config = Config.client;
    this.url = url;
    this.state = new ClientState();

    // ui/ utils
    this.namePicker = new NamePicker(this);
    this.colourPicker = new ColourPicker(this);
    this.console = new Console(this);
    this.hud = new Help();
    this.socket = new Socket(this);
    this.packet = new PacketUtils(this.socket.getSocket());
    this.player = new Player();
    this.peerManager = new PeerManager();
    this.pingEmitter = new EventEmitter(this.config.emitPingRate, this.config.emitPingPeriod, () => { this.packet.sendPing(); });
    this.positionEmitter = new EventEmitter(this.config.emitMovementRate, this.config.emitMovementPeriod, () => { this.move(); });
  }

  init(scene, renderer) {
    // hook up to scene
    this.colourGrid = scene.colourGrid;
    this.player.init(renderer.renderer.domElement, scene.camera);

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

    // pick a colour
    this.colourPicker.setInitial();
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
    this.pingEmitter.update(delta);
    this.positionEmitter.update(delta);
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

  move() {
    // send position
    if (this.player.changed()) {
      this.state.set({p: this.player.position, v: this.player.motion});
      this.packet.sendMove(this.state.get('p'), this.state.get('v'));
    }

    // send new grid cell colour
    if (this.player.inNewGridCell()) {
      const cell = this.player.getGridCell();
      const cellColour = this.colourGrid.getPixel(cell.x, cell.y);
      const colour = this.state.get('colour');

      if (cellColour != null && colour != null && cellColour != colour) {
        // mix colour with nearby peers
        const mixed = averageColours(this.peerManager.getColoursInCell(cell.x, cell.y).concat(colour));
        this.packet.sendPaint(cell.x, cell.y, mixed);

        // local preemptive draw
        this.colourGrid.drawPixelArray([{x: cell.x, y: cell.y, colour: mixed}]);
        this.state.set({cellsColoured: this.state.get('cellsColoured') + 1});
        this.player.status = getStatus(this.state.get('cellsColoured'));
      }
    }
  }
}

export { Client };
