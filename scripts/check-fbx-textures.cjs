const fs = require('fs');
const buf = fs.readFileSync('public/models/robo-warrior-idle.fbx');
const text = buf.toString('latin1');
const re = /([A-Za-z0-9_\-\.\/\\\\]+\.(png|jpg|jpeg|tga|dds))/gi;
const matches = new Set();
let m;
while ((m = re.exec(text)) !== null) {
  matches.add(m[1]);
}
console.log('Texture filenames found in FBX:', Array.from(matches));

const matRe = /Material::([A-Za-z0-9_\-]+)/g;
const mats = new Set();
while ((m = matRe.exec(text)) !== null) {
  mats.add(m[1]);
}
console.log('Materials found in FBX:', Array.from(mats));
