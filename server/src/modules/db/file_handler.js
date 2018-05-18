import { Config } from '../../../../shared';
import * as fs from 'fs';
import { PNG as PNG } from 'pngjs';

class FileHandler {
  constructor() {
    // handle image data
    this.size = Config.global.grid.size;
    this.path = './img/map.png';
    this.buffer = false;
    this.saveLock = false;
    this.pngOptions = {width: this.size, height: this.size, colorType: 2};

    // read map from file
    fs.readFile(this.path, (err, data) => {
      if (err) {
        console.log('Error reading file.');
        this.createNewImage();
      } else {
        console.log('File read. Parsing data.');
        this.setImage(data);
      }
    });
  }

  parseBuffer() {
    this.buffer = PNG.sync.write(this.image, this.pngOptions);
    console.log(this.buffer);
  }

  createNewImage() {
    console.log('Creating new image file.');
    this.image = new PNG(this.pngOptions);
    this.save();
  }

  getBuffer() {
    return this.buffer;
  }

  setImage(data) {
    if (data.length) {
      this.image = new PNG(this.pngOptions).parse(data, (err, res) => {
        if (err || this.image.width != this.size) {
          this.createNewImage();
        } else {
          this.parseBuffer();
          console.log('Done.');
        }
      });
    } else {
      this.createNewImage();
    }
  }

  putPixel(x, y, colour) {
    // write pixel to image buffer
    const index = (this.image.width * y + x) << 2;

    if (index + 3 < this.image.data.length) {
      this.image.data[index] = colour >> 16 & 0xff;
      this.image.data[index + 1] = colour >> 8 & 0xff;
      this.image.data[index + 2] = colour & 0xff;
    }
  }

  writeData(data, onComplete) {
    // write data & save
    const xkey = Object.keys(data);

    for (var i=0, len=xkey.length; i<len; ++i) {
      const x = xkey[i];
      const xint = parseInt(x);
      const ykey = Object.keys(data[x]);

      for (var j=0, jlen=ykey.length; j<jlen; ++j) {
        const y = ykey[j];
        const yint = parseInt(y);
        this.putPixel(xint, yint, data[x][y]);
      }
    }

    // save
    this.save(onComplete);
  }

  save(onComplete) {
    // save to file
    if (!this.saveLock) {
      this.saveLock = true;
      this.onComplete = onComplete || null;
      this.parseBuffer();
      console.log('Saving file.');

      fs.writeFile(this.path, this.buffer, (err) => {
        if (err) throw err;

        console.log('Saved.');
        this.saveLock = false;
        if (this.onComplete) {
          this.onComplete();
        }
      });
    }
  }
}

export { FileHandler };
