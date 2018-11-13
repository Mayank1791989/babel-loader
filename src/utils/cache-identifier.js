/* @flow */
import {
  type Identifier,
  printBabelConfigCacheIdentifierDiff,
} from './babel-config-cache-identifier';
import _memoize from 'lodash/memoize';
import {
  type JSONString,
  toJSONString,
  parseJSONString,
  diffJSONString,
} from './json-string';
import log from './log';

type Val = {
  babelConfig: JSONString<Identifier>,
  babelCore: string,
  babelLoader: string,
  source: string,
  env: ?string,
};

export default {
  generate: (val: Val): JSONString<Val> => toJSONString(val),

  diff: (
    oldIdent: JSONString<Val> | null,
    newIdent: JSONString<Val>,
  ): $ReadOnlyArray<string> => {
    const newVal = parseJSONString(newIdent);
    if (oldIdent == null) {
      Object.keys(newVal).forEach(key => {
        if (key !== 'source') {
          // eslint-disable-next-line no-use-before-define
          printDiff(key, null, newVal[key]);
        }
      });
      return ['new'];
    }

    const oldVal: Val = parseJSONString(oldIdent);
    return Object.keys(newVal).reduce((acc, key) => {
      if (newVal[key] !== oldVal[key]) {
        if (key !== 'source') {
          // eslint-disable-next-line no-use-before-define
          printDiff(key, oldVal[key], newVal[key]);
        }
        acc.push(key);
      }
      return acc;
    }, []);
  },
};

const printDiff = _memoize(
  (key, oldVal, newVal) => {
    if (key === 'babelConfig') {
      printBabelConfigCacheIdentifierDiff((oldVal: $FixMe), (newVal: $FixMe));
    } else {
      log.write(
        diffJSONString(
          toJSONString({ [key]: oldVal }),
          toJSONString({ [key]: newVal }),
        ),
        false,
      );
    }
  },
  (key, oldVal, newVal) => `${key}-${oldVal}-${newVal}`,
);
