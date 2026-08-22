const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function compressLogo() {
  const workspacePath = '/home/haz1998/Desktop/abdulmalek-website';
  const inputPath = path.join(workspacePath, 'public/logo-last.png');
  const outputPath = path.join(workspacePath, 'public/logo-last-small.png');
  
  try {
    await sharp(inputPath)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath);
      
    fs.copyFileSync(outputPath, inputPath);
    console.log('Replaced original logo with smaller PNG.');
  } catch (error) {
    console.error('Error compressing logo:', error);
  }
}

compressLogo();
