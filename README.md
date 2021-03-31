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
* ## constructor(key, size)
  * `key` **\<String\>** shared file key.
  * `size` **\<Number\>**|**\<Null\>** shared buffer size. Default 1024 * 1024 * 10.
  * `Returns:` **\<SharedNodeBuffer\>**
```javascript
const buffer = new SharedNodeBuffer("your key", 1024 * 1024);
```
* ## compare(target)
  * `target` **\<Buffer\>**|**\<Uint8Array\>** A Buffer or Uint8Array with which to compare buf.
  * `Returns:` **\<Number\>**
  * 
Compares buf with target and returns a number indicating whether buf comes before, after, or is the same as target in sort order. Comparison is based on the actual sequence of bytes in each Buffer.

  * 0 is returned if target is the same as buf
  * 1 is returned if target should come before buf when sorted.
  * -1 is returned if target should come after buf when sorted.

```javascript
const buffer = new SharedNodeBuffer("your key", 3);
buffer.write("ABC");
buffer.compare(Buffer.from("ABC")); // returns: 0
```

* ## copy(target[, targetStart[, sourceStart[, sourceEnd]]])
  * `target` **\<Buffer\>**|**\<Uint8Array\>** A Buffer or Uint8Array to copy into.
  * `targetStart` **\<Number\>** The offset within target at which to begin writing. Default: 0.
  * `sourceStart` **\<Number\>** The offset within buf from which to begin copying. Default: 0.
  * `sourceEnd` **\<Number\>** The offset within buf at which to stop copying (not inclusive). Default: buf.length.
  * `Returns:` **\<Number\>** The number of bytes copied.

Copies data from a region of buf to a region in target, even if the target memory region overlaps with buf.

```javascript
const buffer = new SharedNodeBuffer("your key", 26);
for (let i = 0; i < 26; i++) {
  buffer.data[i] = i + 97;
}

const buf2 = Buffer.allocUnsafe(26).fill("!");
buffer.copy(buf2, 8, 16, 20);
```

* ## entries()
  * `Returns:` **\<Interator\>**

Creates and returns an iterator of [index, byte] pairs from the contents of buf.

```javascript
const buffer = new SharedNodeBuffer("your key", 3);
buffer.write("123");

let sum = 0;
for (let pair of buffer.entries()) {
  sum += pair[1];
} // sum to 150
```

* ## equals(otherBuffer)
  * `otherBuffer` **\<Buffer\>**|**\<Uint8Array\>** A Buffer or Uint8Array with which to compare buf.
  * `Returns:` **\<Boolean\>**

Returns true if both buf and otherBuffer have exactly the same bytes, false otherwise. Equivalent to buf.compare(otherBuffer) === 0.

```javascript
const buffer = new SharedNodeBuffer("your key", 3);
buffer.write("ABC");
buffer.equals(Buffer.from("ABC")) // returns true
```

* ## fill(value[, offset[, end]][, encoding])
  * `value` **\<Buffer\>**|**\<String\>**|**\<Uint8Array\>**|**\<Number\>** The value with which to fill buf.
  * `offset` **\<Number\>** Number of bytes to skip before starting to fill buf. Default: 0.
  * `end` **\<Number\>** Where to stop filling buf (not inclusive). Default: buf.length.
  * `encoding` **\<Number\>** The encoding for value if value is a string. Default: 'utf8'.
  * `Returns:` **\<Buffer\>** A reference to buf.

Fills buf with the specified value. If the offset and end are not given, the entire buf will be filled:

```javascript
const buffer = new SharedNodeBuffer("your key", 10).fill("h");
buffer.toString(); // outputs 'hhhhhhhhhh'
```

* ## includes(value[, byteOffset][, encoding])
  * `value` **\<Buffer\>**|**\<String\>**|**\<Uint8Array\>**|**\<Number\>** What to search for.
  * `byteOffset` **\<Number\>** Where to begin searching in buf. If negative, then offset is calculated from the end of buf. Default: 0.
  * `encoding` **\<Number\>** If value is a String, this is its encoding. Default: 'utf8'.
  * `Returns:` **\<Boolean\>** true if value was found in buf, false otherwise.

```javascript
const buffer = new SharedNodeBuffer("your key", 10);
buffer.write("this is a buffer");
buffer.includes("this"); // returns true
```

* ## indexOf(value[, byteOffset][, encoding])
  * `value` **\<Buffer\>**|**\<String\>**|**\<Uint8Array\>**|**\<Number\>** What to search for.
  * `byteOffset` **\<Number\>** Where to begin searching in buf. If negative, then offset is calculated from the end of buf. Default: 0.
  * `encoding` **\<Number\>** If value is a String, this is its encoding. Default: 'utf8'.
  * `Returns:` **\<Number\>** The index of the first occurrence of value in buf, or -1 if buf does not contain value.
  
If value is:

  * a String, value is interpreted according to the character encoding in encoding.
  * a Buffer or Uint8Array, value will be used in its entirety. To compare a partial Buffer, use **slice()**.
  * a Number, value will be interpreted as an unsigned 8-bit integer value between 0 and 255.

```javascript
const buffer = new SharedNodeBuffer("your key", 16);
buffer.write("this is a buffer");
buffer.indexOf("is"); // returns 2
```

* ## keys()
  * `Returns:` **\<Iterator\>**

Creates and returns an iterator of buf keys (indices).

```javascript
const buffer = new SharedNodeBuffer("your key", 5);
[...buffer.keys()]; // returns [0, 1, 2, 3, 4]
```

* ## lastIndexOf(value[, byteOffset][, encoding])
  * `value` **\<Buffer\>**|**\<String\>**|**\<Uint8Array\>**|**\<Number\>** What to search for.
  * `byteOffset` **\<Number\>** Where to begin searching in buf. If negative, then offset is calculated from the end of buf. Default: buf.length - 1.
  * `encoding` **\<Number\>** If value is a string, this is the encoding used to determine the binary representation of the string that will be searched for in buf. Default: 'utf8'.
  * `Returns:` **\<Number\>** The index of the last occurrence of value in buf, or -1 if buf does not contain value.

Identical to **indexOf()**, except the last occurrence of value is found rather than the first occurrence.

```javascript
const buffer = new SharedNodeBuffer(genFileKey(), 23);
buffer.write("this buffer is a buffer");
buffer.lastIndexOf("buffer"); // returns 17
```
