import { Virtual } from ".";

const virt = Virtual.createEmpty<string>();
virt.reinst("hello!")
console.log(`Exists: ${virt.exists()}`);
const virt2 = new Virtual<string>(" mum!");
console.log(virt.copyOut());

console.log(virt.merge(virt2));

console.log(Virtual.mergeVirts<string>([virt, virt2]))