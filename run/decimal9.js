"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Decimal9Error = exports.Decimal9Total = exports.Decimal9 = void 0;

var _util_basic = require("./util_basic.js");

var _bigInteger = _interopRequireDefault(require("./big-integer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Decimal9
 */

/**
* @summary Support for decimals with nine decimal places.
*/
const _NBR_DECIMAL_PLACES = 9;

const _FACTOR = Math.pow(10, _NBR_DECIMAL_PLACES);

const _FACTOR_BIGINT = (0, _bigInteger.default)(_FACTOR);

const BIGINT_ONE = (0, _bigInteger.default)(1);
const BIGINT_MINUS_ONE = (0, _bigInteger.default)(-1);
const BIGINT_TWO = (0, _bigInteger.default)(2);
/** An error type used with the Decimal9 class. */

class Decimal9Error extends _util_basic.UtilBaseError {
  /** The calling convention is the same as for UtilBaseError.
   * Initialize with a message, other values, and a prior error. */
  constructor(message, otherValues = [], priorError = null) {
    super(message, otherValues, priorError);
  }

}
/** Unit of least precision.
 * @return {Decimal9} A value of the smallest positive value represented
 *   by a Decimal9 value: 1 * 10^-9 = 0.000000001. */


exports.Decimal9Error = Decimal9Error;

function _ulp() {
  const result = new Decimal9(1, -_NBR_DECIMAL_PLACES);
  return result;
}
/** An immutable class for expressing numbers to nine decimal places.
 *
 * This is useful for counting votes in STV tabulations.
 *
 * This class provides defined behavior, relatively free from
 * external influences, providing values are kept within a safe range.
 * Internally, values are stored as integer Javascript number values.
 *
 * Values that are outside the safe range may not be relied upon
 * to provide accurate results. It is the responsibilty of code using this
 * class to ensure that values stay within the safe range.
 *
 * Multiplication and division can require greater precision in
 * intermediate results before rounding or truncation than Javascript
 * numbers can provide.
 *
 * To support the required capacity for numerical precision, the Javascript
 * numbers are converted to big integers, currently using the npm
 * big-integer package and BigInt() constructor, for performing
 * multiplication and division.
 * The results, after applicable rounding
 * (including truncation) are converted back to native Javascript numbers.
 * It is left to the application to check or otherwise ensure that the
 * resulting values can be adequately represented as safe Javascript
 * integers.
 */


class Decimal9 extends Object {
  /**
   * @param {number|Number|Decimal9|null} [value=null] - A numeric value that
   *   the new instance should represent; if null, the result is zero.
   * @param {number} [exponentOf10=0] - Number indicating how many powers of 10
   *   the `value` should be be multiplied by to get the instance's true
   *   numeric value; `exponentOf10` can be negative.
   * @throw {Decimal9Error} If either `value` or `exponentOf10` is not a
   *   supported value or type.
   */
  constructor(value = null, exponentOf10 = 0) {
    super();
    const roundedExponentOf10 = Math.round(exponentOf10);

    if (!Number.isInteger(roundedExponentOf10)) {
      throw new Decimal9Error('exponentOf10 is not a supported value:', [['type', typeof exponentOf10], ['rounded exponentOf10', roundedExponentOf10], ['exponentOf10', exponentOf10]]);
    }

    exponentOf10 = roundedExponentOf10;

    if (value === null) {
      this._valueAsInteger = 0;
      return;
    }

    if (value instanceof Decimal9) {
      if (exponentOf10 === 0) {
        this._valueAsInteger = value._valueAsInteger;
      } else if (exponentOf10 > 0) {
        const multiplier = Math.pow(10, exponentOf10);
        this._valueAsInteger = value._valueAsInteger * multiplier;
      } else {
        const divisor = Math.pow(10, -exponentOf10);

        const division = _integerDivide(value._valueAsInteger, divisor);

        this._valueAsInteger = _round(division.q, division.r, division.d, 'nearest');
      }

      return;
    }

    if (typeof value == 'object' && value instanceof Number) {
      value = Number(value);
    }

    if (typeof value == 'number') {
      const adjustedExponent = exponentOf10 + _NBR_DECIMAL_PLACES;
      const multiplier = Math.pow(10, adjustedExponent);
      const adjustedValue = value * multiplier;

      if (Math.trunc(value) === value) {
        if (adjustedExponent >= 0) {
          this._valueAsInteger = value * multiplier;
        } else {
          this._valueAsInteger = Math.trunc(adjustedValue);
        }
      } else {
        this._valueAsInteger = Math.round(adjustedValue);
      }

      return;
    } else {
      throw new Decimal9Error('Value is not a supported type:', [['type', typeof value], ['value of value', value.toString()]]);
    }
  }
  /** Get the underlying integer value.
   * @return {number} The underlying JavaScript integer value used to
   *   internally represent the Decimal9 value; this may not be accurate
   *   if the value is not a safe Javascript integer. */


  _getValue() {
    return this._valueAsInteger;
  }
  /** Get the Decimal9 value as a Javascript number.
   * @return {number} A representation of the Decimal9 value as a Javascript
   *   number. */


  toNumber() {
    // Get the value as a javascript number.
    const result = this._getValue() / _FACTOR;

    return result;
  }
  /** The max safe integer value that Decimal9 uses internally,
   *  as a static class value.
   *
   * This represents a slightly smaller number than Javascript uses, since
   * Javascript has some conversion anomalies for what it deems to be
   * safe integers.
   *
   * The value is 9000100000000000 = 9,000,100,000,000,000. */


  static get MAX_SAFE_INTEGER() {
    return 9000100000000000;
  }
  /** The negative of Decimal9.MAX_SAFE_INTEGER. */


  static get MIN_SAFE_INTEGER() {
    return -Decimal9.MAX_SAFE_INTEGER;
  }
  /** The maximum value that Decimal9 deems safe to work with.
   *
   * The value is 9000100 = 9,000,100 , i.e. nine million one hundred. */


  static get MAX_SAFE_VALUE() {
    return 9000100;
  }
  /** The negative of Decimal9.MAX_SAFE_VALUE. */


  static get MIN_SAFE_VALUE() {
    return -Decimal9.MAX_SAFE_VALUE;
  }
  /** Convert the Decimal9 value to a string, showing all decimal places,
   * even if they include trailing zeros.
   * @return {string} A string reflecting the represented numeric value. */


  toString() {
    const parts = _integerDivide(new _bigInteger.default(this._valueAsInteger), _FACTOR);

    parts.r = parts.r.toJSNumber();
    let result = parts.q.abs().toString() + '.' + Math.abs(parts.r).toString().padStart(9, '0');
    result = result.replace(/0{1,8}$/, '');
    parts.q = parts.q.toJSNumber();

    if (parts.q < 0 || parts.q === 0 && parts.r < 0) {
      result = '-' + result;
    }

    return result;
  }
  /** Test whether the Decimal9 value is in the safe range.
   * @return {boolean} A true/false indication of whether the Decimal9
   *   value is within the safe range, endpoints included. */


  isSafe() {
    if (this._valueAsInteger >= Decimal9.MIN_SAFE_INTEGER && this._valueAsInteger <= Decimal9.MAX_SAFE_INTEGER) {
      return true;
    } else {
      return false;
    }
  }
  /** Test whether this Decimal9 value is less than another one.
   * @param {Decimal9} value - A Decimal9 instance to compare with.
   * @return {boolean} A true/false indication of whether this numeric value
   *   is less than the numeric value of the argument. */


  isLess(value) {
    _confirmTypes(value, Decimal9);

    const result = this._valueAsInteger < value._valueAsInteger;
    return result;
  }
  /** Test whether this Decimal9 value is less than or equal to another one.
   * @param {Decimal9} value - A Decimal9 instance to compare with.
   * @return {boolean} A true/false indication of whether this numeric value
   *   is less than or equal to the numeric value of the argument. */


  isLessEqual(value) {
    _confirmTypes(value, Decimal9);

    const result = this._valueAsInteger <= value._valueAsInteger;
    return result;
  }
  /** Test whether this Decimal9 value is equal to another one.
   * @param {Decimal9} value - A Decimal9 instance to compare with.
   * @return {boolean} A true/false indication of whether this numeric value
   *   is equal to the numeric value of the argument. */


  isEqual(value) {
    if (value === null) {
      return false;
    }

    _confirmTypes(value, Decimal9);
    /*
    if (!(value instanceof Decimal9)) {
      return false;
    }
    */


    const result = this._valueAsInteger === value._valueAsInteger;
    return result;
  }
  /** Test whether this Decimal9 value is not equal to another one.
   * @param {Decimal9} value - A Decimal9 instance to compare with.
   * @return {boolean} A true/false indication of whether this numeric value
   *   is not equal to the numeric value of the argument. */


  isNotEqual(value) {
    const result = !this.isEqual(value);
    return result;
  }
  /** Test whether this Decimal9 value is greater than or equal to another one.
   * @param {Decimal9} value - A Decimal9 instance to compare with.
   * @return {boolean} A true/false indication of whether this numeric value
   *   is greater than or equal to the numeric value of the argument. */


  isGreaterEqual(value) {
    _confirmTypes(value, Decimal9);

    const result = this._valueAsInteger >= value._valueAsInteger;
    return result;
  }
  /** Test whether this Decimal9 value is greater than another one.
   * @param {Decimal9} value - A Decimal9 instance to compare with.
   * @return {boolean} A true/false indication of whether this numeric value
   *   is greater than the numeric value of the argument. */


  isGreater(value) {
    _confirmTypes(value, Decimal9);

    const result = this._valueAsInteger > value._valueAsInteger;
    return result;
  }
  /** Add a value to this value, producing a new value.
   *
   * @param {Decimal9} value - The value to be added to this one.
   * @return {Decimal9} The sum of this and value. */


  plus(value) {
    _confirmTypes(value, Decimal9);

    const asInteger = this._valueAsInteger + value._valueAsInteger;
    const result = new Decimal9(asInteger, -_NBR_DECIMAL_PLACES);
    return result;
  }
  /** Subtract a value from this value, producing a new value.
   *
   * @param {Decimal9} value - The value to be subtracted from this one.
   * @return {Decimal9} The difference of this minus value. */


  minus(value) {
    _confirmTypes(value, Decimal9);

    const asInteger = this._valueAsInteger - value._valueAsInteger;
    const result = new Decimal9(asInteger, -_NBR_DECIMAL_PLACES);
    return result;
  }
  /** Arithmetically negate this value, producing a new value.
   *
   * @return {Decimal9} The negative of this. */


  negative() {
    const asInteger = -this._valueAsInteger;
    const result = new Decimal9(asInteger, -_NBR_DECIMAL_PLACES);
    return result;
  }
  /** Multiply this value by another value, producing a new value.
   *
   * @param {Decimal9|number|Number} value - The value to be multiplied by.
   *   this one
   * @param {string} [rounding='truncate'] - An indication of what kind of
   *   rounding should be done.  Should be a value in K.ROUND:
   *
   *   - 'truncate' = Truncate any value beyond 9 decimal places.
   *   - 'away' = Round away from zero to 9 decimal places.
   *   - 'nearest' = Round to the nearest 9-decimal-place value,
   *       rounding to an even digit in the 9th decimal place if there
   *       is a tie for the nearest value.
   * @return {Decimal9} The product of the two values, rounded as requested. */


  times(value, rounding = 'truncate') {
    _confirmTypes(value, Decimal9, 'number', Number);

    if (!(value instanceof Decimal9)) {
      value = new Decimal9(value);
    }

    const product = new _bigInteger.default(this._valueAsInteger).multiply(new _bigInteger.default(value._valueAsInteger));

    const scaledProduct = _integerDivide(product, _FACTOR);

    const asInteger = _round(scaledProduct.q, scaledProduct.r, _FACTOR, rounding);

    const result = new Decimal9(asInteger, -_NBR_DECIMAL_PLACES);
    return result;
  }
  /** Divide this value by another value, producing a new value.
   *
   * @param {Decimal9|number|Number} value - The divisor value.
   * @param {string} [rounding='truncate'] - An indication of what kind of
   *   rounding should be done.  Should be a value in K.ROUND:
   *
   *   - 'truncate' = Truncate any value beyond 9 decimal places.
   *   - 'away' = Round away from zero to 9 decimal places.
   *   - 'nearest' = Round to the nearest 9-decimal-place value,
   *       rounding to an even digit in the 9th decimal place if there
   *       is a tie for the nearest value.
   * @return {Decimal9} The quotient of this divided by value, after any
   *   indicated rounding. */


  divideBy(value, rounding = 'truncate') {
    _confirmTypes(value, Decimal9, 'number', Number);

    if (!(value instanceof Decimal9)) {
      value = new Decimal9(Number(value));
    }

    if (value._valueAsInteger === 0) {
      throw new Decimal9Error('Divide by zero.');
    }

    const division = _integerDivide((0, _bigInteger.default)(this._valueAsInteger).multiply(_FACTOR_BIGINT), (0, _bigInteger.default)(value._valueAsInteger));

    const asInteger = _round(division.q, division.r, division.d.abs(), rounding);

    const result = new Decimal9(asInteger, -_NBR_DECIMAL_PLACES);
    return result;
  }

}

exports.Decimal9 = Decimal9;
Decimal9.ulp = _ulp;
/** A mutable subclass of Decimal9 for accumulating totals.
 *
 * Totals can be accumulated through standard addition and subtraction
 * operations, `plus` and `minus`, without creating new instances.
 *
 * The constructor does not take any parameters and always initializes
 * a new instance to a zero value.
 */

class Decimal9Total extends Decimal9 {
  constructor() {
    super();
    this._valueAsInteger = 0;
  }
  /** Add a value to this value, accumulating the result in this.
   *
   * @param {Decimal9} value - The value to be added to this one
   * @return {Decimal9Total} This, which now carries the sum. */


  plus(value) {
    _confirmTypes(value, Decimal9);

    this._valueAsInteger += value._valueAsInteger;
    return this;
  }
  /** Subtract a value from this value, accumulating the result in this.
   *
   * @param {Decimal9} value - The value to be subtracted from this one
   * @return {Decimal9Total} This, which now carries the difference. */


  minus(value) {
    _confirmTypes(value, Decimal9);

    this._valueAsInteger -= value._valueAsInteger;
    return this;
  }

}
/** Perform big integer division.
 * @param {number|big-integer} numerator - The numerator.
 * @param {number|big-integer} denominator - The denominator.
 * @return {Object} A data object containing the quotient, remainder, and
 * denominator, all as big integers.
 */


exports.Decimal9Total = Decimal9Total;

function _integerDivide(numerator, denominator) {
  // return BigInt quotient , remainder, and denominator.
  // first convert numerator and denominator to BigInt's as needed.
  if (typeof numerator === 'number') {
    numerator = (0, _bigInteger.default)(numerator);
  }

  if (typeof denominator === 'number') {
    denominator = (0, _bigInteger.default)(denominator);
  }

  const division = numerator.divmod(denominator);
  const result = {
    q: division.quotient,
    r: division.remainder,
    d: denominator
  };
  return result;
}
/** Round a big integer value based on its remainder, a modulus, and
 *  a rounding setting of 'truncate', 'away', or 'nearest'.
 *  @param {big-integer} asInteger - The value to round.
 *  @param {big-integer} remainder - The remainder to be rounded.
 *  @param {big-integer} modulus - Round to multiples of this value.
 *  @param {string} rounding - Values of 'truncate', 'away', or 'nearest'.
 *  @return {number} A Javascript integer appropriately rounded.
 */


function _round(asInteger, remainder, modulus, rounding = 'truncate') {
  // Round the value of asInteger + remainder / modulus to an integer.
  //
  // Return a Javascript number
  //
  // Give the correct answer whenever it and asInteger are safe integers.
  //
  // Assumptions:
  //   asInteger, remainder, and modulus are BigInt integers.
  //   //NOT ASSUMED: asInteger and remainder are the same sign or one of them
  //         is zero.
  //   //NOT ASSUMED: modulus is positive.
  //   Twice the modulus is a safe integer.
  //   remainder is less in absolute value than modulus.
  //
  // This function is only used internally, and the assumptions are not
  // asserted.
  if (rounding === 'away' && !remainder.isZero()) {
    asInteger = asInteger.plus(asInteger.isZero() ? remainder.isPositive() ? BIGINT_ONE : BIGINT_MINUS_ONE : asInteger.isPositive() ? BIGINT_ONE : BIGINT_MINUS_ONE);
  } else if (rounding === 'nearest') {
    const factorCompare = remainder.abs().multiply(BIGINT_TWO);
    const modulusAbs = modulus instanceof _bigInteger.default ? modulus.abs() : Math.abs(modulus);

    if (factorCompare.gt(modulusAbs) || factorCompare.equals(modulusAbs) && asInteger.isOdd()) {
      asInteger = asInteger.plus(asInteger.isZero() ? remainder.isPositive() ? BIGINT_ONE : BIGINT_MINUS_ONE : asInteger.isPositive() ? BIGINT_ONE : BIGINT_MINUS_ONE);
    }
  }

  asInteger = asInteger.toJSNumber();
  return asInteger;
}

function _confirmTypes(value, ...requiredTypes) {
  /* Raise an Decimal9Error if value is not an instance of the
  required class or of the required type.
  */
  for (let requiredType of requiredTypes) {
    if (typeof requiredType == 'string' && typeof value == requiredType || value === null && requiredType === null || (typeof requiredType == 'object' || typeof requiredType == 'function') && requiredType !== null && value instanceof requiredType) {
      return true;
    }
  }

  throw new Decimal9Error('Value is not an instance of the required type:', [['value type', typeof value], ['value', String(value)], ['required types', requiredTypes.map(x => (': ' + x).slice(2, 102))]]);
}