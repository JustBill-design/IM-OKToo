
import mysql from 'mysql2/promise';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function runMigrations() {
  console.log('running sql cloud migrations');
  console.log('instance', process.env.INSTANCE_CONNECTION_NAME);
  console.log('database', process.env.DB_NAME);
  console.log('user', process.env.DB_USER);

  try {
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
      ipType: IpAddressTypes.PUBLIC
    });

    const connection = await mysql.createConnection({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 30000,
      multipleStatements: true
    });

    console.log('connected to cloud sql');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('migrations table ready');
    const migrationsDir = path.join(__dirname, 'backend', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    console.log(`found ${migrationFiles.length} migration files`);

    for (const migrationFile of migrationFiles) {
      const migrationName = path.basename(migrationFile, '.sql');
      const [existing] = await connection.execute(
        'SELECT COUNT(*) as count FROM migrations WHERE migration_name = ?',
        [migrationName]
      );
      
      if ((existing as any)[0].count > 0) {
        console.log(`skipped ${migrationName} already run`);
        continue;
      }
      const migrationPath = path.join(migrationsDir, migrationFile);
      let migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      if (migrationSQL.trim()) {
        console.log(`running migration ${migrationName}`);
        migrationSQL = migrationSQL
          .replace(/CREATE DATABASE IF NOT EXISTS [^;]+;/gi, '')
          .replace(/USE [^;]+;/gi, '')
          .trim();
        
        if (migrationSQL) {
          const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
          
          for (const statement of statements) {
            if (statement.trim()) {
              await connection.execute(statement);
            }
          }
        }
        await connection.execute(
          'INSERT INTO migrations (migration_name) VALUES (?)',
          [migrationName]
        );
        
        console.log(`completed ${migrationName}`);
      } else {
        console.log(`skipped ${migrationName} empty file`);
      }
    }

    await connection.end();
    await connector.close();
    
    console.log('all migrations completed');
    
  } catch (error) {
    console.error('migration failed', error);
    process.exit(1);
  }
}

runMigrations();
