class Timer {
  constructor() {
    this.now = (new Date()).getTime();
    this.delta = 0;
  }

  update() {
    var t = (new Date()).getTime();
    this.delta = (t - this.now) / 1000.;
    this.now = t;
    return this.delta;
  }
}

export { Timer };
