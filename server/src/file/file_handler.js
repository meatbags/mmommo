import { Config } from '../../../shared';
import * as fs from 'fs';
import { PNG } from './png';

class FileHandler {
  constructor() {
    // read and write files
    this.path = './img/map.png';
    this.png = new PNG();
    this.load();
  }

  load() {
    fs.readFile(this.path, (err, data) => {
      if (err) {
        this.png.load(false);
      } else {
        this.png.load(data);
      }
    });
  }

  getImageSrc() {
    return this.png.getImageSrc();
  }

  writeToFile(data) {
    for (var i=0, len=data.length; i<len; ++i) {
      this.png.writeRGB(data[i].x, data[i].y, data[i].colour);
    }

    this.save();
  }

  save() {
    // encode PNG and save it
    if (!this.saveLock) {
      this.saveLock = true;
      process.stdout.write('Saving...');

      // encode png & save
      this.png.getPNG().then(
        (data) => {
          fs.writeFile(this.path, data, (err) => {
            if (!err) {
              this.onSaveSuccess();
            } else {
              this.onSaveErr(err);
            }
          });
        }
      ).catch(
        (err) => {
          this.onSaveErr(err);
        }
      );
    }
  }

  onSaveErr(err) {
    console.log('Save error', err);
    this.saveLock = false;
  }

  onSaveSuccess() {
    process.stdout.write(' saved.\n');
    this.saveLock = false;
  }
}

export { FileHandler };
