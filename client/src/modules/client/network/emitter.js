import { EventEmitter } from './event_emitter';
import { Config } from '../../../../../shared';

class Emitter {
  constructor(client) {
    // emit client events at regular intervals
    this.client = client;
    this.config = Config.client;

    // ping server
    this.pingEmitter = new EventEmitter(
      this.config.emitPingRate,
      this.config.emitPingPeriod,
      () => { this.ping(); }
    );

    // send movement data
    this.positionEmitter = new EventEmitter(
      Config.client.emitMovementRate,
      Config.client.emitMovementPeriod,
      () => { this.move(); }
    );
  }

  ping() {
    this.client.packet.sendPing();
  }

  move() {
    // send position
    if (this.client.player.changed()) {
      this.client.state.set({p: this.client.player.position, v: this.client.player.motion});
      this.client.packet.sendMove(this.client.state.get('p'), this.client.state.get('v'));
    }

    // send new grid cell colour
    if (this.client.player.inNewGridCell()) {
      const cell = this.client.player.getGridCell();
      const cellColour = this.client.colourGrid.getPixel(cell.x, cell.y);
      const colour = this.client.state.get('colour');

      if (cellColour != null && colour != null && cellColour != colour) {
        this.client.packet.sendPaint(cell.x, cell.y, colour);
        this.client.colourGrid.drawPixelArray([{
          x: cell.x,
          y: cell.y,
          colour: colour
        }]);
      }
    }
  }

  update(delta) {
    this.pingEmitter.update(delta);
    this.positionEmitter.update(delta);
  }
}

export { Emitter };
