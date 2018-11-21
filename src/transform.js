/* @flow */
import LoaderError from './utils/Error';
import log from './utils/_log';
import chalk from 'chalk';
import * as babel from '@babel/core';

type FileResult = {
  metadata: {},
  code: string | null,
  map: string | null,
};

type BabelTransformOptions = {|
  sourceFileName: string,
|};

type Options = {
  isRelay: boolean,
  ...BabelTransformOptions,
};

export default function transform(
  source: string,
  options: Options,
  diffTagsArray?: $ReadOnlyArray<string>,
): FileResult {
  const { isRelay, ...tOptions } = options;
  const perfKey = genPerfKey(tOptions.sourceFileName, isRelay, diffTagsArray);

  log.time(perfKey);

  try {
    const result = babel.transform(source, tOptions);
    const { code, map, metadata } = result;

    if (map && (!map.sourcesContent || !map.sourcesContent.length)) {
      map.sourcesContent = [source];
    }

    log.clearLine();
    log.timeEnd(perfKey);

    return { code, map, metadata };
  } catch (err) {
    const error = err.message && err.codeFrame ? new LoaderError(err) : err;
    throw error;
  }
}

function genPerfKey(
  sourceFileName: string,
  isRelay: boolean,
  diffTagsArray?: $ReadOnlyArray<string>,
) {
  const isRelayTag = chalk.green.dim(isRelay ? '[Relay]' : '');
  const diffTags = diffTagsArray
    ? chalk.yellow.dim(`[changes: ${diffTagsArray.join(',')}]`)
    : '';

  return `'${sourceFileName}'${isRelayTag}${diffTags}`;
}
