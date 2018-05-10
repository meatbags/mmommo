class RateLimiter {
  constructor(rate, period) {
    this.stamps = [];
    this.setRate(rate, period);
  }

  setRate(rate, period) {
    this.rate = rate;
    this.period = period;
    this.average = this.rate / this.period;
    this.ms = period * 1000;
  }

  inLimit() {
    // check num requests in time period
    const t = new Date();

    for (var i=this.stamps.length-1, end=-1; i>end; --i) {
      if (t - this.stamps[i] > this.ms) {
        this.stamps.splice(0, i + 1);
        break;
      }
    }

    if (this.stamps.length <= this.rate) {
      this.stamps.push(t);
      return true;
    } else {
      return false;
    }
  }

  getRate() {
    return this.average;
  }
}

export { RateLimiter };
