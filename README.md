# shared-node-buffer

> Node shared buffer class for fast sharing data between processes (Windows/OSX/Linux supported).
> 

![linux ci](https://github.com/ErosZy/shared-node-buffer/actions/workflows/linux.yml/badge.svg)
![osx ci](https://github.com/ErosZy/shared-node-buffer/actions/workflows/osx.yml/badge.svg)
![windows ci](https://github.com/ErosZy/shared-node-buffer/actions/workflows/windows.yml/badge.svg)
<a href="https://www.npmjs.com/package/shared-node-buffer"><img src="https://img.shields.io/npm/v/shared-node-buffer.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/shared-node-buffer"><img src="https://img.shields.io/npm/l/shared-node-buffer.svg?sanitize=true" alt="License"></a>

About
-----
The SharedNodeBuffer class library provides Node.js class that utilise memory mapped files for fast low-level inter-process communication (IPC).

Install
-------
```shell
> npm install shared-node-buffer --save
```

Example
-------------
```javascript
const cluster = require("cluster");
const SharedNodeBuffer = require("shared-node-buffer");
const buffer = new SharedNodeBuffer("your key", 1024 * 1024);

if (cluster.isMain) {
  buffer.write("Hello World!");
  cluster.fork();
} else {
  console.log(buffer.slice(0, 64).toString());
}
```

API
---

SharedNodeBuffer proxys the most Buffer.prototype's method, you can find at [Node.js Buffer Doc](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html).
