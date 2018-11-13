/* @flow */
import {
  type Identifier,
  printBabelConfigCacheIdentifierDiff,
} from './babel-config-cache-identifier';
import { type JSONString, toJSONString, parseJSONString } from './json-string';

type Val = {
  babelConfig: JSONString<Identifier>,
  babelCoreVersion: string,
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
      printBabelConfigCacheIdentifierDiff(null, newVal.babelConfig);
      return ['new'];
    }

    const oldVal: Val = parseJSONString(oldIdent);
    return Object.keys(newVal).reduce((acc, key) => {
      if (newVal[key] !== oldVal[key]) {
        if (key === 'babelConfig') {
          printBabelConfigCacheIdentifierDiff(
            oldVal.babelConfig,
            newVal.babelConfig,
          );
        }
        acc.push(key);
      }
      return acc;
    }, []);
  },
};
