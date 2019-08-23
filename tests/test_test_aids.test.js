/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module _TestAidsUnitTest
 * @summary Unit tests _test_aids helper functions
 */

/*
import K from '../../src/constants.js';
import {Ballot} from '../../src/ballot.js';
import {Validator} from '../../src/validate.js';
import {MeekValueError} from '../../src/errors.js';
*/
import {_getError, _getError2, _expectError} from './_test_aids.js';

describe('_getError', () => {
  test('error produced', () => {
    let err = _getError(() => {throw Error('This is a test error.');});
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Error);
    expect(err.toString()).toMatch(/^Error: This is a test error.$/);
  });
  test('error produced, printUnexpected=true', () => {
    let err = _getError(() => {throw Error('This is a test error.');}, true);
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Error);
    expect(err.toString()).toMatch(/^Error: This is a test error.$/);
  });
  test('no error produced', () => {
    let err = _getError(() => {let a = 2;});
    expect(err).toBeNull();
  });
  test('no error produced, nothing returned, printUnexpected=true', () => {
    let err = _getError(() => {let a = 3;}, true, 'expected message test 31');
    expect(err).toBeNull();
    // and expect return=undefined message printed to console.debug
  });
  test('no error produced, 3 returned, printUnexpected=true', () => {
    let err = _getError(() => {return 3;}, true, 'expected message test 32');
    expect(err).toBeNull();
    // and expect return=3 message printed to console.debug
  });
});

describe('_getError2', () => {
  test('error produced', () => {
    let [err, result] = _getError2(
          () => {throw Error('This is a test error.');});
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Error);
    expect(err.toString()).toMatch(/^Error: This is a test error.$/);
    expect(result).toBeUndefined();
  });
  test('no error produced', () => {
    let [err, result] = _getError2(() => {let a = 2;});
    expect(err).toBeUndefined();
    expect(result).toBeUndefined();
  });
  test('no error produced, 3 returned', () => {
    let [err, result] = _getError2(() => {return 3;});
    expect(err).toBeUndefined();
    expect(result).toBe(3);
  });
});

function toHexString(str) {
  str = String(str);
  let result = [];
  for (let ix = 0; ix < str.length; ix++) {
    result.push(str.charCodeAt(ix).toString(16));
  }
  return result;
}

function toOnlyPrintableAscii(str) {
  let result = '';
  for (let ix = 0; ix < str.length; ix++) {
    let charCode = str.charCodeAt(ix);
    if (charCode >= 32 && charCode <= 126) {
      result += str[ix];
    }
  }
  return result;
}

function removeEscapes(str) {
  let result = '';
  let skippingEscape = false;
  for (let ix = 0; ix < str.length; ix++) {
    let charCode = str.charCodeAt(ix);
    if (skippingEscape) {
      if (str[ix] == 'm') {
        skippingEscape = false;
      }
    } else {
      if (charCode == 27) {
        skippingEscape = true;
      } else {
        result += str[ix];
      }
    }
  }
  return result;
}



