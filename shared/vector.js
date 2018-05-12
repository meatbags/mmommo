class Vector {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  set(vec) {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
  }

  getJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    }
  }
}

export { Vector };
