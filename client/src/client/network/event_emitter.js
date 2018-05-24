/*
 * EventEmitter
 * -- emits event at regular intervals
 */

class EventEmitter {
  constructor(rate, period, event) {
    this.rate = rate;
    this.period = period;
    this.interval = period / rate;
    this.age = this.interval;
    this.event = event;
  }

  update(delta) {
    this.age += delta;
    if (this.age >= this.interval) {
      this.age -= this.interval;
      this.event();
    }
  }
}

export { EventEmitter };
