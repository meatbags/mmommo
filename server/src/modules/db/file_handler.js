import { Config } from '../../../../shared';
import * as fs from 'fs';
import { PNG as PNG } from 'pngjs';

class FileHandler {
  constructor() {
    this.size = Config.global.grid.size;
    this.path = './img/map.png';
    fs.readFile(this.path, (err, data) => {
      if (err) {
        this.newImage();
      } else {
        this.setImage(data);
      }
    });
  }

  setImage(data) {
    this.image = new PNG({}).parse(data, (err, data) => {
      if (err || this.image.width != this.size) {
        this.newImage();
      } else {
        this.putPixel(3, 3, 0xff0000);
        this.save(() => {});
      }
    });
  }

  newImage() {
    // create new RGB image
    this.image = new PNG({width: this.size, height: this.size, colorType: 2});
    this.save(() => {});
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

  writePixels(data) {
    const xkey = Object.keys(data);

    for (var i=0, len=xkey.length; i<len; ++i) {
      const x = xkey[i];
      const xint = parseInt(x);
      const ykey = Object.keys(data[x]);

      for (var j=0, jlen=ykey.length; j<jlen; ++j) {
        const y = ykey[j];
        const yint = parseInt(y);
        this.putPixel(xint, yint, data[xkey][ykey]);
      }
    }
  }

  save(onComplete) {
    // save file
    var write = fs.createWriteStream(this.path);
    this.image.pack().pipe(write);
    write.on('error', (err) => { console.log(err); });
    write.on('finish', () => { onComplete(true); });
  }
}

export { FileHandler };
