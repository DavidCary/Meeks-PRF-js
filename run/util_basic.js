"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UtilValueError = exports.UtilBaseError = exports.UBF = exports.UtilBasicFunctions = void 0;

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module UtilBasic
 * @summary Basic utility functions and classes
 *   without other module dependencies.
 */

/** A convenience class for exporting a collection of functions
 *  as static functions of the class.
 *
 *  This class is intended to be used for its static functions and is
 *  not expected to be instantiated.0
 */
class UtilBasicFunctions {
  /** Create a multi-line description of an error and its traceback.
   * @param {Error} err - a caught exception.
   * @return {string} a multi-line string showing message and traceback
   *   of err. */
  static describeError(err) {
    return describeError(err);
  }
  /** Indent a possibly multi-line text string.
   *
   * @param {string} message - the message string to indent.
   * @param {number} [indentBy=2] - the number of spaces to indent each
   *   line of the message.
   * @return {string} a string with the indentations added to each line.
   */


  static indentMessage(message, indentBy = 2) {
    return indentMessage(message, indentBy);
  }
  /**
   * Create an array of strings from a string or an array of strings.
   *
   * If value is a string, it is split by its first character,
   * and the resulting parts populate the array.
   *
   * If the value is the empty string, an empty array is returned.
   *
   * If value is a string of length 1, an array containing a single
   * empty string is returned.
   *
   * If value is an array of strings,
   * (either typeof 'string' or instanceof String),
   * a copy of that array is returned,
   * with any Strings converted to items of typeof 'string'.
   *
   * @param {string|array} value - A string that will be converted to an
   * array of strings, or an array that will be verified as only
   * containing strings.
   *
   * @return {array} An array of strings.
   *
   * @throws {UtilValueError} If value is not a string and is not an
   * array of strings.
   */


  static toArrayOfStrings(value) {
    return toArrayOfStrings(value);
  }
  /**
   * Get the class name of an instance object, if it is available.
   *
   * Look for the name property of the prototype's constructor.
   *
   * @param {Object} instance - A value;
   * @return {string} The found name or the empty string.
   */


  static getClassNameOf(instance) {
    return getClassNameOf(instance);
  }
  /**
   * Get an array of an object's enumerable property keys.
   *
   * Accomplish this with a traditional for in loop.
   * This can retrieve keys that are only in the prototype chain,
   * and can reflect gaps in an array's indexing.
   *
   * @param {Object} object - The object for which keys are retrieved.
   * @return {array<string>} An array of found keys.
   */


  static getKeys(object) {
    return getKeys(object);
  }
  /**
   * Get a sorted array of an object's enumerable property keys.
   *
   * Use 'getKeys()' to retrieve the keys.
   *
   * For sorting, key strings that correspond to a decimal integer value
   * are converted to numbers and sorted in numeric order before any
   * string keys.  The numbers are converted back to strings before
   * returning the sorted array.
   * @param {Object} object - The object for which keys are retrieved.
   * @return {Array<string>} A sorted array of found keys.
   */


  static getSortedKeys(object) {
    return getSortedKeys(object);
  }
  /**
   * Get an array of names / keys of enumerable properties for an
   * object.
   *
   * The names are retrieved using a for-in loop.
   * @param {Object} object - The object for which names are retrieved.
   * @return {array} An array with the found property names / keys.
   */


  static getNames(object) {
    return getNames(object);
  }
  /**
   * Get an array of names and values for an object's enumerable
   * properties.
   *
   * Each entry in the array is an `ObjItem` instance.
   *
   * The names and values are retrieved with a for-in loop.
   * @param {Object} object - The object for which names and values are
   *   retrieved.
   * @return {array} An array with the found property data.
   */


  static getItems(object) {
    return getItems(object);
  }
  /**
   * Get an array of values for an object's enumerable properties.
   *
   * The values are retrieved with a for-in loop.
   * @param {Object} object - The object for which values are retrieved.
   * @return {array} An array with the found property values.
   */


