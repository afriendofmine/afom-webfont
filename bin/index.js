#! /usr/bin/env node
var fs = require('fs');
var path = require('path');
var exists = fs.existsSync || path.existsSync;
var join = path.join;
var cwd = process.cwd();
var program = require('commander');
var afomWebpackIcons = require('afom-webfont');
var packageJson = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));

// configure program
program
    .version(packageJson.version)
    .option('-c, --config <path>', 'Add configuration file')
    .option('-w, --watch [bool]', 'Watch for file changes', false)
    .parse(process.argv);

// check for afom-webfont.config.js existance
var configFilename = packageJson.name + '.config.js';
var configExists = exists(join(cwd, configFilename));
var config = {};

if (configExists) {
    // use config afom-webfont.config.js
    config = require(join(cwd, configFilename));
}

if (program.config) {
    // or use config passed through options
    config = require(join(cwd, program.config));
}

// initialize afom-webfont and generate files
new afomWebpackIcons(Object.assign(config, {
    watch: program.watch
}));
