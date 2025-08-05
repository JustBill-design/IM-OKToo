
import * as dotenv from 'dotenv';
dotenv.config();
process.env.NODE_ENV = 'test'
console.log('wait');
console.log('Database:', process.env.DB_NAME);
console.log('Host: 127.0.0.1:3307');

const originalConsoleLog = console.log
console.log = (...args) => {
  if (args[0]?.includes?.('DB_') || args[0]?.includes?.('Cloud SQL')) {
    originalConsoleLog(...args);
  }
}
console.error = originalConsoleLog
export const cleanupTestData = async () => {
  console.log('Test cleanup');
}

export const seedTestData = async () => {
  console.log('seeded');
}
