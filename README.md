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

const virt = new Virtual<string>("Hello World!", 6);
// Virt represents "Hello World!".slice(6)

console.log(`virt == "world!": ${virt.equals("world!")}`);
console.log(`virt == "yo-yo!": ${virt.equals("yo-yo!")}`);
console.log(virt.copyOut());
```