describe('_expectError', () => {
  test('error produced', () => {
    let [err, result] = _expectError(
          () => {throw Error('This is a test error.');},
          Error, /^Error: This is a test error.$/);
    expect(err).not.toBeUndefined();
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Error);
    expect(err.toString()).toMatch(/^Error: This is a test error.$/);
    expect(result).toBeUndefined();
  });
  test('error produced, printExpected', () => {
    let [err, result] = _expectError(
          () => {throw Error('This is a test error.');},
          Error, /^Error: This is a test error.$/, false, true,
          'expected message test 11');
    // Also expect console debug messages showing type and message of err.
    expect(err).not.toBeUndefined();
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Error);
    expect(err.toString()).toMatch(/^Error: This is a test error.$/);
    expect(result).toBeUndefined();
  });
  test('error produced, wrong error type', () => {
    let [expErr, expResult] = _getError2(() => {
      let [err, result] = _expectError(
            () => {throw Error('This is a test error.')},
            TypeError, /^Error: This is a test error.$/
            ,true, false, 'expected message test 21'
      );
    });
    //console.debug('wrong type: expErr='+String(expErr));
    //console.debug('expResult='+String(expResult));
    // Also expect console debug message showing err.
    expect(expErr).not.toBeUndefined();
    expect(expErr).not.toBeNull();
    expect(expErr).toBeInstanceOf(Error);
    let expErrPlain = removeEscapes(expErr.toString());
    expect(expErrPlain).toMatch(
          /^Error: expect\(received\)\.toBeInstanceOf\(expected\)\n/);
    expect(expErrPlain).toMatch(
          /^[^\n]*\n\nExpected constructor: TypeError\n/);
    expect(expErrPlain).toMatch(
          /^[^\n]*\n\n[^\n]*\nReceived constructor: Error\n$/);
    expect(expResult).toBeUndefined();
  });
  test('error produced, wrong message', () => {
    let [expErr, expResult] = _getError2(() => {
      let [err, result] = _expectError(
            () => {throw Error('This is a test error.')},
            Error, /^Error: This is a wrong message.$/
            ,true, false, 'expected message test 22'
      );
    });
    //console.debug('wrong message: expErr='+String(expErr));
    //console.debug('expResult='+String(expResult));
    // Also expect console debug message showing err.
    expect(expErr).not.toBeUndefined();
    expect(expErr).not.toBeNull();
    expect(expErr).toBeInstanceOf(Error);
    let expErrPlain = removeEscapes(expErr.toString());
    expect(expErrPlain).toMatch(
          /^Error: expect\(received\)\.toMatch\(expected\)\n/);
    expect(expErrPlain).toMatch(new RegExp([
          /^[^\n]*\n\nExpected pattern:/,
          / \/\^Error: This is a wrong message\.\$\/\n/,
    ].map(f=>f.source).join('')));
    expect(expErrPlain).toMatch(new RegExp([
          /^[^\n]*\n\n[^\n]*\nReceived string:/,
          /  "Error: This is a test error\."$/,
    ].map(f=>f.source).join('')));
    expect(expResult).toBeUndefined();
  });
  test('no error produced, printUnexpected', () => {
    let [expErr, expResult] = _getError2(() => {
      let [err, result] = _expectError(
            () => {let a = 3;},
            Error, /^Error: This is a test error.$/,
            true, false, 'expected message test 12');
    });
    // Also expect console debug message showing result=undefined.
    expect(expErr).not.toBeUndefined();
    expect(expErr).not.toBeNull();
    expect(expErr).toBeInstanceOf(Error);
    let expErrPlain = removeEscapes(expErr.toString());
    expect(expErrPlain).toMatch(
          /^Error: expect\(received\)\.not\.toBeUndefined\(\)\n/);
    expect(expErrPlain).toMatch(
          /^[^\n]*\n\nReceived: undefined$/);
    expect(expResult).toBeUndefined();
  });
  test('no error produced', () => {
    let [expErr, expResult] = _getError2(() => {
      let [err, result] = _expectError(
            () => {let a = 3;},
            Error, /^Error: This is a test error.$/);
    });
    //console.debug('expErr='+String(expErr));
    //console.debug('expResult='+String(expResult));
    expect(expErr).not.toBeUndefined();
    expect(expErr).not.toBeNull();
    expect(expErr).toBeInstanceOf(Error);
    let expErrPlain = removeEscapes(expErr.toString());
    expect(expErrPlain).toMatch(
          /^Error: expect\(received\)\.not\.toBeUndefined\(\)\n/);
    expect(expErrPlain).toMatch(
          /^[^\n]*\n\nReceived: undefined$/);
    expect(expResult).toBeUndefined();
  });
  test('no error produced, printUnexpected', () => {
    let [expErr, expResult] = _getError2(() => {
      let [err, result] = _expectError(
            () => {let a = 3;},
            Error, /^Error: This is a test error.$/,
            true, false, 'expected message test 13');
    });
    // Also expect console debug message showing result=undefined.
    expect(expErr).not.toBeUndefined();
    expect(expErr).not.toBeNull();
    expect(expErr).toBeInstanceOf(Error);
    let expErrPlain = removeEscapes(expErr.toString());
    expect(expErrPlain).toMatch(
          /^Error: expect\(received\)\.not\.toBeUndefined\(\)\n/);
    expect(expErrPlain).toMatch(
          /^[^\n]*\n\nReceived: undefined$/);
    expect(expResult).toBeUndefined();
  });
  test('no error produced, result returned, printUnexpected', () => {
    let [expErr, expResult] = _getError2(() => {
      let [err, result] = _expectError(
            () => {return 3;},
            Error, /^Error: This is a test error.$/,
            true, false, 'expected message test 14');
    });
    // Also expect console debug message showing result=3.
    expect(expErr).not.toBeUndefined();
    expect(expErr).not.toBeNull();
    expect(expErr).toBeInstanceOf(Error);
    let expErrPlain = removeEscapes(expErr.toString());
    expect(expErrPlain).toMatch(
          /^Error: expect\(received\)\.not\.toBeUndefined\(\)\n/);
    expect(expErrPlain).toMatch(
          /^[^\n]*\n\nReceived: undefined$/);
    expect(expResult).toBeUndefined();
  });
  /*
  */
});
