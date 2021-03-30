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
        warn(`SharedNodeBuffer: key(${key}) already exists, and size(${size}) != ${filesize}, size will be set to ${filesize} instead.`);
        size = filesize;
      }
      this.data = binding.mmap(filepath, size, false);
    } else {
      this.data = binding.mmap(filepath, size, true);
    }

    this.length = this.data.length;
    this.disposed = false;
  }

  compare(...args) {
    return this.disposed ? 0 : this.data.compare(...args);
  }

  copy(...args) {
    return this.disposed ? 0 : this.data.copy(...args);
  }

  entries() {
    return this.disposed ? [] : this.data.entries();
  }

  equals(...args) {
    return this.disposed ? false : this.data.equals(...args);
  }

  fill(...args) {
    return this.disposed ? Buffer.alloc(0) : this.data.fill(...args);
  }

  includes(...args) {
    return this.disposed ? false : this.data.includes(...args);
  }

  indexOf(...args) {
    return this.disposed ? -1 : this.data.indexOf(...args);
  }

  keys() {
    return this.disposed ? [] : this.data.keys();
  }

  lastIndexOf(...args) {
    return this.disposed ? -1 : this.data.lastIndexOf(...args);
  }

  subarray(...args) {
    return this.disposed ? Buffer.alloc(0) : this.data.subarray(...args);
  }

  slice(...args) {
    return this.disposed ? Buffer.alloc(0) : this.data.slice(...args);
  }

  swap16() {
    return this.disposed ? Buffer.alloc(0) : this.data.swap16();
  }

  swap32() {
    return this.disposed ? Buffer.alloc(0) : this.data.swap32();
  }

  swap64() {
    return this.disposed ? Buffer.alloc(0) : this.data.swap64();
  }

  toJSON() {
    return this.disposed ? {} : this.data.toJSON();
  }

  toString(...args) {
    return this.disposed ? "" : this.data.toString(...args);
  }

  values() {
    return this.disposed ? [] : this.data.values();
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
