import { Config } from '../../../shared';
import { Converter } from '../utils';
import * as zlib from 'zlib';

class PNG {
  constructor() {
    // png encoding & decoding
    this.width = Config.global.grid.size;
    this.height = Config.global.grid.size;
    this.rowPadding = this.height;
    this.bufferSize = this.width * this.height * 4 + this.rowPadding;
    this.bitDepth = 8;
    this.colourType = 6;
    this.buffer = this.utf8 = this.b64 = this.imageSrc = null;
    this.convert = new Converter();
  }

  getImageSrc() {
    return this.utf8;
  }

  writeRGB(x, y, colour) {
    // write pixel to array buffer
    const index = ((y * this.width + x) << 2) + (y + 1);

    if (this.buffer && index >= 0 && index + 3 <= this.buffer.length) {
      this.buffer[index] = colour >> 16 & 0xff;
      this.buffer[index + 1] = colour >> 8 & 0xff;
      this.buffer[index + 2] = colour & 0xff;
      this.buffer[index + 3] = 0xff;
    }
  }

  load(data) {
    // parse data to image buffer
    const onLoadFail = (err) => {
      console.log(err);
      this.buffer = new Uint8Array(this.bufferSize);
      this.encodePNG((err) => { if (err) console.log(err); });
    };

    if (data) {
      try {
        const size = this.fromByteArray(data, 33, 37);
        const imageData = new Uint8Array(size);

        // copy buffer to imageData
        var start = 41;
        var stop = 41 + size;
        var index = 0;
        for (var i=start; i<stop; ++i) {
          imageData[index++] = data[i];
        }

        zlib.inflate(imageData, (err, buffer) => {
          if (!err) {
            if (buffer.length == this.bufferSize) {
              this.buffer = buffer;
              this.encodePNG((err) => { if (err) console.log(err); });
              console.log('File loaded.');
            } else {
              onLoadFail(`${buffer.length} != ${this.bufferSize}`);
            }
          } else {
            onLoadFail(err);
          }
        });
      } catch(err) {
        onLoadFail(err);
      }
    } else {
      onLoadFail('Creating new image.');
    }
  }

  fromByteArray(arr, start, stop) {
    // get value from bytes
    var val = 0;
    var lim = stop - start;
    var mul = lim;
    for (var i=0; i<lim; ++i) {
      val += arr[start + i] << (--mul * 8);
    }
    return val;
  }

  toByteArray(data, bytes) {
    // push data into big-e byte array
    var arr = [];
    var mul = bytes;
    for (var i=0; i<bytes; ++i) {
      arr.push(data >> (--mul * 8) & 0xff);
    }
    return arr;
  }

  encode() {
    // push data into encode buffer
    for (var i=0; i<arguments.length; ++i) {
      const data = arguments[i];
      for (var j=0, lim=data.length; j<lim; ++j) {
        this.encoded.push(data[j]);
      }
    }
  }

  encodeChunk(name, data) {
    // create png file chunk
    const header = this.toByteArray(data.length, 4);
    const type = new Uint8Array(this.convert.UTF8ToBuffer(name));
    const body = new Uint8Array(type.length + data.length);
    body.set(type, 0);
    body.set(data, type.length);
    const checksum = this.toByteArray(this.convert.CRC32(body), 4);
    this.encode(header, body, checksum);
  }

  encodePNG(onComplete) {
    // compress
    zlib.deflate(this.buffer, (err, buffer) => {
      if (!err) {
        this.encoded = [];
        this.encode([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        this.encodeChunk('IHDR', this.toByteArray(this.width, 4).concat(this.toByteArray(this.height, 4), [this.bitDepth, this.colourType, 0, 0, 0]));
        this.encodeChunk('IDAT', buffer);
        this.encodeChunk('IEND', []);
        this.parse();
        onComplete(null);
      } else {
        console.log(err);
        onComplete(err);
      }
    });
  }

  parse() {
    // parse utf8, b64, src
    this.file = Buffer.from(this.encoded);
    this.utf8 = this.convert.bufferToUTF8(this.encoded);
    this.b64 = this.convert.btoa(this.utf8);
    this.imageSrc = 'data:image/png;base64,' + this.b64;
  }

  getPNG() {
    // encode PNG and return file Buffer
    return new Promise(
      (resolve, reject) => {
        try {
          this.encodePNG((err) => {
            if (!err) {
              resolve(this.file);
            } else {
              reject(err);
            }
          });
        } catch(err) {
          reject(err);
        }
      }
    );
  }
}

export { PNG };
