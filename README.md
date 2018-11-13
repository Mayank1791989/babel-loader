[![npm](https://img.shields.io/npm/v/babel-loader.svg?style=flat-square)](https://www.npmjs.com/package/@playlyfe/babel-loader)
[![npm](https://img.shields.io/npm/dt/@playlyfe/babel-loader.svg?style=flat-square)](https://www.npmjs.com/package/@playlyfe/babel-loader)
[![Travis](https://img.shields.io/travis/Mayank1791989/babel-loader.svg?style=flat-square)](https://travis-ci.org/Mayank1791989/babel-loader)

<div align="center">
  <a href="https://github.com/babel/babel">
    <img src="https://rawgit.com/babel/logo/master/babel.svg" alt="Babel logo" width="200" height="200">
  </a>
  <a href="https://github.com/webpack/webpack">
    <img src="https://webpack.js.org/assets/icon-square-big.svg" alt="webpack logo" width="200" height="200">
  </a>
</div>

# babel-loader

> This package allows transpiling JavaScript files using [Babel](https://github.com/babel/babel) and [webpack](https://github.com/webpack/webpack).

## Requirements

```javascript
{
  node: '>=8.0.0',
  webpack: '>=4.0.0',
  babel: '>=7.0.0'
}
```

## Install

```sh
$ npm install --save-dev @playlyfe/babel-loader
$ yarn add --dev @playlyfe/babel-loader
```

## Usage

webpack documentation: [Loaders](https://webpack.js.org/loaders/)

Within your webpack configuration object, you'll need to add the babel-loader to the list of modules, like so:

```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: '@playlyfe/babel-loader',
        options: {
          cacheDirectory: 'cache-dir-path'
        }
      }
    }
  ]
}
```

## Options

* `cacheDirectory`: ```false | string``` (Default `false`). When set, the given directory will be used to cache the results of the loader. Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process on each run.