  static getValues(object) {
    return getValues(object);
  }
  /**
   * Get an array of names / keys of own properties for an object.
   *
   * The names are retrieved using `Object.getOwnPropertyDescriptors()`.
   * @param {Object} object - The object for which names are retrieved.
   * @return {array} An array with the found property names / keys.
   * @throws {*} An error if Object.getOwnPropertyDescriptors() is not
   *   supported.
   */


  static getOwnNames(object) {
    return getOwnNames(object);
  }
  /**
   * Get an array of names and values of own properties for an object.
   *
   * The data is retrieved using `Object.getOwnPropertyDescriptors()`.
   * @param {Object} object - The object for which data are retrieved.
   * @return {array} An array with the found names and values.
   *   Each array entry is an instance of `ObjItem`.
   * @throws {*} An error if Object.getOwnPropertyDescriptors() is not
   *   supported.
   */


  static getOwnItems(object) {
    return getOwnItems(object);
  }
  /**
   * Get an array of values of own properties for an object.
   *
   * The values are retrieved using `Object.getOwnPropertyDescriptors()`.
   * @param {Object} object - The object for which values are retrieved.
   * @return {array} An array with the found values.
   *   Each array entry is an instance of `ObjItem`.
   * @throws {*} An error if Object.getOwnPropertyDescriptors() is not
   *   supported.
   */


  static getOwnValues(object) {
    return getOwnValues(object);
  }
  /** Create a string representation of a Javascript value.
   *
   * The value can be a primitive or an object.
   * Support for data objects, arrays, and sets is provided.
   *
   * Currently there is no use of the `options` and `showClasses`
   * parameters.
   *
   * @param {*} value - A value to be converted to a string.
   * @param {Object} options - A data object with options for
   *   converting to and formatting of the string.
   * @param {array<ShowClass>} showClasses - Per class customizations
   *   for how the value should be converted and how the string
   *   should be formatted.
   * @return {string} A string representing the value.
   */


  static show(value, options, showClasses) {
    const result = _show.show(value, options, showClasses);

    return result;
  }
  /**
   * Produce the set union of two iterables.
   *
   * @param {iterable} iterable1 - An iterable object such as an array,
   *   set, or other object.
   * @param {iterable} iterable2 - An iterable object such as an array,
   *   set, or other object.
   * @return {Set} A set with the union of the iterated values.
   * For object arguments, the set contains their keys.
   */


  static setUnion(iterable1, iterable2) {
    return setUnion(iterable1, iterable2);
  }
  /**
   * Produce the set intersection of two iterables.
   *
   * @param {iterable} iterable1 - An iterable object such as an array,
   *   set, or other object.
   * @param {iterable} iterable2 - An iterable object such as an array,
   *   set, or other object.
   * @return {Set} A set with the intersection of the iterated values.
   * For object arguments, the set contains their keys.
   */


  static setIntersection(iterable1, iterable2) {
    return setIntersection(iterable1, iterable2);
  }
  /**
   * Produce the set difference of two iterables.
   *
   * @param {iterable} iterable1 - An iterable object such as an array,
   *   set, or other object.
   * @param {iterable} iterable2 - An iterable object such as an array,
   *   set, or other object.
   * @return {Set} A set with difference of the iterated values,
   *   all of the items in iterable1 that are not in iterable2.
   * For object arguments, the set contains their keys.
   */


  static setDifference(iterable1, iterable2) {
    return setDifference(iterable1, iterable2);
  }

}
/**
 * An alias for the `UtilBasicFunctions` class,
 * which provides various functions as static class
 * functions for general use. */


exports.UtilBasicFunctions = UtilBasicFunctions;
const UBF = UtilBasicFunctions;
/** A base class for thrown errors.
 */

exports.UBF = UBF;

