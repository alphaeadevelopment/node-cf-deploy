#!/usr/bin/env node
'use strict';

require('babel-register')({
  ignore: /node_modules[\\/](?!@alphaeadev\/node-cf-deploy)/
});
require('babel-polyfill');
require('./src/main.js');
