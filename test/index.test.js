'use strict';

const path = require('path');
const { Readable } = require('stream');
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
    var result = kit.md5(Buffer.from(unicode), 'hex');
    expect(result).to.be('86d51ce7753a36079041fc15f7248035');
  });

  it('sha1 should ok', function () {
    var digest = kit.sha1('hello world', 'key', 'hex');
    expect(digest).to.be('34dd234b92683593560528f6193ea68c8005f615');
  });

  it('getIPv4', function () {
    var address = kit.getIPv4();
    expect(address).to.be.ok();
    expect(address).not.to.be('127.0.0.1');
  });

  it('random', function () {
    var value = kit.random(0, 10);
    expect(value >= 0 && value < 10).to.be.ok();
  });

  it('makeNonce', function () {
    var old = Math.random;
    Math.random = function () {
      return 1;
    };
    var nonce1 = kit.makeNonce();
    var nonce2 = kit.makeNonce();
    expect(nonce1.length).to.be.above(10);
    expect(nonce1).not.to.be(nonce2);
    Math.random = old;
  });

  it('sleep', async function () {
    var now = Date.now();
    await kit.sleep(10);
    var diff = Date.now() - now;
    expect(diff >= 10).to.be.ok();
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

  it('getMac', function () {
    expect(kit.getMac()).to.have.length(17);
  });

  it('readAll', async function () {
    class MyReader extends Readable {
      _read() {
        this.push('hello world!');
        this.push(null);
      }
    }

    const value = await kit.readAll(new MyReader());
    expect(value.toString()).to.be('hello world!');
  });
});
