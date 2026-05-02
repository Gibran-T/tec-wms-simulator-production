/**
 * Seed quiz data for all 5 modules (M1-M5)
 * Calls the existing seedQuizData() function from db.ts
 */
import { createRequire } from 'module';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Load environment variables
import { config } from 'dotenv';
config({ path: '/home/ubuntu/tec-wms-simulator-production/.env' });

// We need to run this as a tsx script
// Use tsx to execute the TypeScript seedQuizData function
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Create a temporary TypeScript runner script
const runnerContent = `
import { seedQuizData } from '../server/db';

async function main() {
  console.log('Seeding quiz data for all 5 modules...');
  try {
    await seedQuizData();
    console.log('✅ Quiz data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding quiz data:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();
`;

import { writeFileSync, unlinkSync } from 'fs';
const tmpFile = path.join(projectRoot, 'scripts', '_seed-quizzes-runner.ts');
writeFileSync(tmpFile, runnerContent);

try {
  execSync(`cd ${projectRoot} && npx tsx scripts/_seed-quizzes-runner.ts`, { 
    stdio: 'inherit',
    env: { ...process.env }
  });
} finally {
  try { unlinkSync(tmpFile); } catch {}
}
