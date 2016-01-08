#!/usr/bin/env node

'use strict';

var which = require('./lib/which');

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
 * @template T
 * @param {Array<T>} a
 * @param {Array<T>} b
 *
 * @returns {Array<T>}
 */
function concat(a, b) {
    return [].concat(a, b);
}

/**
 *
 * @param {*} value
 * @returns {boolean}
 */
function isNotUndefined(value) {
    return value !== undefined;
}

/**
 *
 * @param {string} program
 * @returns {Array}
 */
function whichWithEnv(program) {
    return which(program, process.env);
}

var args = parseArgv(process.argv.slice(2));

// print usage
if (args.programs.length === 0) {
    console.log('usage: which [-al] PROGRAM...');
    process.exit();
}

var outputAllArray = args.flags.indexOf('-al') !== -1 || args.flags.indexOf('-la') !== -1,
    outputAll = outputAllArray || args.flags.indexOf('-a') !== -1,
    outputArray = outputAllArray || args.flags.indexOf('-l') !== -1;

if (outputArray) {
    var paths = args.programs
        .map(whichWithEnv)
        .map(function(paths){
            if (outputAll) {
                return paths;
            }

            return paths[0];
        })
        .filter(isNotUndefined)
        .reduce(concat, []);

    console.log(paths);
    process.exit();
}

var programs = {};

args.programs.forEach(function(program){
    var paths = whichWithEnv(program);

    if (!outputAll) {
        paths = paths[0];
    }

    programs[program] = paths;
});

console.log(programs);