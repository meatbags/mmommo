import { Config } from '../../../../shared';

class Grid {
  constructor(scene) {
    this.scene = scene;
    this.size = Config.global.grid.size;
    this.step = Config.global.grid.step;
    this.width = this.height = this.size * this.step;
    this.init2d();
    this.init3d();

    // dev
    this.setPixel(this.size/2, this.size/2 + 2, '#f00');
    this.setPixel(this.size/2 + 1, this.size/2 + 3, '#f00');
  }

  init2d() {
    // 2d canvas
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = this.size;
    this.cvs.height = this.size;
    this.imageData = this.ctx.getImageData(0, 0, this.cvs.width, this.cvs.height);
    this.history = {};
  }

  drawPixelArray(data) {
    for (var i=0, len=data.length; i<len; ++i) {
      this.setPixel(data[i].x, data[i].y, data[i].colour);
    }
  }

  setPixel(x, y, colour) {
    // draw pixel to canvas
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(x, y, 1, 1);

    // flag texture
    this.plane.material.map.needsUpdate = true;

    // history
    const xkey = x.toString();
    const ykey = y.toString();

    if (!this.history[xkey]) {
      this.history[xkey] = {};
    }

    this.history[xkey][ykey] = colour;
  }

  getPixel(x, y) {
    // get pixel value from history or imageData
    const xkey = x.toString();
    const ykey = y.toString();

    if (this.history[xkey] && this.history[xkey][ykey]) {
      return this.history[xkey][ykey];
    } else {
      const index = y * this.size + x;

      if (index > -1 && index + 3 < this.imageData.data.length) {
        const r = this.imageData.data[index];
        const g = this.imageData.data[index + 1];
        const b = this.imageData.data[index + 2];
        return ((r << 16) + (g << 8) + (b));
      } else {
        return null;
      }
    }
  }

  drawImage(img) {
    // draw image, reset image data & history
    this.ctx.drawImage(img, 0, 0);
    this.imageData = this.ctx.getImageData(0, 0, this.cvs.width, this.cvs.height);
    this.history = {};
  }

  init3d() {
    // canvas texture plane
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(this.width, this.height),
      new THREE.MeshBasicMaterial({})
    );
    this.plane.material.map = new THREE.Texture(this.cvs);
    this.plane.material.map.magFilter = THREE.NearestFilter;
    this.plane.material.map.needsUpdate = true;
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = 0;
    this.scene.add(this.plane);
  }

  update() {
    // ?
  }
}

export { Grid };
