/* @flow */
import babelPluginFindImports, {
  getImportsFromMetadata,
} from './babel-plugin-find-imports';
import * as babel from '@babel/core';
import fs from 'fs';

export default function findFileImports(
  filepath: string,
): { code: string, imports: Array<string> } {
  const code = fs.readFileSync(filepath, 'utf-8');
  const { metadata } = babel.transformSync(code, {
    filename: filepath,
    babelrc: false,
    parserOpts: {
      plugins: [
        'jsx',
        'flow',
        'doExpressions',
        'objectRestSpread',
        'classProperties',
        'exportExtensions',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
      ],
    },
    plugins: [[babelPluginFindImports, {}]],
  });
  const imports = getImportsFromMetadata(metadata);
  return { imports, code };
}
