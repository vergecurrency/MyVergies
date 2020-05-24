module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
  transform: {
    '.*\\.vue$': 'vue-jest',
    '.*\\.ts$': 'ts-jest'
  },
  testRegex: '.*/.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
