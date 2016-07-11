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
    var unicode = '呵呵';
    // the unicode will cause issue
    var result = kit.md5(new Buffer(unicode), 'hex');
    expect(result).to.be('86d51ce7753a36079041fc15f7248035');
  });

  it('sha1 should ok', function () {
    var digest = kit.sha1('hello world', 'key', 'hex');
    expect(digest).to.be('34dd234b92683593560528f6193ea68c8005f615');
  });

  it('getIPv4', function () {
    var address = kit.getIPv4();
    expect(address).not.to.be('127.0.0.1');
  });

  it('random', function () {
    var value = kit.random(0, 10);
    expect(value).to.be.above(0);
    expect(value).be.below(10);
  });

  it('pad2', function () {
    expect(kit.pad2(0)).to.be('00');
    expect(kit.pad2(99)).to.be('99');
  });

  it('pad3', function () {
    expect(kit.pad3(0)).to.be('000');
    expect(kit.pad3(99)).to.be('099');
    expect(kit.pad3(999)).to.be('999');
  });

  it('getYYYYMMDD', function () {
    expect(kit.getYYYYMMDD(new Date())).to.match(/\d{8}/);
  });
});
