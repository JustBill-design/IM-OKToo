
import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

dotenv.config();
process.env.NODE_ENV = 'test';
process.env.INSTANCE_CONNECTION_NAME = process.env.INSTANCE_CONNECTION_NAME;
process.env.DB_USER = process.env.DB_USER;
process.env.DB_PASS = process.env.DB_PASS;
process.env.DB_NAME = process.env.DB_NAME; 
let testDbConnection: mysql.Pool | null = null;

export const getTestDbConnection = async (): Promise<mysql.Pool> => {
  if (!testDbConnection) {
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
      ipType: IpAddressTypes.PUBLIC
    });
    
    testDbConnection = mysql.createPool({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 30000,
      connectionLimit: 5,
    });
  }
  return testDbConnection;
};

export const setupTestDatabase = async () => {
  console.log('setting up test database');
  const db = await getTestDbConnection();
  console.log('cloud database tables ready');
};

export const seedTestData = async () => {
  console.log('seeding test data');
  const db = await getTestDbConnection();
  await db.execute("DELETE FROM Posts WHERE username LIKE 'test_%'");
  await db.execute("DELETE FROM Events WHERE caretaker LIKE 'test_%'");
  await db.execute("DELETE FROM Users WHERE username LIKE 'test_%'");
  await db.execute("DELETE FROM Categories WHERE name IN ('Test Category 1', 'Test Category 2')");
  
  await db.execute(`
    INSERT IGNORE INTO Categories (name) VALUES 
    ('Test Stuff'),
    ('More Test Stuff')
  `);
  
  await db.execute(`
    INSERT IGNORE INTO Users (username, first_name, email, password_hash) VALUES 
    ('test_guy1', 'TestGuy', 'test_guy1@mymail.sutd.edu.sg', '$2b$10$dummy.hash.for.testing'),
    ('test_girl2', 'TestGirl', 'test_girl2@mymail.sutd.edu.sg', '$2b$10$dummy.hash.for.testing')
  `);
  
  const [categories] = await db.execute("SELECT category_id FROM Categories LIMIT 2");
  const categoryId = (categories as any)[0]?.category_id || 1;
  
  await db.execute(`
    INSERT IGNORE INTO Posts (title, content, username, category_id, views, likes_count, comments_count) VALUES 
    ('test post 1 plz ignore', 'this is just test content nothing special here', 'test_guy1', ?, 10, 5, 2),
    ('tech stuff idk', 'some tech discussion probably about javascript or something', 'test_girl2', ?, 25, 8, 4)
  `, [categoryId, categoryId]);

  await db.execute(`
    INSERT IGNORE INTO Events (title, category, start, end, description, caretaker) VALUES 
    ('test meeting dont come', 'Test', '2025-08-10 10:00:00', '2025-08-10 11:00:00', 'boring test meeting dont actually show up', 'test_guy1'),
    ('study session maybe', 'Academic', '2025-08-11 14:00:00', '2025-08-11 16:00:00', 'group study if anyone wants to suffer together', 'test_girl2')
  `);
  
  console.log('test data seeded');
};

export const cleanupTestData = async () => {
  console.log('cleaning up test data');
  const db = await getTestDbConnection();
  
  await db.execute("DELETE FROM Posts WHERE username LIKE 'test_%'");
  await db.execute("DELETE FROM Events WHERE caretaker LIKE 'test_%'");
  await db.execute("DELETE FROM Users WHERE username LIKE 'test_%'");
  await db.execute("DELETE FROM Categories WHERE name IN ('Test Stuff', 'More Test Stuff')");
  
  console.log('test cleanup done');
};

export const closeTestDbConnection = async () => {
  if (testDbConnection) {
    await testDbConnection.end();
    testDbConnection = null;
  }
};

export const globalTestSetup = async () => {
  await setupTestDatabase();
  await seedTestData();
};

export const globalTestTeardown = async () => {
  await cleanupTestData();
  await closeTestDbConnection();
};
