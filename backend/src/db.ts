import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const db = async () => {
  console.log('Cloud SQL Proxy');
  
  return mysql.createPool({
    host: '127.0.0.1',
    port:3307,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10
  });
};

export default db;