'use strict';

const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

/**
 * Load *.json file synchronous. Don't use require('*.json')
 * to load *.json files, it will cached in process.
 * @param {String} filename absolute file path
 * @return {Object} a parsed object
 */
exports.loadJSONSync = function (filename) {
  // strip BOM
  var content = fs.readFileSync(filename, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  try {
    return JSON.parse(content);
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};

/**
 * Encoding a string to Buffer safely
 * @param {String} str string.
 * @param {String} encoding. optional.
 * @return {Buffer} encoded buffer
 */
exports.encode = function (str, encoding) {
  if (typeof str !== 'string') {
    str = '' + str;
  }

  return Buffer.from(str, encoding);
};

/**
 * Generate a haser with specfied algorithm
 * @param {String} algorithm can be md5, etc.
 * @return {Function} a haser with specfied algorithm
 */
exports.makeHasher = function (algorithm) {
  return function (data, encoding) {
    var shasum = crypto.createHash(algorithm);
    shasum.update(data);
    return shasum.digest(encoding);
  };
};

exports.createHash = exports.makeHasher;

/**
 * Get md5 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} encoding optional. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.md5 = exports.makeHasher('md5');

/**
 * Get sha1 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} key the key.
 * @param {String} encoding optionnal. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.createHmac = function (algorithm) {
  return function (data, key, encoding) {
    return crypto.createHmac(algorithm, key).update(data).digest(encoding);
  };
};

/**
 * Get sha1 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} key the key.
 * @param {String} encoding optionnal. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.sha1 = exports.createHmac('sha1');

/**
 * Get a random value in a range
 * @param {Number} min range start.
 * @param {Number} max range end.
 */
exports.random = function (min, max) {
  return Math.floor(min + Math.random() * (max - min));
};

/**
 * Generate a nonce string
 * @return {String} a nonce string.
 */
exports.makeNonce = (function () {
  var counter = 0;
  var last;
  const machine = os.hostname();
  const pid = process.pid;

  return function () {
    var val = Math.floor(Math.random() * 1000000000000);
    if (val === last) {
      counter++;
    } else {
      counter = 0;
    }

    last = val;

    var uid = `${machine}${pid}${val}${counter}`;
    return exports.md5(uid, 'hex');
  };
}());

/**
 * Pad a number as \d\d format
 * @param {Number} num a number that less than 100.
 * @return {String} if number less than 10, pad with 0,
 *  otherwise, returns string of number.
 */
exports.pad2 = function (num) {
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
};

/**
 * Pad a number as \d\d\d format
 * @param {Number} num a number that less than 1000.
 * @return {String} if number less than 100, pad with 0,
 *  otherwise, returns string of number.
 */
exports.pad3 = function (num) {
  if (num < 10) {
    return '00' + num;
  } else if (num < 100) {
    return '0' + num;
  }
  return '' + num;
};

/**
 * Return the YYYYMMDD format of a date.
 * @param {Date} date a Date object.
 * @return {String} the YYYYMMDD format.
 */
exports.getYYYYMMDD = function (date) {
  var YYYY = date.getFullYear();
  var MM = exports.pad2(date.getMonth() + 1);
  var DD = exports.pad2(date.getDate());
  return '' + YYYY + MM + DD;
};

/**
 * sleep a while.
 * @param {Number} in milliseconds
 * @return {Promise} a Promise
 */
exports.sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Get the IPv4 address
 * @return {String} the IPv4 address, or empty string
 */
exports.getIPv4 = function () {
  var interfaces = os.networkInterfaces();
  var keys = Object.keys(interfaces);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var addresses = interfaces[key];
    for (var j = 0; j < addresses.length; j++) {
      var item = addresses[j];
      if (!item.internal && item.family === 'IPv4') {
        return item.address;
      }
    }
  }

  // without non-internal address
  return '';
};

/**
 * Get the Mac address
 * @return {String} the Mac address
 */
exports.getMac = function () {
  var interfaces = os.networkInterfaces();
  var keys = Object.keys(interfaces);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var addresses = interfaces[key];
    for (var j = 0; j < addresses.length; j++) {
      var item = addresses[j];
      if (!item.internal && item.family === 'IPv4') {
        return item.mac;
      }
    }
  }

  // without non-internal address
  return '00:00:00:00:00:00';
};

/**
 * Read all bytes from a readable
 * @return {Readable} the readable stream
 * @return {Promise} a Promise with all bytes
 */
exports.readAll = function (readable) {
  return new Promise((resolve, reject) => {
    var onError, onData, onEnd;
    var cleanup = function (err) {
      // cleanup
      readable.removeListener('error', onError);
      readable.removeListener('data', onData);
      readable.removeListener('end', onEnd);
    };

    var bufs = [];
    var size = 0;

    onData = function (buf) {
      bufs.push(buf);
      size += buf.length;
    };

    onError = function (err) {
      cleanup();
      reject(err);
    };

    onEnd = function () {
      cleanup();
      resolve(Buffer.concat(bufs, size));
    };

    readable.on('error', onError);
    readable.on('data', onData);
    readable.on('end', onEnd);
  });
};

class SimpleCryptoHelper {
  constructor(algorithm, key, iv) {
    this.algorithm = algorithm;
    this.key = key;
    this.iv = iv;
  }

  encrypt(data, inputEncoding, outputEncoding) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let output = cipher.update(data, inputEncoding, outputEncoding);
    output += cipher.final(outputEncoding);
    return output;
  }

  decrypt(encrypted, inputEncoding, outputEncoding) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let output = decipher.update(encrypted, inputEncoding, outputEncoding);
    output += decipher.final(outputEncoding);
    return output;
  }
}

// a simple helper for AES-192
const helper = new SimpleCryptoHelper(
  'aes-192-cbc',
  Buffer.from('keykeykeykeykeykeykeykey'), // 24 bytes, 192 bits
  Buffer.from('abcdefghijklmnop') // 16 bytes
);

exports.encrypt = function (data, inputEncoding, outputEncoding) {
  return helper.encrypt(data, inputEncoding, outputEncoding);
}

exports.decrypt = function (encrypted, inputEncoding, outputEncoding) {
  return helper.decrypt(encrypted, inputEncoding, outputEncoding);
}
