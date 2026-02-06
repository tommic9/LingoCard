/**
 * Simple PNG icon generator (no dependencies)
 * Creates basic placeholder icons for Firefox extension
 */

const fs = require('fs');
const path = require('path');

// Simple 1x1 blue pixel PNG (base64)
// We'll scale this concept to create colored squares
const createSimplePNG = (size, r, g, b) => {
  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk (image header)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);  // width
  ihdr.writeUInt32BE(size, 4);  // height
  ihdr.writeUInt8(8, 8);        // bit depth
  ihdr.writeUInt8(2, 9);        // color type (RGB)
  ihdr.writeUInt8(0, 10);       // compression
  ihdr.writeUInt8(0, 11);       // filter
  ihdr.writeUInt8(0, 12);       // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk (image data) - solid color
  const pixelData = Buffer.alloc(size * size * 3 + size); // RGB + filter byte per row
  for (let y = 0; y < size; y++) {
    pixelData[y * (size * 3 + 1)] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const offset = y * (size * 3 + 1) + 1 + x * 3;
      pixelData[offset] = r;     // red
      pixelData[offset + 1] = g; // green
      pixelData[offset + 2] = b; // blue
    }
  }

  const zlib = require('zlib');
  const compressed = zlib.deflateSync(pixelData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk (end)
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = require('zlib').crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// Generate icons
const sizes = [
  { size: 16, filename: 'icon-16.png' },
  { size: 48, filename: 'icon-48.png' },
  { size: 128, filename: 'icon-128.png' }
];

// Blue color (LingoCards brand color)
const r = 59, g = 130, b = 246; // #3B82F6

sizes.forEach(({ size, filename }) => {
  console.log(`Generating ${filename}...`);
  const png = createSimplePNG(size, r, g, b);
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, png);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All icons generated successfully!');
console.log('📁 Location: lingocards-extension/icons/');
