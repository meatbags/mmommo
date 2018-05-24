import * as crypto from 'crypto';

class SessionToken {
  constructor() {
    this.tokens = {};
  }

  register(hex) {
    this.tokens[hex] = true;
  }
  
  unregister(hex) {
    delete this.tokens[hex];
  }

  exists(hex) {
    return (this.tokens[hex] !== undefined);
  }

  getUnique() {
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    let hex = hash.digest('hex');

    // prevent collision
    while (this.exists(hex)) {
      hash.update(Math.random().toString());
      hex = hash.digest('hex');
    }

    this.register(hex);
    return hex;
  }
}

export { SessionToken };
