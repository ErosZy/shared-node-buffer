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
        warn(
          `SharedNodeBuffer: key(${key}) already exists, and size(${size}) != ${filesize}, size will be set to ${filesize} instead.`
        );
        size = filesize;
      }
      this.data = binding.mmap(filepath, size, false);
    } else {
      this.data = binding.mmap(filepath, size, true);
    }

    this.length = this.data.length;
  }
}

for (let key in Buffer.prototype) {
  if (Buffer.prototype.hasOwnProperty(key)) {
    if (typeof Buffer.prototype[key] == "function") {
      SharedNodeBuffer.prototype[key] = function () {
        return Buffer.prototype[key].apply(this.data || Buffer.alloc(0), arguments);
      };
    }
  }
}

module.exports = SharedNodeBuffer;
