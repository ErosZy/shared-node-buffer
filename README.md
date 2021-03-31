# shared-node-buffer

> Node shared buffer class for fast sharing data between processes (Windows/OSX/Linux supported).

![linux ci](https://github.com/ErosZy/shared-node-buffer/actions/workflows/linux.yml/badge.svg)
![osx ci](https://github.com/ErosZy/shared-node-buffer/actions/workflows/osx.yml/badge.svg)
![windows ci](https://github.com/ErosZy/shared-node-buffer/actions/workflows/windows.yml/badge.svg)

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

SharedNodeBuffer proxys the most Buffer.prototype's method, you can find at [Node.js Buffer Doc](https://nodejs.org/dist/latest-v15.x/docs/api/buffer.html#buffer_buf_includes_value_byteoffset_encoding).

MIT License
-----------

Copyright (c) 2021 ErosZhao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
