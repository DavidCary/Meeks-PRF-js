"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeekImplementationError = exports.MeekValueError = void 0;

var _util_basic = require("./util_basic.js");

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module MeekErrs
 * @summary Meek's method base classes and functions for errors.
 */

/** An error class that identifies invalid data values and types.
 *
 * This is most typically used for data that is supplied from outside the
 * package.
 */
class MeekValueError extends _util_basic.UtilBaseError {
  /** The calling convention is the same as for UtilBaseError.
   * Initialize with a message, other values, and a prior error. */
  constructor(message, otherValues = [], priorError = null) {
    super(message, otherValues, priorError);
  }

}
/** An error class for possible implementation errors in this package. */


exports.MeekValueError = MeekValueError;

class MeekImplementationError extends _util_basic.UtilBaseError {
  /** The calling convention is the same as for UtilBaseError.
   * Initialize with a message, other values, and a prior error. */
  constructor(message, otherValues = [], priorError = null) {
    super(message, otherValues, priorError);
  }

}

exports.MeekImplementationError = MeekImplementationError;