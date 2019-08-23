/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Meek
 *
 * @summary Tabulate RCV / STV per prfound.org's Meek's method.
 */

import {UBF} from "./util_basic.js";
import K from "./constants.js";
import {MeekValueError, MeekImplementationError}
      from "./errors.js";
import {Status} from './status.js';

/**
 * The results of a tabulation.
 *
 * This class also includes various static functions that are
 * useful for converting those results to strings and printing them
 * to the console.
 */
class Results {
  /**
   * Store the three results of a tabulation.
   * See the description of `Tabulation.tabulate()` for details.
   * @param {Set<string>} elected - A set of elected candidate identifiers.
   * @param {array<Status>} statuses - An array of statuses for each
   *   candidate.
   * @param {Object} tally - A data object with the round-by-round
   *   tally of votes and other counts for each candidate and
   *   other tabulation categories.
   */
  constructor(elected, statuses, tally) {
    /** A set of elected candidate identifiers.
     * @type {Set<string>} */
    this.elected = elected;
    /** An array of statuses for each candidate.
     * @type {array<Status>} */
    this.statuses = statuses;
    /** A data object with the round-by-round tally of votes and other
     * counts for each candidate and other tabulation categories.
     * @type{Object} */
    this.tally = tally;
  }

  /**
   * Format as a string a set or array of elected candidate identifiers
   *
   * The resulting string can be a JSON fragment specifying an
   * object property.
   *
   * @param {array|Set} elected
   *   A set or array of elected candidate identifiers.
   *
   * @param {string} [prefix='']
   *   A string that prefixes label.
   *   This can specify a separating comma.
   *
   * @param {string} [label='"elected": ']
   *   A string that labels the string.
   *   This can specify a property key and its surrounding punctuation.
   *
   * @param {number} [indent1=2]
   *   The number of spaces that prefix the first (and only) line.
   *
   * @param {string} [suffix='']
   *   A string that is printed at the end of the line.
   *   This can specify a separating comma.
   *
   * @return {string} A string representing elected in
   *   standard sorted order.
   */
  static getElectedAsString(elected, prefix='', label='"elected": ',
        indent1=2, suffix='') {

    const electedArray = Array.from(elected);
    electedArray.sort();
    const coreContent = UBF.show(electedArray);
    const result = ' '.repeat(indent1) + prefix + label+ coreContent + suffix;
    return result;
  }

  /** See the corresponding static class method for description.
   * This method implicitly uses this.elected, so only prefix, label,
   * indent1, and suffix are parameters. */
  getElectedAsString(prefix, label, indent1, suffix) {
    return Results.getElectedAsString(this.elected, prefix, label,
          indent1, suffix);
  }

  /**
   * Format a data object of candidate statuses as a string
   *
   * The resulting string can be a JSON fragment specifying an
   * object property.
   *
   * @param {Object} statuses
   *   A data object of Status objects, keyed by candidate identifiers.
   *
   * @param {string} [prefix='']
   *   A string that prefixes label2.
   *   This can specify a separating comma.
   *
   * @param {string} [label='"status": ']
   *   A string that labels the string.
   *   This can specify a property key and its surrounding punctuation.
   *
   * @param {number} [indent1=2]
   *   The number of spaces that prefix the first and last lines.
   *
   * @param {number} [indent2=4]
   *   The number of spaces that prefix each line other than the
   *   first and last lines.
   *
   * @param {string} [suffix='']
   *   A string that is printed at the end of the last line.
   *   This can specify a separating comma.
   *
   * @return {string} A string representing the statuses in
   *   standard sorted order.
   */
  static getStatusesAsString(statuses, prefix='', label='"status": ',
        indent1=2, indent2=4, suffix='') {
    const statusItems = UBF.getOwnItems(statuses);
    statusItems.forEach((item) => {
      item.sortKey = Results.getSortKey(item.name, statuses);
    });
    statusItems.sort(Results.compareSortKeys);
    let result = ' '.repeat(indent1)+prefix+label+'[\n';
    const lines = []
    statusItems.forEach((item, index) => {
      let line = ' '.repeat(indent2) + '[';
      item.value.asArray().forEach((entry, ix) => {
        line += ix === 0 ? '' : ', ';
        if (typeof entry === 'string') {
          line += UBF.show(entry);
        } else if (entry instanceof K.Decimal) {
          if (Number.isInteger(entry.toNumber())) {
            line += String(entry.toNumber()) + '.0';
          } else {
            line += String(entry.toNumber());
          }
        } else {
          line += String(entry);
        }
      });
      line += index === statusItems.length - 1 ? ']' : '],';
      lines.push(line);
    });
    result += lines.join('\n');
    result += '\n'+' '.repeat(indent1)+']'+suffix;
    return result;
  }

