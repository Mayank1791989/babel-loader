/* @flow */
module.exports = {
  plugins: ['playlyfe'],
  extends: [
    'plugin:playlyfe/js',
    'plugin:playlyfe/flowtype',
    'plugin:playlyfe/prettier',
    'plugin:playlyfe/testing:jest',
  ],
  env: {
    node: true,
  },
  rules: {
    'arrow-parens': 'off',
  },
};
