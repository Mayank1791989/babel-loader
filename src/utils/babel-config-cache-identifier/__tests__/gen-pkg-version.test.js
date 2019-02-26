/* @flow */
import genPkgVersion from '../gen-pkg-version';

test('fixture1', () => {
  const version = genPkgVersion('./fixtures/fixture1.js', __dirname);
  expect(version).toMatchInlineSnapshot(`
Object {
  "hash": "9a064e2952",
  "imports": Object {
    "@babel/core": "7.3.4",
    "diff": "4.0.1",
    "lodash": "4.17.11",
    "path": "v8.14.0",
  },
}
`);
});
