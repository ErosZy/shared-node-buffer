const SharedNodeBuffer = require("../index");
const buffer = new SharedNodeBuffer(process.argv[2], process.argv[3]);
process.on("message", () => {
  process.send(buffer.toString());
});
