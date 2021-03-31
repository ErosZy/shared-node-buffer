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
* ### constructor(key, size)
  * `key` **\<String\>** shared file key.
  * `size` **\<Number\>**|**\<Null\>** shared buffer size. Default 1024 * 1024 * 10.
  * `Returns:` **\<SharedNodeBuffer\>**
```javascript
const buffer = new SharedNodeBuffer("your key", 1024 * 1024);
```
* ### compare(target)
  * `target` **\<Buffer\>**|**\<Uint8Array\>** A Buffer or Uint8Array with which to compare buf.
  * `Returns:` **\<Number\>**
  * 
Compares buf with target and returns a number indicating whether buf comes before, after, or is the same as target in sort order. Comparison is based on the actual sequence of bytes in each Buffer.

  * 0 is returned if target is the same as buf
  * 1 is returned if target should come before buf when sorted.
  * -1 is returned if target should come after buf when sorted.

```javascript
buffer = new SharedNodeBuffer(genFileKey(), 3);
buffer.write("ABC");
buffer.compare(Buffer.from("ABC")); // returns: 0
```

* ### copy(target[, targetStart[, sourceStart[, sourceEnd]]])
  * `target` **\<Buffer\>**|**\<Uint8Array\>** A Buffer or Uint8Array to copy into.
  * `targetStart` **\<Number\>** The offset within target at which to begin writing. Default: 0.
  * `sourceStart` **\<Number\>** The offset within buf from which to begin copying. Default: 0.
  * `sourceEnd` **\<Number\>** The offset within buf at which to stop copying (not inclusive). Default: buf.length.
  * `Returns:` **\<Number\>** The number of bytes copied.

Copies data from a region of buf to a region in target, even if the target memory region overlaps with buf.

```javascript
buffer = new SharedNodeBuffer(genFileKey(), 26);
for (let i = 0; i < 26; i++) {
  buffer.data[i] = i + 97;
}

const buf2 = Buffer.allocUnsafe(26).fill("!");
buffer.copy(buf2, 8, 16, 20);
```

MIT License
-------------
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
