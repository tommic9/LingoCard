/**
 * Generate PWA icons from SVG source
 * Uses sharp to convert icon.svg to PNG files
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [192, 512];
const inputSvg = path.join(__dirname, 'public', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating PWA icons...\n');

// Generate PNG icons
for (const size of sizes) {
  const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

  try {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${size}x${size} icon: ${path.relative(__dirname, outputPath)}`);
  } catch (error) {
    console.error(`✗ Failed to generate ${size}x${size} icon:`, error.message);
    process.exit(1);
  }
}

// Generate favicon.ico (32x32 is standard)
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');

try {
  await sharp(inputSvg)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);

  console.log(`✓ Generated favicon: ${path.relative(__dirname, faviconPath)}`);
} catch (error) {
  console.error('✗ Failed to generate favicon:', error.message);
  process.exit(1);
}

console.log('\n✨ All icons generated successfully!');
