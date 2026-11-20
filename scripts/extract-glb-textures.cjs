const fs = require('fs');
const fd = fs.openSync('public/models/robo.glb', 'r');
const header = Buffer.alloc(12);
fs.readSync(fd, header, 0, 12, 0);
const chunk0Header = Buffer.alloc(8);
fs.readSync(fd, chunk0Header, 0, 8, 12);
const chunk0Length = chunk0Header.readUInt32LE(0);
const jsonBuf = Buffer.alloc(chunk0Length);
fs.readSync(fd, jsonBuf, 0, chunk0Length, 20);

// Chunk 1 is BIN
const chunk1HeaderOffset = 20 + chunk0Length;
const chunk1Header = Buffer.alloc(8);
fs.readSync(fd, chunk1Header, 0, 8, chunk1HeaderOffset);
const binLength = chunk1Header.readUInt32LE(0);
const binOffset = chunk1HeaderOffset + 8;

const gltf = JSON.parse(jsonBuf.toString('utf8'));
console.log('Images in GLB:', gltf.images?.length);

if (!fs.existsSync('public/models/textures')) {
  fs.mkdirSync('public/models/textures', { recursive: true });
}

if (gltf.images) {
  gltf.images.forEach((img, i) => {
    const bv = gltf.bufferViews[img.bufferView];
    const imgBuf = Buffer.alloc(bv.byteLength);
    fs.readSync(fd, imgBuf, 0, bv.byteLength, binOffset + (bv.byteOffset || 0));
    const ext = img.mimeType === 'image/jpeg' ? 'jpg' : 'png';
    const filename = `public/models/textures/texture_${i}_${img.name || 'tex'}.${ext}`;
    fs.writeFileSync(filename, imgBuf);
    console.log(`Extracted: ${filename} (${imgBuf.length} bytes, ${img.mimeType})`);
  });
}

fs.closeSync(fd);