class UtilBaseError extends Error {
  /**
   * @param {string} [message='ERROR'] - text describing the error.
   * @param {array} [otherValues=[]] - an array of values,
   *   each value is typically a two-element array as [description, value].
   *   Other kinds of values are possible, however.
   * @param {Error|null} [priorError=null] - an error of some type that was the
   *   cause for this error being formed. */
  constructor(message = 'ERROR', otherValues = [], priorError = null) {
    super(message);
    /** The message for this error.
     * @type {string} */

    this.message = String(message);
    /** Other values associated with this error and which document additional
     *    context surrounding the error.
     * @type {array} */

    this.otherValues = otherValues;
    /** The prior error that was a direct cause for this error.
     * @type {Error|null} */

    this.priorError = priorError;
    /** A fuller description of the prior error, created using describeError().
     * @type(string) */

    this.priorErrorDescription = '';

    if (this.priorError !== null && this.priorError instanceof Error) {
      this.priorErrorDescription = describeError(this.priorError);
    }
    /** The name of the class of this error.
     * @type{string} */


    this.name = getClassNameOf(this);
  }

  _showPriorError() {
    // Select what to show about the priorError.
    return this.priorError.toString();
  }
  /** Convert to a string
   * @return {string} a string representing the error's message,
   *   its otherValues, and its priorError, if any. */


  toString() {
    let result = [this.name + (this.message ? ': ' + this.message : '')];

    if (this.otherValues.length) {
      result.push(this._otherValuesAsStr(this.otherValues));
    }

    if (this.priorError) {
      result.push('  Prior error:');
      result.push(indentMessage(this._showPriorError(), 4));
    }

    result = result.join('\n');
    return result;
  }

  _otherValuesAsStr(otherValues, indentBy = 2) {
    const limit = 200;
    let result = [];

    if (otherValues instanceof Array) {
      this.otherValues.forEach((valueItem, ix) => {
        if (valueItem instanceof Array && valueItem.length === 2) {
          let line = String(valueItem[0]).padEnd(25) + ' = ';
          const showValue = UBF.show(valueItem[1]);
          const value = truncateString(showValue, limit);
          line += value;
          result.push(line);
        } else {
          const showValue = UBF.show(valueItem);
          const value = truncateString(showValue, limit);
          result.push(value);
        }
      });
    } else {
      const showValue = UBF.show(otherValues);
      const value = truncateString(otherValues, limit);
      result.push(value);
    }

    result = result.join('\n');
    result = indentMessage(result, indentBy);
    return result;
  }

}
/** This function is used by UtilBaseError to limit how long
 * a displayed value can be from otherValues. */


exports.UtilBaseError = UtilBaseError;

function truncateString(value, limit = 40) {
  if (typeof value != 'string') {
    value = String(value);
  }

  if (!limit || !Number.isInteger(limit) || limit < 0) {
    limit = 10;
  }

  if (value.length > limit) {
    value = value.slice(0, limit);

    if (value.length && value[0] === '"') {
      value += '"';
    }

    value = '(only first ' + limit + ' chars): ' + value + ' + more ...';
  }

  return value;
}
/** An error class for invalid data values and types.
 */


class UtilValueError extends UtilBaseError {
  /** The calling convention is the same as for UtilBaseError. */
  constructor(message, otherValues = [], priorError = null) {
    super(message, otherValues, priorError);
  }

}
/** See the corresponding UtilBasicFunction method. */


exports.UtilValueError = UtilValueError;

function describeError(err) {
  //"""
  const parts = [];
  parts.push('Error description:');
  parts.push(indentMessage(err.toString()));

  if (err.stack) {
    parts.push('Error stack:');
    parts.push(indentMessage(err.stack.toString()));
  } else {
    parts.push(`  ${err.toString()}:`);
  }

  if (err.priorError) {
    parts.push('Prior Error:');
    parts.push(indentMessage(describeError(err.priorError), 2));
  }

  parts.push('END Error description');
  const result = parts.join("\n");
  return result;
}
/** See the corresponding UtilBasicFunction method. */


