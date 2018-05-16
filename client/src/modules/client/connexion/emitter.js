import { EventEmitter } from './event_emitter';
import { Config } from '../../../../../shared';

class Emitter {
  constructor(client) {
    // handle emitters
    this.client = client;
    this.config = Config.client;

    // ping
    this.pingEmitter = new EventEmitter(
      this.config.emitPingRate,
      this.config.emitPingPeriod,
      () => { this.ping(); }
    );

    // position
    this.positionEmitter = new EventEmitter(
      Config.client.emitMovementRate,
      Config.client.emitMovementPeriod,
      () => { this.move(); }
    );
  }

  ping() {
    // ping server
    this.client.packet.sendPing();
  }

  move() {
    // send position
    if (this.client.player.changed()) {
      this.client.state.set({p: this.client.player.position, v: this.client.player.motion});
      this.client.packet.sendMove(this.client.state.get('p'), this.client.state.get('v'));
    }

    // send new grid-point
    if (this.client.player.inNewGridCell()) {
      const cell = this.client.player.getGridCell();
      const colour = this.client.grid.getPixel(cell.x, cell.y);

      if (colour != null && colour != this.client.player.colour) {
        this.client.packet.sendPaint(cell.x, cell.y, this.client.player.colour);
      }
    }
  }

  update(delta) {
    this.pingEmitter.update(delta);
    this.positionEmitter.update(delta);
  }
}

export { Emitter };
