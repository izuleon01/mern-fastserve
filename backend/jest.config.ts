// jest.config.js or update "jest" section in package.json
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1', // Adjust this based on your project structure
    },
  };
  