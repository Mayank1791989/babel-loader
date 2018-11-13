/* @flow */
module.exports = {
  testRegex: '__tests__/.*\\.test\\.js$',
  testEnvironment: 'node',
  roots: ['src/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
