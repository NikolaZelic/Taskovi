'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_PATH: '"http://695u121.mars-t.mars-hosting.com/mngapi/"'
});
