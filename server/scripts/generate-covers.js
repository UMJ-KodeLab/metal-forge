const fs = require('fs');
const path = require('path');
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

const GENRE_COLORS = {
  'Thrash Metal':       { bg: '#1a0a0a', accent: '#cc0000', text: '#ff3333' },
  'Death Metal':        { bg: '#0a0a0a', accent: '#8b0000', text: '#cc3333' },
  'Black Metal':        { bg: '#0a0a0a', accent: '#333333', text: '#999999' },
  'Power Metal':        { bg: '#0a0a1a', accent: '#0044cc', text: '#4488ff' },
  'Doom Metal':         { bg: '#0a0a05', accent: '#4a3500', text: '#aa8833' },
  'Speed Metal':        { bg: '#1a0a00', accent: '#cc6600', text: '#ff8833' },
  'Heavy Metal':        { bg: '#0a0a10', accent: '#444488', text: '#8888cc' },
  'Metalcore':          { bg: '#0a100a', accent: '#006633', text: '#33cc66' },
  'Symphonic Metal':    { bg: '#100a1a', accent: '#6600aa', text: '#aa44ff' },
  'Progressive Metal':  { bg: '#0a1015', accent: '#006688', text: '#33aacc' },
  'Folk Metal':         { bg: '#0f0a05', accent: '#665500', text: '#bbaa44' },
  'Nu Metal':           { bg: '#0f0505', accent: '#883344', text: '#cc5566' },
};

function getPattern(index) {
  const patterns = [
    // Diagonal lines
    `<line x1="0" y1="0" x2="400" y2="400" stroke="ACCENT" stroke-width="0.5" opacity="0.15"/>
     <line x1="50" y1="0" x2="450" y2="400" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>
     <line x1="-50" y1="0" x2="350" y2="400" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>
     <line x1="100" y1="0" x2="500" y2="400" stroke="ACCENT" stroke-width="0.3" opacity="0.08"/>
     <line x1="-100" y1="0" x2="300" y2="400" stroke="ACCENT" stroke-width="0.3" opacity="0.08"/>`,
    // Circle
    `<circle cx="200" cy="200" r="120" fill="none" stroke="ACCENT" stroke-width="1" opacity="0.15"/>
     <circle cx="200" cy="200" r="80" fill="none" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>
     <circle cx="200" cy="200" r="160" fill="none" stroke="ACCENT" stroke-width="0.3" opacity="0.08"/>`,
    // Cross
    `<line x1="200" y1="40" x2="200" y2="360" stroke="ACCENT" stroke-width="1" opacity="0.12"/>
     <line x1="40" y1="200" x2="360" y2="200" stroke="ACCENT" stroke-width="1" opacity="0.12"/>`,
    // Diamond
    `<polygon points="200,40 360,200 200,360 40,200" fill="none" stroke="ACCENT" stroke-width="1" opacity="0.15"/>
     <polygon points="200,80 320,200 200,320 80,200" fill="none" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>`,
    // Triangle
    `<polygon points="200,50 370,350 30,350" fill="none" stroke="ACCENT" stroke-width="1" opacity="0.15"/>
     <polygon points="200,100 320,320 80,320" fill="none" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>`,
    // Star burst
    `<line x1="200" y1="30" x2="200" y2="370" stroke="ACCENT" stroke-width="0.5" opacity="0.12"/>
     <line x1="30" y1="200" x2="370" y2="200" stroke="ACCENT" stroke-width="0.5" opacity="0.12"/>
     <line x1="60" y1="60" x2="340" y2="340" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>
     <line x1="340" y1="60" x2="60" y2="340" stroke="ACCENT" stroke-width="0.5" opacity="0.1"/>`,
  ];
  return patterns[index % patterns.length];
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

function generateSVG(artist, title, year, genre, index) {
  const colors = GENRE_COLORS[genre] || GENRE_COLORS['Heavy Metal'];
  const pattern = getPattern(index).replace(/ACCENT/g, colors.accent);

  const artistLines = wrapText(artist.toUpperCase(), 18);
  const titleLines = wrapText(title, 20);

  const artistY = 130 - (artistLines.length - 1) * 14;
  const titleY = 220 - (titleLines.length - 1) * 16;

  const artistTextEls = artistLines.map((line, i) =>
    `<text x="200" y="${artistY + i * 28}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="22" font-weight="900" fill="${colors.text}" letter-spacing="3">${escapeXml(line)}</text>`
  ).join('\n    ');

  const titleTextEls = titleLines.map((line, i) =>
    `<text x="200" y="${titleY + i * 32}" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#e0e0e0" font-style="italic">${escapeXml(line)}</text>`
  ).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="bg${index}" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${colors.bg}" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="shine${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.03"/>
      <stop offset="50%" stop-color="white" stop-opacity="0"/>
      <stop offset="100%" stop-color="white" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="${colors.bg}"/>
  <rect width="400" height="400" fill="url(#bg${index})"/>
  ${pattern}
  <rect width="400" height="400" fill="url(#shine${index})"/>
  <rect x="20" y="20" width="360" height="360" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.3" rx="2"/>
  <rect x="25" y="25" width="350" height="350" fill="none" stroke="${colors.accent}" stroke-width="0.5" opacity="0.15" rx="1"/>
  <line x1="40" y1="170" x2="360" y2="170" stroke="${colors.accent}" stroke-width="0.5" opacity="0.2"/>
  <line x1="40" y1="280" x2="360" y2="280" stroke="${colors.accent}" stroke-width="0.5" opacity="0.2"/>
  ${artistTextEls}
  ${titleTextEls}
  <text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${colors.text}" opacity="0.6" letter-spacing="2">${escapeXml(genre.toUpperCase())}</text>
  <text x="200" y="348" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666666" letter-spacing="1">${year || ''}</text>
</svg>`;
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

  console.log(`Generating covers for ${products.length} products...`);

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const filename = `cover-${p.id}.svg`;
    const filepath = path.join(uploadsDir, filename);
    const svg = generateSVG(p.artist, p.title, p.release_year, p.genre_name || 'Heavy Metal', i);
    fs.writeFileSync(filepath, svg);

    await sequelize.query(`UPDATE products SET cover_image = ? WHERE id = ?`, {
      replacements: [`/uploads/${filename}`, p.id],
    });

    console.log(`  [${i + 1}/${products.length}] ${p.artist} - ${p.title}`);
  }

  console.log('\nDone! All covers generated.');
  await sequelize.close();
}

main().catch(err => { console.error(err); process.exit(1); });
