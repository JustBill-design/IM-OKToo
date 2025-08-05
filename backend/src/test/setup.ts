// Backend test setup
import mysql from 'mysql2/promise'

jest.mock('mysql2/promise', () => ({
  createPool: jest.fn().mockReturnValue({
    getConnection: jest.fn().mockResolvedValue({
      execute: jest.fn(),
      release: jest.fn(),
      query: jest.fn()
    }),
    execute: jest.fn(),
    query: jest.fn(),
    end: jest.fn()
  })
}))


jest.mock('../db', () => {
  return jest.fn().mockResolvedValue({
    getConnection: jest.fn().mockResolvedValue({
      execute: jest.fn(),
      release: jest.fn(),
      query: jest.fn()
    }),
    execute: jest.fn(),
    query: jest.fn(),
    end: jest.fn()
  })
})

process.env.DB_HOST = 'localhost'
process.env.DB_USER = 'test_user'  
process.env.DB_PASSWORD = 'test_password'
process.env.DB_NAME = 'test_imoktoo'
process.env.NODE_ENV = 'test'

const originalConsoleLog = console.log
console.log = jest.fn()
console.error = originalConsoleLog
