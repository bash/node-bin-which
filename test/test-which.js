'use strict';

var assert = require('assert'),
    which = require('../lib/which'),
    path = require('path');

describe('which()', function(){
    it('returns an array', function(){
        assert(which('', { HOME: '/', PWD: '/', PATH: '/' }) instanceof Array);
    });

    it('looks up the absolute path of the executable', function(){
        var dir = path.resolve(__dirname +'/../node_modules/.bin'),
            env = { HOME: '/', PWD: '/', PATH: dir };

        assert.deepEqual([dir + '/mocha'], which('mocha', env));
        assert.deepEqual([dir + '/istanbul'], which('istanbul', env));
    });
});