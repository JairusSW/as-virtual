# Virtual Type

A virtual type implementation that serves as a representation of a segment of data

### Inspiration

When creating a JSON parser, I ran into the issue of constantly using `.slice()` which allocated a new string and copied data to it. The constant allocation caused massive memory bloat and a significant loss to performance. I wondered if I could instead create a type that can represent a section of data without the bloat.

### Installation

```
npm install as-virtual
```

### Usage

```js
import { Virtual } from "as-virtual/assembly";

const virt = new Virtual<string>("hello world!", 6);
// Virt represents "Hello World!".slice(6)

virt.equals("world!"); // true
virt.equals("yo-yo!"); // false

// Reinstantiate Virtual with new data
virt.reinst("Hello yo-yo!", 6);
virt.equals("yo-yo!"); // true

console.log(virt.copyOut()); // "yo-yo!"
```