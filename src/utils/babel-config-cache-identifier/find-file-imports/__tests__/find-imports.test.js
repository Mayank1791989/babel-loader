/* @flow */
import findImports from '../index';
import path from 'path';

test('fixture1', () => {
  const { code, imports } = findImports(
    path.join(__dirname, 'fixtures', 'fixture1.js'),
  );

  expect(imports).toMatchInlineSnapshot(`
Array [
  "@babel/core",
  "lodash",
  "diff",
]
`);

  expect(code).toMatchInlineSnapshot(`
"/* @flow */
/* eslint-disable */
import babel from '@babel/core';
import lodash from 'lodash';

const diff = require('diff');

// $FlowDisableNextLine
require('tester'+diff);
// $FlowDisableNextLine
require(diff);

console.log(babel, lodash, diff);
"
`);
});
