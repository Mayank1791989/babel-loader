/* @flow */
import genPkgVersion from '../gen-pkg-version';

test('fixture1', () => {
  const version = genPkgVersion('./fixtures/fixture1.js', __dirname);
  expect(version).toEqual({
    hash: '9a064e2952',
    imports: {
      '@babel/core': '7.5.4',
      diff: '4.0.1',
      lodash: '4.17.14',
      path: process.version,
    },
  });
});
