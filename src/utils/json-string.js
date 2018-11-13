/* @flow */
import chalk from 'chalk';
import { diffJson } from 'diff';

export opaque type JSONString<TObject>: string = string;

export function toJSONString<TValue>(val: TValue): JSONString<TValue> {
  return JSON.stringify(val);
}

export function parseJSONString<TValue>(val: JSONString<TValue>): TValue {
  return JSON.parse(val);
}

export function diffJSONString(
  a: JSONString<Object>,
  b: JSONString<Object>,
): string {
  const aVal = parseJSONString(a);
  const bVal = parseJSONString(b);
  const diff = diffJson(aVal, bVal);

  let diffStr = '';
  diff.forEach(part => {
    let color = chalk.grey;
    if (part.added) {
      color = chalk.dim.green;
    } else if (part.removed) {
      color = chalk.dim.red;
    }
    diffStr += color(part.value);
  });

  return diffStr;
}
