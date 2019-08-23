/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module MeekErrsUnitTest
 * @summary Unit tests of Meek's method base classes and functions for errors
 */

import * as MeekErrs from '../../src/errors.js';

describe('test MeekValueError', () => {
  test('create with message', () => {
    let err = new MeekErrs.MeekValueError('Test error', [
      ['error value', 'qxjz!+wyV']]);
    expect(err.toString()).toBe(
      'MeekValueError: Test error\n' +
      '  error value               = "qxjz!+wyV"'
    );
  });
});

describe('test MeekImplementationError', () => {
  test('create with message', () => {
    let err = new MeekErrs.MeekImplementationError('Test error', [
      ['error value', 'qxjz!+wyV']]);
    expect(err.toString()).toBe(
      'MeekImplementationError: Test error\n' +
      '  error value               = "qxjz!+wyV"'
    );
  });
});

