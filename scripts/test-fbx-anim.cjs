const fs = require('fs');
const THREE = require('three');
const { FBXLoader } = require('three/examples/jsm/loaders/FBXLoader.js');

// Mock texture loading so it doesn't fail in node
THREE.TextureLoader.prototype.load = function() {
  return new THREE.Texture();
};

const buf = fs.readFileSync('public/models/robo-warrior-idle.fbx');
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new FBXLoader();
const fbx = loader.parse(arrayBuffer, '');
console.log('FBX parsed successfully!');
console.log('Animations count:', fbx.animations?.length);
if (fbx.animations) {
  fbx.animations.forEach((anim, i) => {
    console.log(`Animation ${i}: name="${anim.name}", duration=${anim.duration}s, tracks=${anim.tracks.length}`);
  });
}
const box = new THREE.Box3().setFromObject(fbx);
const size = new THREE.Vector3();
box.getSize(size);
console.log('Bounding Box Size:', size);
console.log('Bounding Box Min:', box.min);
console.log('Bounding Box Max:', box.max);
