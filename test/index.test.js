'use strict';

const path = require('path');
const expect = require('expect.js');

const kit = require('../');

describe('kitx', function () {
  it('loadJSONSync should ok', function () {
    var filename = path.join(__dirname, '../package.json');
    var pack = kit.loadJSONSync(filename);
    expect(pack.version).to.be.ok();
  });

  it('loadJSONSync with invalid json file should ok', function () {
    expect(function () {
      var filename = path.join(__dirname, 'figures/invalid.json');
      kit.loadJSONSync(filename);
    }).to.throwException(function (e) {
      expect(e.name).to.be('SyntaxError');
    });
  });

  it('encode buffer should ok', function () {
    var encoded = kit.encode('100');
    expect(encoded.length).to.be(3);
    expect(encoded.toString()).to.be('100');
  });

  it('encode number should ok', function () {
    var encoded = kit.encode(100);
    expect(encoded.length).to.be(3);
    expect(encoded.toString()).to.be('100');
  });

  it('md5 should ok', function () {
    var digest = kit.md5('hello world', 'hex');
    expect(digest).to.be('5eb63bbbe01eeed093cb22bb8f5acdc3');
  });

  it('sha1 should ok', function () {
    var digest = kit.sha1('hello world', 'key', 'hex');
    expect(digest).to.be('34dd234b92683593560528f6193ea68c8005f615');
  });
});
