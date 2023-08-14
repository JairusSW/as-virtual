import { Virtual } from ".";

const virt = new Virtual<string>("hello world!", 6);
// Virt represents "Hello World!".slice(6)

console.log(`virt == "world!": ${virt.equals("world!")}`);
console.log(`virt == "yo-yo!": ${virt.equals("yo-yo!")}`);

// Reinstantiate Virtual with new data
virt.reinst("Hello yo-yo!", 6);
console.log(`virt == "yo-yo!": ${virt.equals("yo-yo!")}`);

console.log(virt.copyOut());