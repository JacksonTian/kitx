'use strict';

const kitx = require('../');
const assert = require('assert');


function test(input) {
  const encrypted = kitx.encrypt(input, 'utf8', 'hex');
  const decrypted = kitx.decrypt(encrypted, 'hex', 'utf8');
  assert.deepStrictEqual(decrypted, input);
}

describe('kitx', function () {
  it('encrypt should ok', function () {
    const encrypted = kitx.encrypt('hello world', 'utf8', 'hex');
    assert.strictEqual(encrypted, 'b2afbfa305bde0f821f0dfc6f9adbcf4');
  });

  it('decrypt should ok', function () {
    const decrypted = kitx.decrypt('b2afbfa305bde0f821f0dfc6f9adbcf4', 'hex', 'utf8');
    assert.strictEqual(decrypted, 'hello world');
  });

  it('should ok', function () {
    test('hi');
    test('hihi');
    test('1083108231083102830');
    test('hello world183108231083012830183018');
  });
});
