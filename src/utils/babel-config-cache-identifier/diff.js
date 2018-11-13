/* @flow */
import { type Identifier } from './gen';
import { type JSONString, diffJSONString, toJSONString } from '../json-string';
import _memoize from 'lodash/memoize';
import log from '../log';

export const printDiff = _memoize(
  (a: null | JSONString<Identifier>, b: JSONString<Identifier>) => {
    const diff = diffJSONString(a || toJSONString({}), b);
    log.write(diff, false);
  },
  (a, b) => `${a}-${b}`,
);
