/* @flow */
import cacache from 'cacache/en';

type Params<TIdentifier, TResult> = {
  directory: string,
  sourceFileName: string,
  identifier: TIdentifier,
  transform: (
    oldIdentifier: TIdentifier | null,
    newIdentfier: TIdentifier,
  ) => TResult,
};

type Info<TIdentifier> = { metadata: { identifier: TIdentifier } };

export default function cacheTransform<TIdentifier, TResult>(
  params: Params<TIdentifier, TResult>,
): Promise<TResult> {
  return getInfo<TIdentifier>(params.directory, params.sourceFileName).then(
    info => {
      if (!info) {
        // not in cache
        return put(
          params.directory,
          params.sourceFileName,
          params.transform(null, params.identifier),
          params.identifier,
        );
      }

      // check data present in cache is same
      if (info.metadata.identifier !== params.identifier) {
        // present in cache but something changed
        return put(
          params.directory,
          params.sourceFileName,
          params.transform(info.metadata.identifier, params.identifier),
          params.identifier,
        );
      }

      // present in cache nothing changed
      // read from cache
      return get<TResult>(params.directory, params.sourceFileName);
    },
    () =>
      put(
        params.directory,
        params.sourceFileName,
        params.transform(null, params.identifier),
        params.identifier,
      ),
  );
}

function getInfo<TIdentifier>(
  directory: string,
  sourceFileName: string,
): Promise<?Info<TIdentifier>> {
  return cacache.get.info(directory, sourceFileName);
}

function get<TResult>(directory: string, sourceFileName: string): TResult {
  return cacache
    .get(directory, sourceFileName)
    .then(({ data }) => JSON.parse(data.toString()));
}

function put<TResult, TIdentifier>(
  directory: string,
  sourceFileName: string,
  transformedSource: TResult,
  identifier: TIdentifier,
): Promise<TResult> {
  return cacache
    .put(directory, sourceFileName, JSON.stringify(transformedSource), {
      metadata: {
        identifier,
      },
    })
    .then(() => transformedSource);
}
