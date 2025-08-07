
import mysql from 'mysql2/promise';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import * as dotenv from 'dotenv';

dotenv.config();

async function testCloudDbConnection() {
  console.log('testing cloud sql connection');
  console.log('instance', process.env.INSTANCE_CONNECTION_NAME);
  console.log('database', process.env.DB_NAME);
  console.log('user', process.env.DB_USER);
  
  try {
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
      ipType: IpAddressTypes.PUBLIC
    });
    
    console.log('connector options obtained');
    
    const connection = await mysql.createConnection({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 30000,
    });
    
    console.log('connection created');
    
    const [result] = await connection.execute('SELECT 1 as test, NOW() as timestamp');
    console.log('query executed successfully', result);
    
    const [tables] = await connection.execute("SHOW TABLES");
    console.log('available tables', tables);
    
    await connection.end();
    await connector.close();
    
    console.log('cloud database connection test completed');
    return true;
    
  } catch (error) {
    console.error('cloud database connection failed');
    console.error('error message', error.message);
    console.error('error code', error.code);
    return false;
  }
}

testCloudDbConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('unexpected error', error);
    process.exit(1);
  });
