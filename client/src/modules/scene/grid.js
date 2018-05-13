import { Config } from '../../../../shared';

class Grid {
  constructor(scene) {
    this.scene = scene;
    this.size = Config.global.grid.size;
    this.step = Config.global.grid.step;
    this.width = this.height = this.size * this.step;
    this.matrix = [];
    const offset = (this.size * this.step) / 2 - this.step / 2;

    for (var x=0, len=this.size; x<len; ++x) {
      for (var z=0, len=this.size; z<len; ++z) {
        const cell = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(this.step, this.step),
          new THREE.MeshPhongMaterial({
            emissive: 0xffffff
          })
        );
        this.randomiseColour(cell.material.emissive);
        cell.rotation.x = -Math.PI / 2;
        cell.position.set(x * this.step - offset, -1, z * this.step - offset);
        this.matrix.push(cell);
        this.scene.add(cell);
      }
    }
  }

  HueToRGB(p, q, t) {
    // convert hue to RGB
    t += (t < 0) ? 1 : (t > 1) ? -1 : 0;

    if (t < 1/6) {
      return p + (q - p) * 6 * t;
    } else if (t < 0.5) {
      return q;
    } else if (t < 2/3) {
      return p + (q - p) * (2/3 - t) * 6;
    } else {
      return p;
    }
  };

  randomiseColour(c) {
    const S = 0;
    const L = Math.random();
    const H = 0;
    var r, b, g;

    if (S == 0){
      r = g = b = L;
    } else {
      const Q = (L < 0.5) ? L * (1 + S) : L + S - L * S;
      const P = 2 * L - Q;
      r = this.HueToRGB(P, Q, H + 1/3);
      g = this.HueToRGB(P, Q, H);
      b = this.HueToRGB(P, Q, H - 1/3);
    }

    c.setRGB(r, g, b);
  }

  update() {
    this.changeColour(
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size)
    );
  }

  changeColour(x, y) {
    const index = y * this.size + x;
    this.randomiseColour(this.matrix[index].material.emissive);
  }
}

export { Grid };
