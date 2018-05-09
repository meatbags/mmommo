class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
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
