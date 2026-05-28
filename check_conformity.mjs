import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';

// Read DATABASE_URL from .env or environment
const envFile = '/home/ubuntu/wms-simulator/.env';
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  try {
    const env = readFileSync(envFile, 'utf8');
    const match = env.match(/DATABASE_URL=(.+)/);
    if (match) dbUrl = match[1].trim();
  } catch {}
}

const conn = await createConnection(dbUrl);

const [mods] = await conn.query('SELECT id, code, title_fr FROM modules ORDER BY id');
console.log('=== MODULES ===');
for (const m of mods) console.log(m.id, m.code, '|', m.title_fr);

const [scens] = await conn.query('SELECT module_id, title_fr, difficulty FROM scenarios ORDER BY module_id, id');
console.log('\n=== SCENARIOS ===');
for (const s of scens) console.log('M'+s.module_id, s.difficulty, '|', s.title_fr);

await conn.end();
