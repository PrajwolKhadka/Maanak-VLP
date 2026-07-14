module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
//   setupFilesAfterFramework: ['./jest.setup.ts'],
  setupFilesAfterFramework: undefined,

};