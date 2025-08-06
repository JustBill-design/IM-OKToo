import mysql from 'mysql2/promise';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import * as dotenv from 'dotenv';
dotenv.config();

const db = async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: IpAddressTypes.PUBLIC
  });
  
  return mysql.createPool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectTimeout: 30000,
  });
};

export default db;