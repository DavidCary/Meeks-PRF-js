/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module _TestAids
 * @summary Custom helper functions for testing
 */

import * as Meek from '../src/meek.js';
import K from '../src/constants.js';
import {UBF} from '../src/util_basic.js';

const _Meek = Meek._private;

/** Execute a function that is expected to throw an error.
 *
 * This is a useful convenience because Jest treats creating an error as
 * syntactically invalid when the function is run from an expect.
 *
 */
export function _getError(func, printUnexpected=false, label='') {
  let caughtErr = null;
  let result;
  try {
    result = func();
  }
  catch (err) {
    caughtErr = err;
  }
  if (caughtErr == null && printUnexpected) {
    console.debug('In _getError ('+label+') result='+String(result));
  }
  return caughtErr;
}

/** Execute a function that is expected to throw an error.
 *
 * This is a useful convenience because Jest treats creating an error as
 * syntactically invalid when the function is run from an expect.
 *
 * This returns in an array, both the error and the function returned value,
 * each of which will be undefined, if not produced.
 */
export function _getError2(func) {
  let caughtErr;
  let result;
  try {
    result = func();
  }
  catch (err) {
    caughtErr = err;
  }
  return [caughtErr, result];
}

export async function _getAsyncError2(func) {
  let caughtErr;
  let result;
  try {
    result = await func();
  }
  catch (err) {
    caughtErr = err;
  }
  return [caughtErr, result];
}

export function _expectError(func, expectedError, messageRegexp,
      printUnexpected, printExpected, label) {
  //"""Run a test case that is expected to raise an exception"""
  let [funcErr, funcResult] = _getError2(func);
  evaluateErrResult(funcErr, funcResult, expectedError, messageRegexp,
      printUnexpected, printExpected, label);
  return [funcErr, funcResult];
}

export async function _expectAsyncError(func, expectedError, messageRegexp,
      printUnexpected, printExpected, label) {
  //"""Run an async test case that is expected to raise an exception"""
  let [funcErr, funcResult] = await _getAsyncError2(func);
  evaluateErrResult(funcErr, funcResult, expectedError, messageRegexp,
      printUnexpected, printExpected, label);
  return [funcErr, funcResult];
}

function evaluateErrResult(funcErr, funcResult, expectedError, messageRegexp,
      printUnexpected=true, printExpected=false, label='') {
  let print_message = false;
  let verify_message = false;
  let exception_message = null;

  let foundExpected = false;
  let messageMatch = '';
  if (funcErr != undefined) {
    if (typeof expectedError == 'string') {
      if (typeof funcErr == expectedError) {
        messageMatch = String(funcErr).match(messageRegexp);
        if (messageMatch != null) {
          foundExpected = true;
        }
      }
    } else {
      try {
        if ((typeof funcErr == 'object' && expectedError === null) ||
              (expectedError !== null && funcErr instanceof expectedError)) {
          messageMatch = String(funcErr).match(messageRegexp);
          if (messageMatch != null) {
            foundExpected = true;
          }
        }
      }
      catch (exc) {}
    }
  }
  if (foundExpected && printExpected) {
    console.debug('expected error('+label+')='+String(funcErr));
    console.debug('  message match('+label+')='+String(messageMatch));
  }
  if (!foundExpected && printUnexpected) {
    if (funcErr === undefined) {
      console.debug('unexpected result('+label+')='+String(funcResult));
    } else {
      console.debug('unexpected error('+label+')='+String(funcErr));
      console.debug(UBF.describeError(funcErr));
    }
  }
  // If any of the following expects fail, _expectError was called with a
  //   function that did not throw an expected uncaught error, contrary to
  //   expectations.
  let DEBUG_HINT = 'Error not thrown, check the caller of _expectError.';
  expect(funcErr).not.toBeUndefined();
  expect(funcErr).not.toBeNull();
  if (typeof expectedError == 'string') {
    DEBUG_HINT = 'Wrong error. Check the caller of _expectError.';
    expect(typeof funcErr).toBe(expectedError);
    expect(String(funcErr)).toMatch(messageRegexp);
  } else {
    DEBUG_HINT = 'Wrong error. Check the caller of _expectError.';
    if (expectedError !== null) {
      expect(funcErr).toBeInstanceOf(expectedError);
    }
    expect(String(funcErr)).toMatch(messageRegexp);
  }

}

export function buildExpectedStatus(statusCodes) {
  let result = {};
  UBF.getOwnItems(statusCodes).forEach((item) => {
    let value = item.value;
    let newStatus = {
      'candidate': value[0],
      'status': value[1],
      'nbrRound': value[2],
      'votes': value[3] === null ? null : new K.Decimal(value[3]),
      'keepFactor': new K.Decimal(value[4]),
      'destiny': value.length == 6 ? value[5] : K.DESTINY.normal,
    };
    result[value[0]] = newStatus;
  });
  return result;
}

export function buildStvTally(tally) {
  let result = {};
  UBF.getOwnItems(tally).forEach((item) => {
    let value = item.value;
    let newList = [];
    if (item.name == K.LABEL.nbrIterations) {
      item.value.forEach((nbrIterations) => {
        newList.push(nbrIterations);
      });
    } else {
      item.value.forEach((voteTotal) => {
        let newVoteTotal = new K.Decimal(voteTotal);
        newList.push(newVoteTotal);
      });
    }
    result[item.name] = newList;
  });
  return result;
}