  /** See the corresponding static class method for description.
   * This method implicitly uses this.statuses, so only prefix, label,
   * indent1, indent2, and suffix are parameters. */
  getStatusesAsString(prefix, label, indent1, indent2, suffix) {
    return Results.getStatusesAsString(this.statuses, prefix, label,
          indent1, indent2, suffix);
  }

  /**
   * Format a tally data object as a string
   *
   * The resulting string can be a JSON fragment specifying an
   * object property.
   *
   * @param {Object} tally
   *   A tally data object, keyed by candidate identifiers
   *   and labels for other tabulation categories.
   *
   * @param {Object} statuses
   *   A data object of Status objects, keyed by candidate identifiers.
   *
   * @param {string} [prefix='']
   *   A string that prefixes label2.
   *   This can specify a separating comma.
   *
   * @param {string} [label='"tally": ']
   *   A string that labels the string.
   *   This can specify a property key and its surrounding punctuation.
   *
   * @param {number} [indent1=2]
   *   The number of spaces that prefix the first and last lines.
   *
   * @param {number} [indent2=4]
   *   The number of spaces that prefix each line other than the
   *   first and last lines.
   *
   * @param {string} [suffix='']
   *   A string that is printed at the end of the last line.
   *   This can specify a separating comma.
   *
   * @return {string} A string representing the statuses in
   *   standard sorted order.
   */
  static getTallyAsString(tally, statuses, prefix='', label='"tally": ',
        indent1=2, indent2=4, suffix='') {
    const tallyItems = UBF.getOwnItems(tally);
    tallyItems.forEach((item) => {
      item.sortKey = Results.getSortKey(item.name, statuses);
    });
    tallyItems.sort(Results.compareSortKeys);
    let result = ' '.repeat(indent1)+prefix+label+'{\n';
    const lines = [];
    tallyItems.forEach((item) => {
      let line = ' '.repeat(indent2)+'"'+item.name+'": ';
      line += '[';
      item.value.forEach((entry, ix) => {
        line += (ix === 0 ? '' : ', ');
        if (entry instanceof K.Decimal) {
          if (Number.isInteger(entry.toNumber())) {
            line += entry.toNumber().toString() + '.0';
          } else {
            line += entry.toNumber().toString();
          }
        } else {
          line += String(entry);
        }
      });
      line += ']';
      lines.push(line);
    });
    result += lines.join(',\n');
    result += '\n'+' '.repeat(indent1)+'}'+suffix;
    return result;
  }

  /** See the corresponding static class method for description.
   * This method implicitly uses this.tally and this.statuses,
   * so only prefix, label, indent1, indent2, and suffix are parameters.
   */
  getTallyAsString(prefix, label, indent1, indent2, suffix) {
    return Results.getTallyAsString(this.tally, this.statuses, prefix, label,
        indent1, indent2, suffix);
  }

