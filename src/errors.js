/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module MeekErrs
 * @summary Meek's method base classes and functions for errors.
 */

import {UtilBaseError, UBF} from './util_basic.js';

/** An error class that identifies invalid data values and types.
 *
 * This is most typically used for data that is supplied from outside the
 * package.
 */
export class MeekValueError extends UtilBaseError {
  /** The calling convention is the same as for UtilBaseError.
   * Initialize with a message, other values, and a prior error. */
  constructor(message, otherValues=[], priorError=null) {
    super(message, otherValues, priorError);
  }
}


/** An error class for possible implementation errors in this package. */
export class MeekImplementationError extends UtilBaseError {
  /** The calling convention is the same as for UtilBaseError.
   * Initialize with a message, other values, and a prior error. */
  constructor(message, otherValues=[], priorError=null) {
    super(message, otherValues, priorError);
  }
}

