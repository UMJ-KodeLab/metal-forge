const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { Sequelize } = require('sequelize');
const dbConfig = require('../src/config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let sequelize;
if (config.dialect === 'sqlite') {
  sequelize = new Sequelize({ dialect: 'sqlite', storage: config.storage, logging: false });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host, port: config.port, dialect: config.dialect, logging: false,
  });
}

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'MetalForge/1.0 (metal-forge-ecommerce)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function fetchJson(url) {
  return fetchUrl(url).then(buf => JSON.parse(buf.toString()));
}

async function searchMusicBrainzRelease(artist, title) {
  const query = encodeURIComponent(`release:"${title}" AND artist:"${artist}"`);
  const url = `https://musicbrainz.org/ws/2/release/?query=${query}&fmt=json&limit=5`;
  try {
    const data = await fetchJson(url);
    if (data.releases && data.releases.length > 0) {
      // Prefer releases with cover art
      for (const release of data.releases) {
        if (release.id) return release.id;
      }
    }
  } catch (e) {
    console.log(`    MusicBrainz search failed: ${e.message}`);
  }
  return null;
}

async function downloadCoverArt(releaseId) {
  const url = `https://coverartarchive.org/release/${releaseId}/front-500`;
  try {
    const imageBuffer = await fetchUrl(url);
    return imageBuffer;
  } catch (e) {
    // Try without size spec
    try {
      const imageBuffer = await fetchUrl(`https://coverartarchive.org/release/${releaseId}/front`);
      return imageBuffer;
    } catch (e2) {
      return null;
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const uploadsDir = path.resolve(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const [products] = await sequelize.query(`
    SELECT p.id, p.title, p.artist, p.release_year, g.name as genre_name
    FROM products p
    LEFT JOIN product_genres pg ON p.id = pg.product_id
    LEFT JOIN genres g ON pg.genre_id = g.id
    ORDER BY p.id
  `);

  console.log(`Downloading official covers for ${products.length} products...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`  [${i + 1}/${products.length}] ${p.artist} - ${p.title}`);

    // Search MusicBrainz for the release
    const releaseId = await searchMusicBrainzRelease(p.artist, p.title);

    if (!releaseId) {
      console.log(`    ✗ Not found on MusicBrainz`);
      failed++;
      await sleep(1100); // MusicBrainz rate limit: 1 req/sec
      continue;
    }

    console.log(`    Found release: ${releaseId}`);
    await sleep(1100); // Rate limit before cover art request

    // Download cover art
    const imageBuffer = await downloadCoverArt(releaseId);

    if (!imageBuffer) {
      console.log(`    ✗ No cover art available`);
      failed++;
      continue;
    }

    // Determine file extension from image data
    let ext = 'jpg';
    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) ext = 'png';

    const filename = `cover-${p.id}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, imageBuffer);

    // Remove old SVG if exists
    const oldSvg = path.join(uploadsDir, `cover-${p.id}.svg`);
    if (fs.existsSync(oldSvg)) fs.unlinkSync(oldSvg);

    await sequelize.query(`UPDATE products SET cover_image = ? WHERE id = ?`, {
      replacements: [`/uploads/${filename}`, p.id],
    });

    const sizeMB = (imageBuffer.length / 1024).toFixed(1);
    console.log(`    ✓ Downloaded (${sizeMB} KB, ${ext})`);
    success++;
  }

  console.log(`\nDone! ${success} covers downloaded, ${failed} failed.`);
  await sequelize.close();
}

main().catch(err => { console.error(err); process.exit(1); });