function indentMessage(message, indentBy = 2) {
  const indentStr = ' '.repeat(indentBy);
  let tail = '';
  let mainMessage = message.toString(); //console.log('typeof mainMessage='+typeof mainMessage);
  //console.log('mainMessage.valueOf()='+mainMessage.valueOf());

  if (mainMessage && mainMessage.slice(-1) === '\n') {
    tail = '\n';
    mainMessage = message.slice(0, -1);
  }

  const newMessage = indentStr + mainMessage.replace(/\n/g, '\n' + indentStr) + tail;
  return newMessage;
}
/** See the corresponding UtilBasicFunction method. */


function toArrayOfStrings(value) {
  if (typeof value == 'string' || value instanceof String) {
    if (value.length) {
      const result = value.slice(1).split(value[0]);
      return result;
    } else {
      return [];
    }
  } else if (Array.isArray(value)) {
    const result = []; // for loop, instead of forEach, used to detect skipped/undefined values

    for (let ix = 0; ix < value.length; ix++) {
      const item = value[ix];

      if (typeof item == 'string' || item instanceof String) {
        result.push(String(item));
        continue;
      }

      throw new UtilValueError('Array has an item that is not a string:', [['item position', ix + 1], ['typeof item', typeof item], ['item', item], ['array length', value.length]]);
    }

    return result;
  }

  throw new UtilValueError('Value is not a string or array:', [['typeof value', typeof value], ['value', value]]);
}
/** See the corresponding UtilBasicFunction method. */


function getClassNameOf(instance) {
  let result = '';

  if (typeof instance != 'object' || instance === null) {
    return result;
  }

  const prototype = Object.getPrototypeOf(instance);

  if ('constructor' in prototype && 'name' in prototype.constructor) {
    result = prototype.constructor.name;

    if (typeof result == 'string') {
      return result;
    }
  }

  return '';
}
/** See the corresponding UtilBasicFunction method. */


function getKeys(object) {
  const result = [];

  try {
    for (let x in object) {
      result.push(x);
    }
  } catch (exc) {}

  return result;
}
/** See the corresponding UtilBasicFunction method. */


function getSortedKeys(object) {
  let result = getKeys(object);

  if (result.length) {
    result = result.map(key => typeof key == 'string' && key.match(/^(\+|-)?[0-9]+$/) ? parseInt(key) : key);
    result.sort((a, b) => {
      let comparison = 2;

      if (typeof a == 'number') {
        comparison = typeof b == 'number' ? a < b ? -1 : a > b ? 1 : 0 : -1;
      } else if (typeof a == 'string') {
        if (typeof b == 'string') {
          comparison = a < b ? -1 : a > b ? 1 : 0;
        } else {
          comparison = typeof b == 'number' ? 1 : -1;
        }
      } else if (typeof b == 'symbol') {
        comparison = 0;
      } else {
        comparison = 1;
      }

      return comparison;
    });
    result = result.map(key => typeof key == 'number' ? String(key) : key);
  }

  return result;
} // a regexp for a decimal, possibly infinite number that is not a NaN:
//     /^(+|-)?(Infinity)|(([0-9]+(\.[0-9]*)?)|(\.[0-9]+)(e(+|-)[0-9]+))$/
// a regexp for a decimal, non-negative array index
//     /^[0-9]+$/
// a regexp for a decimial integer
//     /^(+|-)[0-9]+$/
//export usort(array)

/*
class USort {
  static sort(array) {
    if (!Array.isArray(array)) {
*/

/**
 * A helper class for the `Show` class that will be used to provide
 * custom formatting and parsing for a particular class.
 *
 * This is not yet actively used.
 */


class ShowClass {
  constructor(classType, showFunction, options = {}) {
    this.classType = classType;
    this.showFunction = showFunction;
    this.options = options;
  }

}
/**
 * A helper class for the `Show` class that is used to internally
 * represent intermediate results.
 *
 * This is not expected to be used as part of the public interface.
 */


