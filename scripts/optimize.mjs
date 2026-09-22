import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('public/images');
const publicDir = path.resolve('public');

async function optimizeImages() {
  console.log('🚀 Starting image optimization for DomoTek...');

  // 1. Optimize public/images
  const files = fs.readdirSync(imagesDir);
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;

    totalOriginal += stats.size;
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);

    const inputBuffer = fs.readFileSync(filePath);
    const img = sharp(inputBuffer);
    const meta = await img.metadata();

    let optimizedBuffer;

    if (ext === '.png') {
      optimizedBuffer = await sharp(inputBuffer)
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          quality: 85,
          effort: 10,
        })
        .toBuffer();

      // Also create WebP version for modern browsers
      const webpBuffer = await sharp(inputBuffer)
        .webp({ quality: 85, effort: 6 })
        .toBuffer();
      fs.writeFileSync(path.join(imagesDir, `${baseName}.webp`), webpBuffer);
      console.log(`✨ Generated ${baseName}.webp: ${(webpBuffer.length / 1024).toFixed(1)} KB`);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      optimizedBuffer = await sharp(inputBuffer)
        .jpeg({
          quality: 82,
          mozjpeg: true,
        })
        .toBuffer();

      // WebP version
      const webpBuffer = await sharp(inputBuffer)
        .webp({ quality: 82, effort: 6 })
        .toBuffer();
      fs.writeFileSync(path.join(imagesDir, `${baseName}.webp`), webpBuffer);
      console.log(`✨ Generated ${baseName}.webp: ${(webpBuffer.length / 1024).toFixed(1)} KB`);
    }

    if (optimizedBuffer && optimizedBuffer.length < stats.size) {
      fs.writeFileSync(filePath, optimizedBuffer);
      totalOptimized += optimizedBuffer.length;
      console.log(`✅ [OPTIMIZED] ${file}: ${(stats.size / 1024).toFixed(1)} KB ➔ ${(optimizedBuffer.length / 1024).toFixed(1)} KB (-${((1 - optimizedBuffer.length / stats.size) * 100).toFixed(1)}%)`);
    } else {
      totalOptimized += stats.size;
      console.log(`ℹ️ [UNCHANGED] ${file}: ${(stats.size / 1024).toFixed(1)} KB`);
    }
  }

  // 2. Optimize Favicon (1024x1024 PNG of ~1MB -> 128x128 PNG & 32x32 ICO of ~5KB)
  const favPngPath = path.join(publicDir, 'favicon.png');
  if (fs.existsSync(favPngPath)) {
    const originalFav = fs.statSync(favPngPath).size;
    const favBuffer = fs.readFileSync(favPngPath);

    // Optimized high-res crisp favicon (128x128)
    const optFavPng = await sharp(favBuffer)
      .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, quality: 90 })
      .toBuffer();

    fs.writeFileSync(favPngPath, optFavPng);
    console.log(`✅ [OPTIMIZED] favicon.png: ${(originalFav / 1024).toFixed(1)} KB ➔ ${(optFavPng.length / 1024).toFixed(1)} KB (-${((1 - optFavPng.length / originalFav) * 100).toFixed(1)}%)`);

    // Generate lightweight favicon.ico (32x32)
    const favIcoPath = path.join(publicDir, 'favicon.ico');
    const optFavIco = await sharp(favBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(favIcoPath, optFavIco);
    console.log(`✅ [OPTIMIZED] favicon.ico: ${(fs.statSync(favIcoPath).size / 1024).toFixed(1)} KB`);
  }

  const savedMb = ((totalOriginal - totalOptimized) / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Optimization Complete! Saved ${savedMb} MB (-${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
}

optimizeImages().catch(console.error);
