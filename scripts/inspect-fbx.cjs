const fs = require('fs');
const buf = fs.readFileSync('public/models/robo-warrior-idle.fbx');
console.log('Header:', buf.subarray(0, 30).toString('utf8'));

// Search for strings inside the binary FBX
const text = buf.toString('latin1');
const anims = [];
let re = /Anim(ation)?(Stack|Layer)?/g;
let match;
const models = [];
const modelRe = /Model::([A-Za-z0-9_:\s]+)/g;
while ((match = modelRe.exec(text)) !== null) {
  if (models.length < 20) models.push(match[1]);
}
console.log('Sample Models/Bones in FBX:', models.slice(0, 15));
console.log('Has Deformer/Skin:', text.includes('Deformer'));
console.log('Has Geometry:', text.includes('Geometry'));

const takeRe = /Takes:\s*["']?([^"'\r\n]+)/;
const takeMatch = text.match(takeRe);
console.log('Take match:', takeMatch ? takeMatch[1] : 'none');
