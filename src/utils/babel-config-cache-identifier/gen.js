/* @flow */
import _memoize from 'lodash/memoize';
import invariant from 'invariant';
import chalk from 'chalk';
import genFileContentHash from './gen-file-content-hash';
import genPkgVersion from './gen-pkg-version';
import { type JSONString, toJSONString } from '../json-string';
import log from '../log';

type ConfigItem = Object;

type Options = {|
  babelConfig: {|
    root: string,
    envName: string,
    presets: $ReadOnlyArray<ConfigItem>,
    plugins: $ReadOnlyArray<ConfigItem>,
  |},
  isRelay: boolean,
|};

type Item = {
  name: string,
  version: mixed,
  options: { [key: string]: mixed },
};

export type Identifier = {
  envName: string,
  root: string,
  presets: $ReadOnlyArray<Item>,
  plugins: $ReadOnlyArray<Item>,
};

export default _memoize(
  (options: Options): JSONString<Identifier> => {
    const { babelConfig, isRelay } = options;

    const perfKey = `
      generated cache-identifier
      isRelay: '${chalk.bold(isRelay.toString())}
    `;
    log.time(perfKey);

    const identifier = {
      envName: babelConfig.envName,
      root: babelConfig.root,
      presets: mapConfigItems(babelConfig.presets, isRelay, babelConfig.root),
      plugins: mapConfigItems(babelConfig.plugins, isRelay, babelConfig.root),
    };

    log.clearLine();
    log.timeEnd(perfKey);

    return toJSONString(identifier);
  },
  args => JSON.stringify(args),
);

function mapConfigItems(
  items: $ReadOnlyArray<ConfigItem>,
  isRelay: boolean,
  root: string,
): $ReadOnlyArray<Item> {
  return items
    .map(item => {
      const name = getConfigItemName(item);
      if (isRelayPkg(name) && !isRelay) {
        // only include relay pkg for relay files
        return null;
      }

      const version = genPkgVersion(name, root);
      const options = { ...item._descriptor.options };

      if (isRelayPkg(name)) {
        invariant(
          typeof options === 'object' && options.schema,
          '[unexpected error] babel-plugin-relay: You should provide schema for relay plugin',
        );
        // add schemaVersion
        options.schemaVersion = genFileContentHash(options.schema);
      }

      return {
        name,
        version,
        options,
      };
    })
    .filter(Boolean);
}

function getConfigItemName(configItem: ConfigItem): string {
  return configItem._descriptor.name || configItem._descriptor.file.request;
}

function isRelayPkg(pkg: string) {
  // not a good check but ok for now
  // we are using only babel-plugin-relay for all relay related
  // transformation which contains relay so ok for now
  return /relay/u.test(pkg);
}
