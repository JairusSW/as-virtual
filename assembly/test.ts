import { Virtual } from ".";

const virt = Virtual.createEmpty<string>();
// Reinstantiate Virtual with new data
virt.reinst("Hello yo-yo!", 6);
console.log(`virt == "yo-yo!": ${virt.equals("yo-yo!")}`);

console.log(virt.copyOut());