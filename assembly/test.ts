import { Virtual } from ".";

const virt = new Virtual<string>("hello world!", 6);
console.log("Created Virt");
console.log(`virt == "world!": ${virt.equals("world!")}`);
console.log(`virt == "yo-yo!": ${virt.equals("yo-yo!")}`);
console.log(virt.copyOut());