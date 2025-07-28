// Backend test setup
import mysql from 'mysql2/promise'
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    execute: jest.fn(),
    end: jest.fn(),
    query: jest.fn()
  })
}))
process.env.DB_HOST = 'localhost'
process.env.DB_USER = 'test_user'  
process.env.DB_PASSWORD = 'test_password'
process.env.DB_NAME = 'test_imoktoo'
process.env.NODE_ENV = 'test'
const originalConsoleLog = console.log
console.log = jest.fn()
console.error = originalConsoleLog