class _ShowParts {
  constructor(content = '', name = '', head = '', tail = '', separator = ', ') {
    this.content = content;
    this.name = name;
    this.head = head;
    this.tail = tail;
    this.separator = separator;

    if (this.name === 'Object' && Array.isArray(this.content) && this.head === '{' && this.tail === '}') {
      this.name = '';
    }
  }

  get length() {
    let result = this.name.length + this.head.length + this.tail.length;

    if (this.name.length) {
      result += 2;
    }

    if (typeof this.content == 'string') {
      result += this.content.length;
    } else if (Array.isArray(this.content)) {
      this.content.forEach((content_item, ix) => {
        result += content_item.length + (ix > 0 ? this.separator.length : 0);
      });
    }

    return result;
  }

  push(item) {
    if (typeof this.content == 'string') {
      this.content += String(item);
    } else if (Array.isArray(this.content)) {
      this.content.push(String(item));
    }

    return this;
  }

  compose() {
    let result = '';

    if (this.name.length) {
      result += '@' + this.name + ':';
    }

    result += this.head;

    if (typeof this.content == 'string') {
      result += this.content;
    } else if (Array.isArray(this.content)) {
      result += this.content.join(this.separator);
    }

    result += this.tail;
    return result;
  }

}
/**
 * A class for creating string representations of primitive values
 * and objects, using an extensible mechanism for custom handling
 * of various types of objects.
 *
 * Current support handles all standard primitive types except for
 * Symbols, for Arrays and Sets, and for other objects generally.
 */


class Show {
  constructor(options = {}, showClasses = []) {
    this.options = options;
    this.showClasses = showClasses;
  }

  show(value, options = {}, showClasses = []) {
    const useOptions = Object.assign({}, this.options, options);
    const useShowClasses = showClasses.concat(this.showClasses);

    const result = this._compose(value, useOptions, useShowClasses);

    return result;
  }

  _compose(value, options, showClasses) {
    const parts = this._decompose(value, options, showClasses);

    const formatted = this._formatParts(parts, value, options, showClasses);

    const result = formatted.compose();
    return result;
  }

  _formatParts(parts, value, options, showClasses) {
    return parts;
  }

  _decompose(value, options, showClasses) {
    if (typeof value === 'string') {
      const value2 = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r');
      const parts = new _ShowParts(value2, '', '"', '"');
      return parts;
    }

    if (typeof value === 'number') {
      return new _ShowParts(String(value));
    }

    if (typeof value === 'undefined') {
      return new _ShowParts('undefined');
    }

    if (value === null) {
      return new _ShowParts('null');
    }

    if (Array.isArray(value)) {
      const parts = new _ShowParts([], '', '[', ']');
      let nextIndex = 0;
      getKeys(value).forEach(value_index => {
        const index = Number(value_index);

        if (Number.isInteger(index) && index >= 0 && index < Number.MAX_SAFE_INTEGER) {
          if (index > nextIndex) {
            parts.push('<skip ' + (index - nextIndex) + '>');
            nextIndex = index;
          }

          parts.push(this._compose(value[value_index], options, showClasses));
          nextIndex = index + 1;
        }
      });
      return parts;
    } //    if (value instanceof K.Decimal && !options.decimal9AsObject) {
    //      return new _ShowParts(value.toString());
    //    }


    if (value instanceof Set) {
      const parts = new _ShowParts(this._compose(Array.from(value)), 'Set');
      return parts;
    }

    if (typeof value === 'boolean') {
      return new _ShowParts(String(value));
    }

    if (typeof value === 'function') {
      return new _ShowParts('<function>');
    }
    /*
    if (typeof value === 'bigint') {
      const result = value.toString();
      return result;
    }
    */


    if (typeof value === 'object') {
      const parts = new _ShowParts([], getClassNameOf(value), '{', '}');
      getSortedKeys(value).forEach((value_key, ix) => {
        parts.push(this._compose(String(value_key), options, showClasses) + ': ' + this._compose(value[value_key], options, showClasses));
      });
      return parts;
    }

    return '<unknown>';
  }

}
/**
 * An instance of the `Show` class which has its `show()` method
 * exposed as a static method of the `UtilBasicFunctions` class.
 */


