class Converter {
  atob(b64str) {
    return Buffer.from(b64str, 'base64').toString();
  }

  btoa(str) {
    return Buffer.from(str).toString('base64');
  }

  UTF8ToBuffer(str) {
    const buffer = [];

    for (var i=0, len=str.length; i<len; i++) {
      buffer.push(str.charCodeAt(i));
    }

    return buffer;
  }

  bufferToUTF8(buf) {
    return String.fromCharCode.apply(null, buf);
  }

  CRC32(data) {
    // generate CRC32 checksum
    if (!this.crcTable) {
      this.crcTable = [];
      for (var n=0; n<256; n++) {
        var c = n;
        for (var k=0; k<8; k++) {
          c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        this.crcTable[n] = c;
      }
    }

    var crc = 0 ^ (-1);
    for (var i = 0; i < data.length; i++ ) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
}

export { Converter }
