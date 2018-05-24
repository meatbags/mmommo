/*
 * SessionToken
 * -- create & register session tokens
 */

import * as crypto from 'crypto';

class SessionToken {
  constructor() {
    this.tokens = {};
  }

  register(hex) {
    this.tokens[hex] = true;
  }

  deregister(hex) {
    delete this.tokens[hex];
  }

  getUnique() {
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    var hex = hash.digest('hex');

    // collision
    while (this.tokens[hex] !== undefined) {
      hash.update(Math.random().toString());
      hex = hash.digest('hex');
    }

    this.register(hex);
    return hex;
  }
}

export { SessionToken };