const _show = Object.freeze(new Show());
/**
 * A class representing the name and value of an object property.
 */


class ObjItem {
  /**
   * @param {string|symbol} The name / key of the property.
   * @param {*} The value of the property.
   */
  constructor(name, value) {
    /** The name of the property, either a string or a symbol.
     * @type {string|symbol} */
    this.name = name;
    /** The value of the property.
     * @type {*} */

    this.value = value;
  }
  /**
   * Produce a string representation of the name and value,
   * mimicking the format of an object literal.
   * @return {string} A string representation of the key and value.
   */


  toString() {
    const result = '{name: "' + String(this.name) + '", value: ' + (typeof this.value === 'string' ? '"' + this.value + '"' : this.value.valueOf()) + '}';
    return result;
  }

}
/** See the corresponding UtilBasicFunction method. */


function getNames(object) {
  const result = [];

  for (let name in object) {
    result.push(String(name));
  }

  return result;
}
/** See the corresponding UtilBasicFunction method. */


function getItems(object) {
  const result = [];

  for (let name in object) {
    const value = object[name];
    result.push(new ObjItem(name, value));
  }

  return result;
}
/** See the corresponding UtilBasicFunction method. */


function getValues(object) {
  const result = [];
  getItems(object).forEach(item => {
    result.push(item.value);
  });
  return result;
}
/** See the corresponding UtilBasicFunction method. */


function getOwnNames(object) {
  const result = [];
  let descriptors = {};

  try {
    descriptors = Object.getOwnPropertyDescriptors(object);
  } catch (exc) {
    console.error('Error: Unsupported Object.getOwnPropertyDescriptors()');
    console.error('  error message="' + exc.toString() + '"');
    console.error('Error description:\n' + describeError(exc));
    throw exc;
  }

  for (let name in descriptors) {
    const descriptor = descriptors[name];

    if (descriptor.enumerable) {
      result.push(name);
    }
  }

  return result;
}
/** See the corresponding UtilBasicFunction method. */


function getOwnItems(object) {
  const result = [];
  let descriptors = {};

  try {
    descriptors = Object.getOwnPropertyDescriptors(object);
  } catch (exc) {
    console.error('Error: Unsupported Object.getOwnPropertyDescriptors()');
    console.error('  error message="' + exc.toString() + '"');
    console.error('Error description:\n' + describeError(exc));
    throw exc;
  }

  for (let name in descriptors) {
    const descriptor = descriptors[name];

    if (descriptor.enumerable) {
      result.push(new ObjItem(name, descriptor.value));
    }
  }

  return result;
}
/** See the corresponding UtilBasicFunction method. */


function _getOwnValues(object) {
  const result = [];
  getOwnItems(object).forEach(item => {
    result.push(item.value);
  });
  return result;
}
/** See the corresponding UtilBasicFunction method. */


function setUnion(iterable1, iterable2) {
  const result = new Set(iterable1);
  iterable2.forEach(item => {
    result.add(item);
  });
  return result;
}
/** See the corresponding UtilBasicFunction method. */


function setIntersection(iterable1, iterable2) {
  const base = new Set(iterable2);
  const result = new Set();
  iterable1.forEach(item => {
    if (base.has(item)) {
      result.add(item);
    }
  });
  return result;
}
/** See the corresponding UtilBasicFunction method. */


function setDifference(iterable1, iterable2) {
  const result = new Set(iterable1);
  iterable2.forEach(item => {
    result.delete(item);
  });
  return result;
}