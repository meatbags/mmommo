/*
 * FileHandler
 * -- read/ write files
 * -- keep track of images on disk
 */

import { Config } from '../../../shared';
import * as fs from 'fs';
import { PNG } from './png';

class FileHandler {
  constructor() {
    this.path = './img/map.png';
    this.archivePath = './img/archive/';
    this.png = new PNG();
    this.session = {
      saves: 0,
      archiveEvery: 25
    };
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

  archive(data) {
    // archive png
    const t = (new Date()).toISOString().replace(/[-:.]/g, '_');
    const path = this.archivePath + t + '.png';
    fs.writeFile(path, data, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Archived', path);
      }
    });
  }

  save() {
    // encode PNG and save it
    if (!this.saveLock) {
      this.saveLock = true;
      //process.stdout.write('Saving...');

      // encode png & save
      this.png.getPNG().then(
        (data) => {
          fs.writeFile(this.path, data, (err) => {
            if (!err) {
              this.onSaveSuccess(data);
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

  onSaveSuccess(data) {
    //process.stdout.write(' saved.\n');
    this.saveLock = false;
    if (this.session.saves++ % this.session.archiveEvery === 0) {
      this.archive(data);
    }
  }
}

export { FileHandler };
