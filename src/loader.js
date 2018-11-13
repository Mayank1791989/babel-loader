/* @flow */
/* eslint-disable playlyfe/babel-no-invalid-this */
import * as babel from '@babel/core';
import loaderUtils from 'loader-utils';
import path from 'path';

import cacheTransform from './utils/cache-transform';
import CacheIdentifier from './utils/cache-identifier';
import { genBabelConfigCacheIdentifier } from './utils/babel-config-cache-identifier';
import isRelaySource from './utils/is-relay-source';
import transform from './transform';

export default async function loader(source: string, inputSourceMap: ?string) {
  const filename = this.resourcePath;
  const isRelay = isRelaySource(source);
  const sourceRoot = process.cwd();
  const userOptions = loaderUtils.getOptions(this) || {};

  const options = {
    filename,
    inputSourceMap,
    sourceRoot,
    sourceMap: this.sourceMap,
    sourceFileName: path.relative(sourceRoot, filename),
    caller: {
      name: '@playlyfe/babel-loader',
      supportsStaticESM: true,
      supportsDynamicImport: true,
    },
  };

  const config = babel.loadPartialConfig(options);
  const tOptions = { isRelay, ...options };

  if (config) {
    let result = null;
    if (userOptions.cacheDirectory) {
      result = await cacheTransform({
        directory: userOptions.cacheDirectory,
        sourceFileName: options.sourceFileName,
        identifier: CacheIdentifier.generate({
          babelCoreVersion: babel.version,
          babelConfig: genBabelConfigCacheIdentifier({
            babelConfig: {
              root: config.options.root,
              envName: config.options.envName,
              presets: config.options.presets,
              plugins: config.options.plugins,
            },
            isRelay,
          }),
          source: loaderUtils.getHashDigest(source),
          env: process.env.BABEL_ENV || process.env.NODE_ENV,
        }),
        transform: (oldIdentifier, newIdentifier) => {
          const diffTags = CacheIdentifier.diff(oldIdentifier, newIdentifier);
          return transform(source, tOptions, diffTags);
        },
      });
    } else {
      result = transform(source, tOptions);
    }
    // storeInModuleMeta(this._module, result.metadata);
    return [result.code, result.map];
  }

  return [source, inputSourceMap];
}

// function storeInModuleMeta(_module, metadata) {
//   _module.buildMeta.babel = metadata; // eslint-disable-line no-param-reassign
// }
