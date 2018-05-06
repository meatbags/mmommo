class Timer {
  constructor() {
    this.now = (new Date()).getTime();
    this.delta = 0;
  }

  getDelta() {
    return this.delta;
  }

  update() {
    var t = (new Date()).getTime();
    this.delta = (t - this.now) / 1000.;
    this.now = t;
  }
}

export { Timer };
