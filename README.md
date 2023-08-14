# Virtual Type

A virtual type implementation that serves as a representation of a segment of data

### Inspiration

While working on a JSON parser, I constantly used `.slice()`, which resulted in new string allocations and unnecessary data copying. This frequent allocation led to significant memory bloat and performance degradation.
I began to explore whether it was possible to create a specialized type that could represent a data segment without causing these issues and came up with Virtual Types.
By utilizing this approach, I managed to increase the performance of JSON parsing, specifically for a Vector 3, boosting operations from `8,159,838m ops` to an impressive `39,260,740m ops`. The results are wild.

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