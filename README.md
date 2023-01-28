JSON-Typed-Arrays
================

A simple library that allows you to stringify and parse typed arrays using base64.

Installation
------------

```
npm install json-typed-arrays
```

Usage
-----

```javascript
import { createParser } from 'json-typed-arrays';

// Create a new parser
const JSON = createParser();

// Example typed array
const typedArray = new Uint16Array([1, 2, 3, 4, 5]);

// Stringify the typed array
const encoded = JSON.stringify({ typedArray });
console.log(encoded); // {"typedArray":"Uint16Array:AQACAAMABAAFAA=="}

// Parse the encoded string
const decoded = JSON.parse(encoded);
console.log(decoded); // { typedArray: Uint16Array [ 1, 2, 3, 4, 5 ] }

// You can also use your own base64 encoder/decoder
function toArrayBuffer(buf) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
const JSON = createParser(
  b => Buffer.from(b).toString('base64'),
  s => toArrayBuffer(Buffer.from(s, 'base64'))
);

```

API
---

### createParser(\[options\])

This function creates a new parser that you can use to stringify and parse typed arrays.

#### options

`encode`: function that takes an array buffer and returns a string. Uses `btoa` by default.

`decode`: function that takes a string and returns an array buffer. Uses `atob` by default.

### JSON.stringify(value, \[replacer\], \[space\])

This function works just like the native `JSON.stringify`, but it also supports typed arrays.

### JSON.parse(text, \[reviver\])

This function works just like the native `JSON.parse`, but it also supports typed arrays.

License
-------

MIT
