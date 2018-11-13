/* @flow */
import loader from './loader';
module.exports = function babelCustomLoader(
  source: string,
  inputSourceMap: string,
) {
  const callback = this.async();

  loader
    .call(this, source, inputSourceMap)
    .then(args => callback(null, ...args), err => callback(err));
};
