#!/usr/bin/env node

'use strict';

var pathUtil = require('path'),
    fs = require('fs');

/**
 *
 * @param {Array} argv
 * @returns {{flags: Array, programs: Array}}
 */
function parseArgv(argv) {
    var flags = [], programs = [];

    argv.forEach(function (arg) {
        if (arg.substr(0, 1) === '-') {
            flags.push(arg);
        } else {
            programs.push(arg);
        }
    });

    return { flags: flags, programs: programs };
}

/**
 *
 * @param {string} path
 * @returns {string}
 */
function resolve(path) {
    if (path[0] === '~') {
        return pathUtil.join(process.env.HOME, path.slice(1));
    }

    return pathUtil.resolve(process.env.PWD, path);
}

/**
 *
 * @param {string} path
 * @returns {boolean}
 */
function exists(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

var args = parseArgv(process.argv.slice(2));

// print usage
if (args.programs.length === 0) {
    console.log('usage: which [-a] PROGRAM...');
    process.exit();
}

var paths = process.env.PATH.split(':').map(resolve),
    outputAll = args.flags.indexOf('-a') !== -1,
    output = {};

args.programs.forEach(function (program) {
    var programPaths = paths.map(function (path) {
        return pathUtil.join(path, program);
    }).filter(exists);

    if (!outputAll) {
        programPaths = programPaths[0];
    }

    output[program] = programPaths;
});

console.log(output);