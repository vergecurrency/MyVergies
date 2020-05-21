module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
  transform: {
    '.*\\.vue$': 'vue-jest',
    '.*\\.ts$': 'ts-jest'
  },
  testRegex: '.*/tests/(.*)spec\\.ts',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
