export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend/src/tests'],
  testMatch: ['**/*.test.ts'],
  testTimeout: 5000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles:true
};
