import mysql from 'mysql2/promise';
import { Connector } from '@google-cloud/cloud-sql-connector';
import * as dotenv from 'dotenv';
dotenv.config();

const db = async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: 'PUBLIC'
  });
  
  return mysql.createPool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
};

// In case the PRIVATE_IP environment variable is defined then we set
// the ipType=PRIVATE for the new connector instance, otherwise defaults
// to public ip type.
const getIpType = () =>
  process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
    ? 'PRIVATE'
    : 'PUBLIC';

// connectWithConnector initializes a connection pool for a Cloud SQL instance
// of MySQL using the Cloud SQL Node.js Connector.
const connectWithConnector = async config => {
  // Note: Saving credentials in environment variables is convenient, but not
  // secure - consider a more secure solution such as
  // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
  // keep secrets safe.
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
    ipType: getIpType(),
  });
  const dbConfig = {
    ...clientOpts,
    user: process.env.DB2_USER, // e.g. 'my-db-user'
    password: process.env.DB2_PASS, // e.g. 'my-db-password'
    database: process.env.DB2_NAME, // e.g. 'my-database'
    // ... Specify additional properties here.
    ...config,
  };
  // Establish a connection to the database.
  return mysql.createPool(dbConfig);
};

export default db;
export {connectWithConnector};