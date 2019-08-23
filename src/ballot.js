/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Ballot
 */


import K from "./constants.js";
//import * as Errors from "./errors.js";


/**
 * A class representing a group of ballots which share the same rankings.
 *
 * The requirements for the arguments are the same as for
 * a ballot group in the ballots argument for the meek.tabulate() function.
 * However, the arguments should already have been processesd by an appropriate
 * validation and formatting routine. In particular, rankings represented by
 * a single string should already have been reformatted to an array of
 * strings.
 */
export class Ballot  {
/**
 * @param {number} [multiple=0] - The number of ballots in the group.
 * @param {array<string>} [rankings=[]] - The candidate rankings for the ballot
 * group.
 */
  constructor (multiple=0, rankings=[]) {
    this._multiple = multiple;
    this._rankings = rankings;
  }

  /** Get the number of ballots in this ballot group.
   * @return {number} The number of ballots in this ballot group.
   */
  getMultiple() {
    return this._multiple;
  }

  /** Get the rankings for this ballot group.
   * @return {array<string>} An array of strings that are the rankings for this
   *   ballot group.
   */
  getRankings() {
    return this._rankings;
  }

  /** Convert the ballot to a string.
   * @return {string} A string in object-literal format showing the
   *   values for this ballot. */
  valueOf() {
    let result = '{multiple: ' + this._multiple +
          ', rankings: [';
    this._rankings.forEach((ranking, rix) => {
      result += `${rix === 0 ? "" : ", "}"${ranking}"`;
    });
    result += ']}';
    return result;
  }

  /** Convert the ballot to a string.
   * @return {string} A string in object-literal format showing the
   *   values for this ballot. */
  toString() {
    const result = this.valueOf();
    return result;
  }

  /** Convert the ballot to an array.
   * @return {array} A two element array, [multiple, rankings], with the values
   *   of the corresponding properties of this ballot. */
  asArray() {
    const result = [this._multiple, this._rankings];
    return result;
  }

  /** Test for equality.
   * @param {*} other - A value to test for equality.
   * @return {boolean} A true/false indication of whether `other` has
   *   values corresponding to the data properties of this ballot. */
  isEqual(other) {
    let isEqual = true;
    try {
      if (!(typeof this._multiple == 'number' &&
            typeof other._multiple == 'number' &&
            this._multiple === other._multiple)) {
        return false;
      }
      if (Array.isArray(other._rankings)) {
        if (this._rankings.length !== other._rankings.length) {
          return false;
        }
        this._rankings.some((value, ix) => {
          if (typeof value !== 'string' || value !== other._rankings[ix]) {
            isEqual = false;
            return true;
          }
        });
      } else {
        return false;
      }
    }
    catch (exc) {
      console.debug('ERROR: in Ballot.isEqual, caught exception:\n  "'+
            String(exc)+'"');
      isEqual = false;
    }
    return isEqual;
  }

  /** Test for inequality.
   * @param {*} other - A value to test for inequality.
   * @return {boolean} A true/false indication of whether `other` does not have
   *   values corresponding to the data properties of this ballot. */
  isNotEqual(other) {
    const result = ! this.isEqual(other);
    return result;
  }

}

