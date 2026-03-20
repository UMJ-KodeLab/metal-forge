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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Try multiple search strategies
async function findCover(artist, title) {
  const searches = [
    `release:"${title}" AND artist:"${artist}"`,
    `release:"${title}" AND artistname:"${artist}"`,
    `"${title}" AND "${artist}"`,
    `${title} ${artist}`,
  ];

  for (const query of searches) {
    const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=10`;
    try {
      const data = await fetchJson(url);
      if (data.releases && data.releases.length > 0) {
        // Try each release to find one with cover art
        for (const release of data.releases) {
          await sleep(1100);
          try {
            const imageBuffer = await fetchUrl(`https://coverartarchive.org/release/${release.id}/front-500`);
            return { imageBuffer, releaseId: release.id };
          } catch (e) {
            try {
              const imageBuffer = await fetchUrl(`https://coverartarchive.org/release/${release.id}/front`);
              return { imageBuffer, releaseId: release.id };
            } catch (e2) {
              // Try next release
              continue;
            }
          }
        }
      }
    } catch (e) {
      // Try next search
    }
    await sleep(1100);
  }

  // Try release-group search as last resort
  try {
    const rgUrl = `https://musicbrainz.org/ws/2/release-group/?query=releasegroup:"${encodeURIComponent(title)}" AND artist:"${encodeURIComponent(artist)}"&fmt=json&limit=5`;
    const rgData = await fetchJson(rgUrl);
    if (rgData['release-groups'] && rgData['release-groups'].length > 0) {
      for (const rg of rgData['release-groups']) {
        await sleep(1100);
        try {
          const imageBuffer = await fetchUrl(`https://coverartarchive.org/release-group/${rg.id}/front-500`);
          return { imageBuffer, releaseId: rg.id };
        } catch (e) {
          try {
            const imageBuffer = await fetchUrl(`https://coverartarchive.org/release-group/${rg.id}/front`);
            return { imageBuffer, releaseId: rg.id };
          } catch (e2) {
            continue;
          }
        }
      }
    }
  } catch (e) {}

  return null;
}

async function main() {
  const uploadsDir = path.resolve(__dirname, '..', 'uploads');

  const [products] = await sequelize.query(`
    SELECT p.id, p.title, p.artist, p.release_year, p.cover_image
    FROM products p
    ORDER BY p.id
  `);

  // Find products that still have SVG covers (the ones that failed)
  const missing = products.filter(p => p.cover_image && p.cover_image.endsWith('.svg'));
  console.log(`Found ${missing.length} products with missing official covers.\n`);

  let success = 0;
  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    console.log(`  [${i + 1}/${missing.length}] ${p.artist} - ${p.title}`);

    const result = await findCover(p.artist, p.title);

    if (!result) {
      console.log(`    ✗ Still not found`);
      continue;
    }

    let ext = 'jpg';
    if (result.imageBuffer[0] === 0x89 && result.imageBuffer[1] === 0x50) ext = 'png';

    const filename = `cover-${p.id}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, result.imageBuffer);

    // Remove old SVG
    const oldSvg = path.join(uploadsDir, `cover-${p.id}.svg`);
    if (fs.existsSync(oldSvg)) fs.unlinkSync(oldSvg);

    await sequelize.query(`UPDATE products SET cover_image = ? WHERE id = ?`, {
      replacements: [`/uploads/${filename}`, p.id],
    });

    const sizeKB = (result.imageBuffer.length / 1024).toFixed(1);
    console.log(`    ✓ Downloaded (${sizeKB} KB)`);
    success++;
    await sleep(1100);
  }

  console.log(`\nDone! Fixed ${success}/${missing.length} covers.`);
  await sequelize.close();
}

main().catch(err => { console.error(err); process.exit(1); });
