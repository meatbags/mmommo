import { Config } from '../../../../shared';
import { toColourString } from '../utils';

class ColourGrid {
  constructor(scene) {
    this.scene = scene;
    this.size = Config.global.grid.size;
    this.step = Config.global.grid.step;
    this.width = this.height = this.size * this.step;
    this.map = null;
    this.mapped = false;
    this.cache = [];

    // 2d canvas & offscreen buffer
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.buffer = document.createElement('canvas');
    this.bufferCtx = this.buffer.getContext('2d');
    this.cvs.width = this.buffer.width = this.size;
    this.cvs.height = this.buffer.height = this.size;
    this.imageData = this.ctx.getImageData(0, 0, this.size, this.size);
    this.swapBuffer = false;
    this.target = document.querySelector('#map-target');
    this.target.appendChild(this.cvs);
    this.clear();

    // world objects
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(this.width, this.height),
      new THREE.MeshBasicMaterial({})
    );
    this.plane.material.map = new THREE.Texture(this.cvs);
    this.plane.material.map.magFilter = THREE.NearestFilter;
    //this.plane.material.map.generateMipmaps = false;
    this.plane.material.map.needsUpdate = true;
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = 0;
    this.scene.add(this.plane);
  }

  clear() {
    this.bufferCtx.fillStyle = '#fff';
    this.bufferCtx.fillRect(0, 0, this.size, this.size);
    this.bufferCtx.fillStyle = '#aaa';
    for (var x=0, xlim=this.size; x<xlim; ++x) {
      for (var y=0, ylim=this.size; y<ylim; ++y) {
        if ((x + y) % 2 == 0) {
          this.bufferCtx.fillRect(x, y, 1, 1);
        }
      }
    }
    this.swapBuffer = true;
  }

  drawPixelArray(data) {
    for (var i=0, len=data.length; i<len; ++i) {
      this.setPixel(data[i].x, data[i].y, data[i].colour);
    }
    this.swapBuffer = true;
  }

  setPixel(x, y, colour) {
    // draw pixel to canvas
    if (this.inBounds(x, y)) {
      this.bufferCtx.fillStyle = toColourString(colour);
      this.bufferCtx.fillRect(x, y, 1, 1);

      // update image data
      const index = this.getIndex(x, y);

      if (index + 3 < this.imageData.data.length) {
        this.imageData.data[index] = colour >> 16 & 0xff;
        this.imageData.data[index + 1] = colour >> 8 & 0xff;
        this.imageData.data[index + 2] = colour & 0xff;
      }

      // save pixel if map not received
      if (!this.mapped) {
        this.cache.push({x: x, y: y, colour: colour});
      }
    }
  }

  getIndex(x, y) {
    return (y * this.size + x) << 2;
  }

  getPixel(x, y) {
    // get pixel value from image data
    const index = this.getIndex(x, y);

    if (index > -1 && index + 3 < this.imageData.data.length) {
      const r = this.imageData.data[index];
      const g = this.imageData.data[index + 1];
      const b = this.imageData.data[index + 2];
      return ((r << 16) + (g << 8) + (b));
    } else {
      return null;
    }
  }

  parseMap(src) {
    src = 'data:image/png;base64,' + btoa(src);
    this.clear();

    // draw image, reset image data & history
    this.map = new Image();
    this.map.onload = () => {
      // write image, draw cached, reset, get image data, flag for redraw
      console.log('Map size ~', src.length);
      this.bufferCtx.drawImage(this.map, 0, 0);
      this.history = {};
      this.mapped = true;

      for (var i=this.cache.length-1; i>-1; --i) {
        this.setPixel(this.cache[i].x, this.cache[i].y, this.cache[i].colour);
        this.cache.splice(i, 1);
      }

      this.imageData = this.bufferCtx.getImageData(0, 0, this.size, this.size);
      this.swapBuffer = true;
    }
    this.map.src = src;
  }

  inBounds(x, y) {
    return (x > -1 && y > -1 && x < this.size && y < this.size);
  }

  update() {
    if (this.swapBuffer) {
      this.ctx.drawImage(this.buffer, 0, 0);
      this.plane.material.map.needsUpdate = true;
      this.swapBuffer = false;
    }
  }
}

export { ColourGrid };
