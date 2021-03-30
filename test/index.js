const assert = require("assert");
const fs = require("fs");
const os = require("os");
const { fork } = require("child_process");
const SharedNodeBuffer = require("../index");
let index = +new Date();
let buffer = null;

const genFileKey = () => {
  return `${index++}`;
};

describe("node-shared-buffer", () => {
  describe("constructor method", () => {
    it("constructor(key)", () => {
      buffer = new SharedNodeBuffer(genFileKey());
      assert.equal(buffer.length, 1024 * 1024 * 10);
    });

    it("constructor(key, size)", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 1024);
      assert.equal(buffer.length, 1024);
    });

    it("when size != filesize, it should be set filesize", () => {
      const filekey = genFileKey();
      buffer = new SharedNodeBuffer(filekey, 1024);
      buffer = new SharedNodeBuffer(filekey);
      assert.equal(buffer.length, 1024);
    });

    it("when size is not number, it should set 10m", () => {
      buffer = new SharedNodeBuffer(genFileKey(), "hello");
      assert.equal(buffer.length, 1024 * 1024 * 10);
    });
  });

  describe("compare method", () => {
    it("compare(target) == 0", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 3);
      buffer.write("ABC");
      assert.equal(buffer.compare(Buffer.from("ABC")), 0);
    });

    it("compare(target) == -1", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 3);
      buffer.write("ABC");
      assert.equal(buffer.compare(Buffer.from("BCD")), -1);
    });

    it("compare(target) == 1", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 3);
      buffer.write("BCD");
      assert.equal(buffer.compare(Buffer.from("ABCD")), 1);
    });
  });

  describe("copy method", () => {
    it("copy(target[, targetStart[, sourceStart[, sourceEnd]]])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 26);
      for (let i = 0; i < 26; i++) {
        buffer.data[i] = i + 97;
      }

      const buf2 = Buffer.allocUnsafe(26).fill("!");
      buffer.copy(buf2, 8, 16, 20);
      assert.equal(buf2.toString("ascii", 0, 25), "!!!!!!!!qrst!!!!!!!!!!!!!");
    });
  });

  describe("entries method", () => {
    it("entries()", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 3);
      buffer.write("123");
      let sum = 0;
      for (let pair of buffer.entries()) {
        sum += pair[1];
      }
      assert.equal(sum, 150);
    });
  });

  describe("equals method", () => {
    it("equals(otherBuffer)", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 3);
      buffer.write("ABC");
      assert.equal(buffer.equals(Buffer.from("ABC")), true);
    });
  });

  describe("fill method", () => {
    it("fill(value[, offset[, end]][, encoding])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 10);
      buffer.fill("h");
      assert.equal(buffer.toString(), "hhhhhhhhhh");
    });
  });

  describe("includes method", () => {
    it("includes(value[, byteOffset][, encoding])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 10);
      buffer.write("this is a buffer");
      assert.equal(buffer.includes("this"), true);
    });
  });

  describe("indexOf method", () => {
    it("indexOf(value[, byteOffset][, encoding])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 16);
      buffer.write("this is a buffer");
      assert.equal(buffer.indexOf("is"), 2);
    });
  });

  describe("keys method", () => {
    it("keys()", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 5);
      assert.deepEqual([...buffer.keys()], [0, 1, 2, 3, 4]);
    });
  });

  describe("lastIndexOf method", () => {
    it("lastIndexOf(value[, byteOffset][, encoding])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 23);
      buffer.write("this buffer is a buffer");
      assert.equal(buffer.lastIndexOf("buffer"), 17);
    });
  });

  describe("length property", () => {
    it("length", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 10);
      assert.equal(buffer.length, 10);
    });
  });

  describe("subarray method", () => {
    it("subarray([start[, end]])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 26);
      for (let i = 0; i < 26; i++) {
        buffer.data[i] = i + 97;
      }

      const buf2 = buffer.subarray(0, 3);
      assert.equal(buf2.toString("ascii", 0, buf2.length), "abc");
    });
  });

  describe("slice method", () => {
    it("slice([start[, end]])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 26);
      for (let i = 0; i < 26; i++) {
        buffer.data[i] = i + 97;
      }

      const buf2 = buffer.slice(0, 3);
      assert.equal(buf2.toString("ascii", 0, buf2.length), "abc");
    });
  });

  describe("swap16 method", () => {
    it("swap16()", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 4);
      buffer.data[0] = 0x1;
      buffer.data[1] = 0x2;
      buffer.data[2] = 0x3;
      buffer.data[3] = 0x4;
      buffer.swap16();
      assert.equal(buffer.equals(Buffer.from([0x2, 0x1, 0x4, 0x3])), true);
    });
  });

  describe("swap32 method", () => {
    it("swap32()", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 4);
      buffer.data[0] = 0x1;
      buffer.data[1] = 0x2;
      buffer.data[2] = 0x3;
      buffer.data[3] = 0x4;
      buffer.swap32();
      assert.equal(buffer.equals(Buffer.from([0x4, 0x3, 0x2, 0x1])), true);
    });
  });

  describe("swap64 method", () => {
    it("swap64()", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 8);
      buffer.data[0] = 0x1;
      buffer.data[1] = 0x2;
      buffer.data[2] = 0x3;
      buffer.data[3] = 0x4;
      buffer.data[4] = 0x5;
      buffer.data[5] = 0x6;
      buffer.data[6] = 0x7;
      buffer.data[7] = 0x8;
      buffer.swap64();
      assert.equal(buffer.equals(Buffer.from([0x8, 0x7, 0x6, 0x5, 0x4, 0x3, 0x2, 0x1])), true);
    });
  });

  describe("toJSON method", () => {
    it("toJSON()", () => {
      const jsonstr = JSON.stringify({ a: 1 });
      buffer = new SharedNodeBuffer(genFileKey(), jsonstr.length);
      buffer.write(jsonstr);
      assert.deepEqual(buffer.toJSON(), { data: [123, 34, 97, 34, 58, 49, 125], type: "Buffer" });
    });
  });

  describe("toString method", () => {
    it("toString([encoding[, start[, end]]])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 26);
      for (let i = 0; i < 26; i++) {
        buffer.data[i] = i + 97;
      }
      assert.equal(buffer.toString("utf8"), "abcdefghijklmnopqrstuvwxyz");
      assert.equal(buffer.toString("utf8", 0, 5), "abcde");
    });
  });

  describe("values method", () => {
    it("values()", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 3);
      buffer.write("123");
      assert.deepEqual([...buffer.values()], [49, 50, 51]);
    });
  });

  describe("read* and write* method", () => {
    [
      ["readDoubleBE", "writeDoubleBE"],
      ["readDoubleLE", "writeDoubleLE"],
      ["readFloatBE", "writeFloatBE"],
      ["readFloatLE", "writeFloatLE"],
      ["readInt8", "writeInt8"],
      ["readInt16BE", "writeInt16BE"],
      ["readInt16LE", "writeInt16LE"],
      ["readInt32BE", "writeInt32BE"],
      ["readInt32LE", "writeInt32LE"],
      ["readIntBE", "writeIntBE"],
      ["readIntLE", "writeIntLE"],
      ["readUInt8", "writeUInt8"],
      ["readUInt16BE", "writeUInt16BE"],
      ["readUInt16LE", "writeUInt16LE"],
      ["readUInt32BE", "writeUInt32BE"],
      ["readUInt32LE", "writeUInt32LE"],
      ["readUIntBE", "writeUIntBE"],
      ["readUIntLE", "writeUIntLE"],
    ].forEach((v) => {
      it(v.join(" and "), () => {
        buffer = new SharedNodeBuffer(genFileKey(), 64);
        buffer[v[1]](125, 0, 6);
        assert.equal(buffer[v[0]](0, 6), 125);
      });
    });
  });

  describe("write method", () => {
    it("write(string[, offset[, length]][, encoding])", () => {
      buffer = new SharedNodeBuffer(genFileKey(), 64);
      const len = buffer.write("\u00bd + \u00bc = \u00be", 0);
      assert.equal(buffer.toString("utf8", 0, len), "½ + ¼ = ¾");
    });
  });

  describe("multi worker read/write", () => {
    it("master write and cluster read", (done) => {
      const now = +new Date() + "";
      const filekey = genFileKey();
      buffer = new SharedNodeBuffer(filekey, now.length);
      buffer.write(now);
      const child = fork(`${__dirname}/worker.js`, [filekey, now.length]);
      child.on("message", (data) => {
        if (data == now) {
          done();
        } else {
          done(new Error(`${data} != ${now}`));
        }
        process.exit(0);
      });
      child.send("");
    });
  });
});
