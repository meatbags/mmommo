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
    this.buffer = PNG.sync.write(this.image, {colourType: 2});
  }

  getBuffer() {
    return this.buffer;
  }

  createNewImage() {
    console.log('Creating new image file.');
    this.image = new PNG({width: this.size, height: this.size, colorType: 2});
    this.save(() => {});
  }

  setImage(data) {
    if (data.length) {
      this.image = new PNG({colorType: 2});
      this.image.parse(data, (err, data) => {
        if (err || this.image.width != this.size) {
          this.createNewImage();
        } else {
          this.parseBuffer();
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
    console.log(data);
    // write data & save
    const xkey = Object.keys(data);
    console.log(xkey);

    for (var i=0, len=xkey.length; i<len; ++i) {
      const x = xkey[i];
      const xint = parseInt(x);
      const ykey = Object.keys(data[x]);
      console.log(ykey);

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
      console.log('Saving file.');
      this.saveLock = true;
      this.parseBuffer();
      fs.writeFile(this.path, this.buffer, (err) => {
        this.saveLock = false;
        if (err) {
          console.log('Error savinge.')
        } else {
          console.log('Saved.');
        }
        onComplete();
      });
    }
  }
}

export { FileHandler };
