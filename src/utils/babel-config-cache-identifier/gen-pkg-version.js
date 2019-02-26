/* @flow */
import _memoize from 'lodash/memoize';
import invariant from 'invariant';
import resolveFrom from 'resolve-from';
import findUp from 'find-up';
import isBuiltinModule from 'is-builtin-module';
import genHash from './gen-hash';
import findFileImports from './find-file-imports';
import path from 'path';
import { readJSONSync } from 'fs-extra';

const genPkgVersion = _memoize<[string, string], mixed>(
  (pkg, cwd) => {
    const pkgPath = resolveFrom(cwd, pkg);
    let version = null;
    if (!pkgPath) {
      throw pkgMissingError(pkg);
    }

    if (isNodeModule(pkgPath)) {
      // eslint-disable-next-line no-use-before-define
      version = getNodeModuleVersion(pkgPath);
    } else {
      version = getLocalFileVersion(pkgPath);
    }
    return version;
  },
  (a, b) => `${a}-${b}`,
);

export default genPkgVersion;

const getNodeModuleVersion = _memoize(
  (pkgPath: string): string => {
    if (isBuiltinModule(pkgPath)) {
      return getCurrentNodeVersion();
    }

    const { version } = readPkgUp(pkgPath);
    return version;
  },
);

function getLocalFileVersion(filePath: string): mixed {
  const { code, imports } = findFileImports(filePath);
  return {
    imports: imports.reduce((acc, pkg) => {
      acc[pkg] = genPkgVersion(pkg, path.dirname(filePath));
      return acc;
    }, {}),
    hash: genHash(code),
  };
}

function pkgMissingError(pkg: string): Error {
  return new Error(`couldn't find package '${pkg}'`);
}

function isNodeModule(pkgPath: string): boolean {
  return /node_modules/u.test(pkgPath) || isBuiltinModule(pkgPath);
}

function readPkgUp(cwd: string): { version: string } {
  const pkgJSONPath = findUp.sync('package.json', { cwd });
  invariant(
    pkgJSONPath,
    `[unexpected error] pakage.json not found for '${cwd}'`,
  );
  return readJSONSync(pkgJSONPath);
}

function getCurrentNodeVersion() {
  return process.version;
}
