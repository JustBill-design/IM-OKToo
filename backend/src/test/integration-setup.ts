
import * as dotenv from 'dotenv';
import { getTestDbConnection, setupTestDatabase, seedTestData, cleanupTestData } from './cloud-test-setup';
dotenv.config();
process.env.NODE_ENV = 'test';
console.log('cloud db for integration tests');
console.log('Database:', process.env.DB_NAME);
console.log('Instance:', process.env.INSTANCE_CONNECTION_NAME);
beforeAll(async () => {
  await setupTestDatabase();
  await seedTestData();
}, 30000);

afterAll(async () => {
  await cleanupTestData();
}, 10000);
export { cleanupTestData, seedTestData, getTestDbConnection };
