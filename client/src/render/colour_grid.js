/*
 * ColourGrid
 * -- interactive colour grid
 * -- hook texture to world objects
 * -- display minimap & full artwork
 */

import { Config } from '../../../shared';
import { toColourString } from '../utils';

class ColourGrid {
  constructor(scene, client) {
    this.scene = scene;
    this.client = client;
    this.size = Config.global.grid.size;
    this.step = Config.global.grid.step;
    this.width = this.height = this.size * this.step;
    this.map = null;
    this.mapped = false;
    this.cache = [];

    // buffer & map displays
    this.frameAge = 0;
    this.frameInterval = 1 / 20;
    this.swapBuffer = false;
    this.buffer = document.createElement('canvas');
    this.minimap = document.createElement('canvas');
    this.artwork = document.createElement('canvas');
    this.bufferCtx = this.buffer.getContext('2d');
    this.minimapCtx = this.minimap.getContext('2d');
    this.artworkCtx = this.artwork.getContext('2d');
    this.buffer.width = this.size;
    this.buffer.height = this.size;
    this.artwork.width = this.size;
    this.artwork.height = this.size;
    this.imageData = this.bufferCtx.getImageData(0, 0, this.size, this.size);

    // add to doc
    this.minimapTarget = document.querySelector('#map-target');
    this.artworkTarget = document.querySelector('#artwork-target');
    this.artworkOverlay = document.querySelector('.artwork-overlay');
    const rect = this.minimapTarget.getBoundingClientRect();
    this.minimap.width = Math.floor(rect.width);
    this.minimap.height = Math.floor(rect.height);
    this.minimapTarget.appendChild(this.minimap);
    this.artworkTarget.appendChild(this.artwork);
    this.toggleArtwork = () => {
      this.artworkOverlay.style.top = (window.innerHeight / 2 - this.size / 2 - 32) + 'px';
      this.artworkOverlay.style.left = ((window.innerWidth - 300) / 2 - this.size / 2 - 12) + 'px';
      this.artworkOverlay.classList.toggle('active');
    };
    this.minimap.onclick = () => { this.toggleArtwork(); };
    //this.artworkOverlay.onclick = () => { this.toggleArtwork(); };
    document.querySelector('#artwork-close').onclick = () => { this.toggleArtwork(); };

    // disable all smoothing
    //this.minimapCtx.mozImageSmoothingEnabled = false;
    this.minimapCtx.webkitImageSmoothingEnabled = false;
    this.minimapCtx.msImageSmoothingEnabled = false;
    this.minimapCtx.imageSmoothingEnabled = false;
    //this.artworkCtx.mozImageSmoothingEnabled = false;
    this.artworkCtx.webkitImageSmoothingEnabled = false;
    this.artworkCtx.msImageSmoothingEnabled = false;
    this.artworkCtx.imageSmoothingEnabled = false;

    // world object
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.height), new THREE.MeshBasicMaterial({}));
    this.plane.material.map = new THREE.Texture(this.buffer);
    this.plane.material.map.magFilter = THREE.NearestFilter;
    this.plane.material.map.needsUpdate = true;
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = 0;
    this.scene.add(this.plane);

    // prep
    this.clear();
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
      //console.log('Map size ~', src.length);
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

  renderDisplay(delta) {
    // render buffer canvas to 2d screen display
    this.frameAge += delta;

    if (this.frameAge >= this.frameInterval) {
      this.frameAge = 0;
      if (this.artworkOverlay.classList.contains('active')) {
        // refresh artwork overlay
        this.artworkCtx.drawImage(this.buffer, 0, 0);
      } else {
        // refresh minimap
        this.minimapCtx.fillStyle = '#000';
        this.minimapCtx.strokeStyle = '#22f';
        var scale = 7;
        var cx = this.minimap.width / 2;
        var cy = this.minimap.height / 2;
        //var x = cx - this.client.player.cell.x * scale;
        //var y = cy - this.client.player.cell.y * scale;
        var x = cx - ((this.client.player.position.x + this.client.player.halfBound) / this.step) * scale;
        var y = cy - ((this.client.player.position.z + this.client.player.halfBound) / this.step) * scale;
        this.minimapCtx.fillRect(0, 0, this.minimap.width, this.minimap.height);
        this.minimapCtx.drawImage(this.buffer, x, y, this.buffer.width * scale, this.buffer.height * scale);
        this.minimapCtx.lineWidth = 2;
        cx += scale / 2;
        cy += scale / 2;
        this.minimapCtx.strokeRect(cx - scale, cy - scale, scale, scale);
      }
    }
  }

  update(delta) {
    if (this.swapBuffer) {
      this.plane.material.map.needsUpdate = true;
      this.swapBuffer = false;
    }
    this.renderDisplay(delta);
  }
}

export { ColourGrid };
