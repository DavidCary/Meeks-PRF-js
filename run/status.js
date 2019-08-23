"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Status = void 0;

var _constants = _interopRequireDefault(require("./constants.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Status
 */

/**
 *
 * A class to record a candidate's status in a Meek tabulation.
 */
class Status {
  /**
   * @param {(string|object)} candidate -
   *   the candidate identifier for the candidate.
   *
   *   If the candidate argument is an object,
   *   then expect that it is a Status or is Status-like
   *   and initialize this Status object
   *   from the corresponding keys of that object.
   * @param {K.Decimal|null} [votes=K.ZERO] - The number of votes for the
   *   candidate; null before the first round and for excluded
   *   candidates.
   * @param {number} [nbrRound=0] - The 1-based number of the
   *   round for which this status applies or the round in which the
   *   candidate was elected or defeated.
   * @param {string} [status=K.STATUS.hopeful] - A string indicating the
   *   status of the candidate.  The value should be one in K.STATUS.
   * @param {number} [keepFactor=K.ONE] - The fraction of a ballot's
   *   vote weight that is counted for the candidate.
   * @param {string} [destiny=K.DESTINY.normal] - An indication of
   *   whether the candidate was pre-designated as excluded or protected.
   *   The value should be one in K.DESTINY.
   *
   */
  constructor(candidate, votes = _constants.default.ZERO, nbrRound = 0, status = _constants.default.STATUS.hopeful, keepFactor = _constants.default.ONE, destiny = _constants.default.DESTINY.normal) {
    if (typeof candidate == 'object') {
      /** The candidate identifier.
       *  @type {string} */
      this.candidate = candidate['candidate'];
      /** The number of votes for the candidate when the candidate was
       *    elected or defeated, or as of the most recent tabulation of
       *    votes if the candidate is hopeful; `null` if the candidate
       *    is excluded or if no rounds have been tabulated yet.
       *  @type {K.Decimal|null} */

      this.votes = candidate['votes'];
      /** The 1-based number of the round for which votes applies,
       *    possibly 0 if votes is null.
       *  @type {number} */

      this.nbrRound = candidate['nbrRound'];
      /** A string indicating the status of
       *    the candidate; a value in `K.STATUS`.
       *  @type {string} */

      this.status = candidate['status'];
      /** The fraction of a ballot's vote weight that was counted for
       *    the candidate.
       *  @type {number} */

      this.keepFactor = candidate['keepFactor'];
      /** An indication of whether the candidate was pre-designated as
       *    excluded, as protected, or neither.  The value should be
       *    in `K.DESTINY`.
       *  @type {string} destiny */

      this.destiny = candidate['destiny'] || _constants.default.DESTINY.normal;
    } else {
      this.candidate = candidate;
      this.votes = votes;
      this.nbrRound = nbrRound;
      this.status = status;
      this.keepFactor = keepFactor;
      this.destiny = destiny;
    }

    if (this.candidate === null || this.candidate === undefined) {
      this.candidate = ':???';
    }
  }
  /**
   * Create a corresponding plain data object.
   * @returns {object} An object that has keys and properties corresponding to
   * the data properties of this object.
   */


  asSimpleObject() {
    const result = {
      'candidate': this.candidate,
      'votes': this.votes,
      'nbrRound': this.nbrRound,
      'status': this.status,
      'keepFactor': this.keepFactor,
      'destiny': this.destiny
    };
    return result;
  }
  /**
   * Create a corresponding array with the data values.
   * @returns {array} An array that lists the values of the status
   *   properties as follows:
   *
   *       [candidate, status, nbrRound, votes, keepFactor, destiny]
   *
   *   where destiny is omitted if it is 'normal'.
   */


  asArray() {
    const result = [this.candidate, this.status, this.nbrRound, this.votes, this.keepFactor];

    if (this.destiny !== _constants.default.DESTINY.normal) {
      result.push(this.destiny);
    }

    return result;
  }
  /**
   * Create a string representation of the keys and values.
   * @returns {string} A string that lists the keys and values of the
   *   `Status` properties in the format of a data object literal,
   *   omitting the key and value for destiny if its value is 'normal'.
   */


  toString() {
    let result = '{';
    result += 'candidate: ' + (this.candidate === null || this.candidate === undefined ? this.candidate : '"' + this.candidate.toString() + '"');
    result += ', status: "' + this.status.toString() + '"';
    result += ', nbrRound: ' + (this.nbrRound === null ? this.nbrRound : this.nbrRound.toString());
    result += ', votes: ' + this.votes.toString();
    result += ', keepFactor: ' + this.keepFactor.toString();

    if (this.destiny !== _constants.default.DESTINY.normal) {
      result += ', destiny: "' + this.destiny.toString() + '"';
    }

    result += '}';
    return result;
  }
  /**
   * Test for `Status` equality.
   *
   * Tests whether another value has the same values corresponding
   *   to the properties of this `Status` instance.
   * @param {*} other - A value to be compared.
   * @returns {boolean} A true/false indication of whether `other` has
   *   the same `Status` property values as the calling Status.
   */


  isEqual(other) {
    let isEqual = true;

    try {
      if (this.candidate !== other.candidate) {
        return false;
      }

      if (this.status !== other.status) {
        return false;
      }

      if (this.nbrRound !== other.nbrRound) {
        return false;
      }

      if (this.votes.isNotEqual(other.votes)) {
        return false;
      }

      if (this.keepFactor.isNotEqual(other.keepFactor)) {
        return false;
      }

      if (this.destiny !== other.destiny) {
        return false;
      }
    } catch (err) {
      isEqual = false;
    }

    return isEqual;
  }
  /**
   * Test for `Status` inequality.
   *
   * Tests whether another value has any different values
   *   corresponding to those of this Status instance.
   * @param {*} other - A value to be compared.
   * @returns {boolean} A true/false indication of whether any of the
   *   calling Status object's property values are different from the
   *   corresponding values for `other`.
   */


  isNotEqual(other) {
    const result = !this.isEqual(other);
    return result;
  }

}

exports.Status = Status;