  /**
   * Get a sort key for a candidate identifier or other tabulation
   * category label.
   *
   * The sort key can be used to provide a standardized sort order
   * for candidates and other tabulation categories,
   * that reflects the results of a tabulation.
   *
   * The sort codes will sort:
   * - candidates before other tabulation categories
   *   - elected candidates before hopeful candidates
   *     - elected candidates by increasing round of election,
   *       then by decreasing votes
   *   - hopeful candidates before defeated candidates
   *     - hopeful candidates by decreasing votes
   *   - defeated candidates by decreasing round of defeat,
   *     then by decreasing votes
   * - Other tabulation categories are sorted in the order recorded
   *   in `K.OTHER_LABELS_ORDER`.
   *
   * Any remaining ties for sort order among candidates are resolved
   * by the sort order of candidate identifiers.
   *
   * @param {string} code - The candidate identifier or label for a
   *   tabulation category.
   * @param {Object} statuses
   *   A data object of Status objects, keyed by candidate identifiers.
   * @return {array<string|number|Decimal9>} A sort key as an array of
   *   strings and numbers, and/or Decimal9 instances.
   */
  static getSortKey(code, statuses) {
    let sortKey = [[9, code]];
    if (statuses[code] !== undefined) {
      const nbrRound = statuses[code].nbrRound;
      let votes = statuses[code].votes;
      if (votes === null) {
        votes = K.ONE.negative();
      }
      if (statuses[code].status === K.STATUS.elected) {
        sortKey = [1, 1, nbrRound, votes.negative(), code];
      } else if (statuses[code].status === K.STATUS.hopeful) {
        sortKey = [1, 2, -nbrRound, votes.negative(), code];
      } else {
        sortKey = [1, 3, -nbrRound, votes.negative(), code];
      }
    } else {
      let otherLabelsIndex = K.OTHER_LABELS_LIST.indexOf(code);
      if (otherLabelsIndex >= 0) {
        sortKey = [2, otherLabelsIndex, code];
      } else {
        sortKey = [3, 1, code];
      }
    }
    return sortKey;
  }

  /**
   * Compare two sort keys that were built with `getSortKey()`.
   *
   * This function is useful as a comparison parameter to a sort
   * function.
   *
   * @param {array} a - The first sort key to compare.
   * @param {array} b - The second sort key to compare.
   * @return {number} A comparison result value that is
   *   less than zero if `a` sorts before `b`,
   *   greater than zero if `a` sort after `b`,
   *   and equal to zero if `a` sorts equal to `b`.
   */
  static compareSortKeys (a,b) {
    let comparison = null;
    a.sortKey.some((aKey, ix) => {
      const bKey = b.sortKey[ix];
      if (aKey instanceof K.Decimal) {
        if (aKey.isLess(bKey)) {
          comparison = -1;
          return true;
        }
        if (aKey.isGreater(bKey)) {
          comparison = 1;
          return true;
        }
        comparison = 0;
        return false;
      }
      if (aKey < bKey) {
        comparison = -1;
        return true;
      }
      if (aKey > bKey) {
        comparison = 1;
        return true;
      }
      comparison = 0;
      return false;
    });
    return comparison;
  }

  /**
   * Create an array with the keys of a tally in sorted order.
   * @param {Object} tally - A tally data object.
   * @param {Object} statuses
   *   A data object of Status objects, keyed by candidate identifiers.
   * @return {array<string>} - An array with the keys of tally in
   *   sorted order. */
  static getTallyOrderAsArray(tally, statuses) {
    const tallyItems = UBF.getOwnItems(tally);

    tallyItems.forEach((item) => {
      item.sortKey = Results.getSortKey(item.name, statuses);
    });
    tallyItems.sort(Results.compareSortKeys);
    const result = tallyItems.map((item) => {
      return item.name;
    });
    return result;
  }

  /**
   * Create a data object with sort-order indexes for
   *   the keys of a tally object.
   * @param {Object} tally - A tally data item.
   * @param {Object} statuses
   *   A data object of Status objects, keyed by candidate identifiers.
   * @return {array<string>} - A data object keyed by the keys
   *   of `tally` and values that are numbers indicating their
   *   relative sort order.
   */
  static getTallyOrderAsLookup(tally, statuses) {
    const asArray = Results.getTallyOrderAsArray(tally, statuses);
    const result = {};
    asArray.forEach((code, index) => {
      result[code] = index;
    });
    return result;
  }
}

export default Results;

