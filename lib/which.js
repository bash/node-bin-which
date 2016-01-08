#!/usr/bin/env node

'use strict';

var pathUtil = require('path'),
    fs = require('fs');

module.exports = which;
module.exports._resolve = resolve;

/**
 *
 * @param {string} path
 * @param {{PWD: string, HOME: string}} env
 * @returns {string}
 */
function resolve(path, env) {
    if (path.split('/')[0] === '~') {
        return pathUtil.join(env.HOME, path.slice(2));
    }

    return pathUtil.resolve(env.PWD, path);
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

/**
 *
 * @param {string} program
 * @param {{PATH: string}} [env]
 * @returns {Array<string>}
 */
function which(program, env) {
    if (env === undefined) {
        /* istanbul ignore next */
        env = process.env;
    }

    return env.PATH.split(':')
        .map(function (path) {
            return resolve(path, env);
        })
        .map(function (path) {
            return pathUtil.join(path, program);
        })
        .filter(exists);
}