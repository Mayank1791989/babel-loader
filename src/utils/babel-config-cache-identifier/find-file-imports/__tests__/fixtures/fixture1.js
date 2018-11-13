/* @flow */
/* eslint-disable */
import babel from '@babel/core';
import lodash from 'lodash';

const diff = require('diff');

// $FlowDisableNextLine
require('tester'+diff);
// $FlowDisableNextLine
require(diff);

console.log(babel, lodash, diff);
