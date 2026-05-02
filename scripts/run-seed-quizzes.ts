import { seedQuizData } from '../server/db';

async function main() {
  console.log('Seeding quiz data for all 5 modules (M1-M5)...');
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
