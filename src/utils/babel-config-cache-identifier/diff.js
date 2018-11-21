/* @flow */
import { type Identifier } from './gen';
import { type JSONString, diffJSONString, toJSONString } from '../json-string';
import log from '../_log';

export function printDiff(
  a: null | JSONString<Identifier>,
  b: JSONString<Identifier>,
) {
  const diff = diffJSONString(a || toJSONString({}), b);
  log.write(diff, false);
}
