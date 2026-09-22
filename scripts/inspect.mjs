import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('public/images');
const publicDir = path.resolve('public');

async function inspectAndOptimize() {
  console.log('--- Analysing public/images ---');
  const imageFiles = fs.readdirSync(imagesDir);
  
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;
    
    const meta = await sharp(filePath).metadata();
    console.log(`[FILE] ${file} | Size: ${(stats.size / 1024).toFixed(1)} KB | Dim: ${meta.width}x${meta.height} | Format: ${meta.format}`);
  }

  const favPng = path.join(publicDir, 'favicon.png');
  if (fs.existsSync(favPng)) {
    const meta = await sharp(favPng).metadata();
    const stats = fs.statSync(favPng);
    console.log(`[FILE] favicon.png | Size: ${(stats.size / 1024).toFixed(1)} KB | Dim: ${meta.width}x${meta.height} | Format: ${meta.format}`);
  }
}

inspectAndOptimize().catch(console.error);
