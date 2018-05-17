import { Config } from '../../../../shared';
import { FileHandler } from './file_handler';

class ColourGrid {
  constructor() {
    this.file = new FileHandler();
    this.changesCount = 0;
    this.changesPerSave = 10;
    this.size = Config.global.grid.size;
    this.imageData = {};
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
      this.changed.push(data);

      // save image to file
      if (++this.changesCount >= this.changesPerSave) {
        this.changesCount = 0;
        this.save();
      }

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

      for (var j=0, jlen=ykey.length; j<jlen; ++j) {
        const y = ykey[j];
        data.push({
          x: parseInt(x),
          y: parseInt(y),
          colour: this.imageData[x][y]
        });
      }
    }

    return data;
  }

  save() {
    this.file.writeData(this.imageData, () => {
      this.imageData = {};
    });
  }

  getMap() {
    return this.file.getBuffer();
  }

  getChanged() {
    return this.changed;
  }

  flush() {
    this.changed = [];
  }
}

export { ColourGrid };
