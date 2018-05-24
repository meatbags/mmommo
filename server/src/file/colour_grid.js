import { Config } from '../../../shared';
import { FileHandler } from './file_handler';

class ColourGrid {
  constructor(root) {
    // the active colour grid (recent changes)
    this.root = root;
    this.file = new FileHandler();
    this.changes = {
      count: 0,
      perSaveBase: 10,
      perPlayer: 10
    };
    this.size = Config.global.grid.size;
    this.imageData = {};
    this.changed = [];
  }

  save() {
    // save data to file
    const data = this.getSessionImageData();
    this.file.writeToFile(data);

    // rm data
    this.imageData = {};
    this.changes.count = 0;
    this.changed = [];
  }

  setPixel(data) {
    const xkey = data.x.toString();
    const ykey = data.y.toString();

    if (!this.imageData[xkey]) {
      this.imageData[xkey] = {};
    }

    if (this.imageData[xkey][ykey] === undefined || this.imageData[xkey][ykey] !== data.colour) {
      this.imageData[xkey][ykey] = data.colour;

      // save image to file
      if (++this.changes.count >= this.changes.perSaveBase + this.root.clientCount * this.changes.perPlayer) {
        this.save();
      }

      this.changed.push(data);
      return true;
    } else {
      return false;
    }
  }

  getSessionImageData() {
    // get all image data
    const data = [];
    const xkey = Object.keys(this.imageData);

    for (var i=0, len=xkey.length; i<len; ++i) {
      const x = xkey[i];
      const ykey = Object.keys(this.imageData[x]);
      const xint = parseInt(x);

      for (var j=0, jlen=ykey.length; j<jlen; ++j) {
        const y = ykey[j];
        data.push({
          x: xint,
          y: parseInt(y),
          colour: this.imageData[x][y]
        });
      }
    }

    return data;
  }

  getImageSrc() {
    return this.file.getImageSrc();
  }

  getChanged() {
    return this.changed;
  }
}

export { ColourGrid };
