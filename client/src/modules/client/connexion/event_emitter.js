class EventEmitter {
  constructor(interval, event) {
    this.age = 0;
    this.interval = interval;
    this.event = event;
  }

  setInterval(s) {
    this.interval = s;
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
