'use strict';

var assert = require('assert'),
    which = require('../lib/which'),
    path = require('path');

describe('which()', function () {
    it('returns an array', function () {
        assert(which('', { HOME: '/', PWD: '/', PATH: '/' }) instanceof Array);
    });

    it('looks up the absolute path of the executable', function () {
        var dir = path.resolve(__dirname + '/../node_modules/.bin'),
            env = { HOME: '/', PWD: '/', PATH: dir };

        assert.deepEqual([dir + '/mocha'], which('mocha', env));
        assert.deepEqual([dir + '/istanbul'], which('istanbul', env));
    });

    it('returns an empty array if nothing is found', function () {
        var dir = path.resolve(__dirname + '/../node_modules/.bin'),
            env = { HOME: '/', PWD: '/', PATH: dir };

        assert.deepEqual([], which('this-does-not-exists', env));
    });
});

describe('_resolve()', function(){
   it('resolves ~ to the users home directory', function(){
       assert.equal(__dirname, which._resolve('~', { HOME: __dirname }));
       assert.equal(__dirname + '/test-which.js', which._resolve('~/test-which.js', { HOME: __dirname }));
   });
});