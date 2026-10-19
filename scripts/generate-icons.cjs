const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function generateSvg(size) {
  const fontSize = Math.round(size * 0.38);
  const rx = Math.round(size * 0.22);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${rx}" fill="#059669"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="${fontSize}">SC</text>
  </svg>`;
}

async function buildIcons() {
  const svg192 = Buffer.from(generateSvg(192));
  const svg512 = Buffer.from(generateSvg(512));

  await sharp(svg192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(svg512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(svg192).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svg192).png().toFile(path.join(publicDir, 'favicon.png'));

  console.log('PWA Local icons created successfully in public/ directory!');
}

buildIcons().catch(console.error);
