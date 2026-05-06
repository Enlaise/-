const https = require('https');
const sizeOf = require('image-size');

const scriptUrl = 'https://script.google.com/macros/s/AKfycbwqHxrA9g1Fpese1C-UJROlbnCbIH4Gevg3cRyfg8owTYE4PC5tdhe-1Md8Zl8o6u-p/exec';

async function fetchJSON(url) {
  const fetchUrl = new URL(url);
  fetchUrl.searchParams.append('t', new Date().getTime());
  const res = await fetch(fetchUrl.toString());
  return res.json();
}

// Function to get redirect URL (thumbnail endpoint redirects to lh3)
function getRedirectUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        resolve(url);
      }
    }).on('error', () => resolve(url));
  });
}

// Function to fetch image headers and get dimensions using image-size
function getImageSize(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve({ error: `HTTP ${res.statusCode}` });
        return;
      }
      
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        try {
          const dimensions = sizeOf(buffer);
          res.destroy(); // We have the dimensions, stop downloading
          resolve({ width: dimensions.width, height: dimensions.height });
        } catch (e) {
          // Not enough data yet, keep downloading
          // If we exceed 500KB and still can't parse, abort
          if (buffer.length > 500000) {
            res.destroy();
            resolve({ error: 'Cannot parse dimensions' });
          }
        }
      });
      res.on('end', () => {
         resolve({ error: 'Ended without dimensions' });
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  console.log("Fetching vendors...");
  const data = await fetchJSON(scriptUrl);
  
  const inaccessible = [];
  const validCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    const vendor = data[i];
    if (!vendor.image) continue;
    
    const urls = String(vendor.image).split(/[\n,]+/).map(u => u.trim()).filter(u => u);
    let hasBroken = false;
    const brokenUrls = [];
    
    for (const rawUrl of urls) {
      let driveId = null;
      if (rawUrl.includes('drive.google.com/open?id=')) {
        driveId = rawUrl.split('open?id=')[1].split('&')[0];
      } else if (rawUrl.includes('drive.google.com/file/d/')) {
        driveId = rawUrl.split('/file/d/')[1].split('/')[0];
      }
      
      if (!driveId) continue;
      
      const thumbUrl = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
      
      // Get the actual image URL after redirect
      const finalUrl = await getRedirectUrl(thumbUrl);
      
      // Check if it's accessible and get size
      const size = await getImageSize(finalUrl);
      
      if (size.error || size.width === undefined) {
        // If it failed to load or parse, we consider it inaccessible
        // Wait, Google Drive thumbnail endpoint redirects to a 404 page (accounts.google.com or a 404 page) if private
        // If it's HTML, image-size will fail.
        brokenUrls.push(rawUrl);
        hasBroken = true;
      }
    }
    
    if (hasBroken) {
      inaccessible.push({
        name: vendor.name,
        category: vendor.category,
        brokenUrls
      });
      console.log(`[Error] ${vendor.name} has ${brokenUrls.length} broken images.`);
    } else {
      console.log(`[OK] ${vendor.name}`);
    }
  }
  
  const fs = require('fs');
  fs.writeFileSync('report.json', JSON.stringify(inaccessible, null, 2));
  console.log("Done. Saved to report.json");
}

run();
