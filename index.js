const fs = require("fs");
const os = require("os");
const binding = require("bindings")("binding");
const noop = () => {};
const warn = console.warn || noop;

const DEFAULT_BUFFER_SIZE = 10485760;
class SharedNodeBuffer {
  constructor(key, size) {
    const filepath = `${os.tmpdir()}/${key}`;
    size = Number(size);
    size = size && !isNaN(size) && size > 0 ? size : DEFAULT_BUFFER_SIZE;

    if (fs.existsSync(filepath)) {
      const filesize = fs.statSync(filepath).size;
      if (filesize != size) {
        warn(`key(${key}) already exists, and size(${size}) != ${filesize}, size will be set to ${filesize} instead.`);
        size = filesize;
      }
      this.data = binding.mmap(filepath, size, false);
    } else {
      this.data = binding.unmap(filepath, size, true);
    }

    this.length = this.data.length;
    this.disposed = false;
  }

  compare(...args) {}

  copy(...args) {}

  entries() {}

  equals(buffer) {}

  fill(...args) {}

  includes(...args) {}

  indexOf(...args) {}

  keys() {}

  lastIndexOf(...args) {}

  subarray(...args) {
    return this.disposed ? Buffer.alloc(0) : this.data.subarray(...args);
  }

  slice(...args) {
    return this.disposed ? Buffer.alloc(0) : this.data.slice(...args);
  }

  swap16() {}

  swap32() {}

  swap64() {}

  toJSON() {}

  toString(...args) {}

  values() {}

  dispose() {
    if (this.data instanceof Buffer) {
      binding.unbind(this.data);
    }
    this.disposed = true;
    this.data = null;
  }
}

[
  "readDoubleBE",
  "readDoubleLE",
  "readFloatBE",
  "readFloatLE",
  "readInt8",
  "readInt16BE",
  "readInt16LE",
  "readInt32BE",
  "readInt32LE",
  "readIntBE",
  "readIntLE",
  "readUInt8",
  "readUInt16BE",
  "readUInt16LE",
  "readUInt32BE",
  "readUInt32LE",
  "readUIntBE",
  "readUIntLE",
  "write",
  "writeDoubleBE",
  "writeDoubleLE",
  "writeFloatBE",
  "writeFloatLE",
  "writeInt8",
  "writeInt16BE",
  "writeInt16LE",
  "writeInt32BE",
  "writeInt32LE",
  "writeIntBE",
  "writeIntLE",
  "writeUInt8",
  "writeUInt16BE",
  "writeUInt16LE",
  "writeUInt32BE",
  "writeUInt32LE",
  "writeUIntBE",
  "writeUIntLE",
].forEach((v) => {
  SharedNodeBuffer.prototype[v] = function (...args) {
    return this.disposed ? 0 : this.data[v](...args);
  };
});

module.exports = SharedNodeBuffer;
