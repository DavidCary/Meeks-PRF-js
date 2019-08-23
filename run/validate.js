"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = void 0;

var _constants = _interopRequireDefault(require("./constants.js"));

var _errors = require("./errors.js");

var _util_basic = require("./util_basic.js");

var _ballot = require("./ballot.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Validate
 */

/**
 * A collection of validation and reformatting methods for Meek data.
 *
 * See the description of parameters for the Tabulation() constructor
 * for details about the requirements for those values, which are enforced
 * here.
 */
class Validator {
  /**
   * A test for being a safe integer, which accepts number values
   * @param {*} value - A value to be tested whether it is a safe integer.
   * @returns {boolean} The indication of whether the tested value is a safe
   * integer.
   */
  static isSafeInteger(value) {
    if (typeof value == 'number' && Number.isInteger(value)) {
      if (Math.trunc(value) === value) {
        const maxSafeInteger = _constants.default.Decimal.MAX_SAFE_VALUE;

        if (value >= -maxSafeInteger && value <= maxSafeInteger) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Create an array of strings from a string or an array of strings.
   *
   * If value is a string, it is split by its first character,
   * and the resulting parts populate the array.
   *
   * If value is an array of strings,
   * (either typeof 'string' or instanceof String),
   * a copy of that array is returned,
   * with any Strings converted to items of typeof 'string'.
   *
   * This function is a wrapper function for
   * `UtilBasicFunctions.toArrayOFStrings()`, and ensures that any
   * validation error that is thrown is of type MeekValueError.
   *
   * @param {string|array} value - A string that will be converted to an array
   * of strings, or an array that will be verified as only containing strings
   * and then duplicated.
   *
   * @return {array} An array of strings.
   *
   * @throws {MeekValueError} If value is not a string and is not an array of
   * strings.
   */


  static toArrayOfStrings(value) {
    let result = '';

    try {
      result = _util_basic.UBF.toArrayOfStrings(value);
    } catch (exc) {
      if (exc instanceof _util_basic.UtilValueError) {
        const newErr = new _errors.MeekValueError(exc.message, exc.otherValues);
        throw newErr;
      }

      throw exc;
    }

    return result;
  }
  /**
   * Validate a number of seats to fill.
   * @param {number} nbrSeatsToFill - The number to validate.
   * @return {number} nbrSeatsToFill if it was valid.
   * @throw {MeekValueError} If nbrSeatsToFill was not valid.
   */


  nbrSeatsToFill(nbrSeatsToFill) {
    if (!Validator.isSafeInteger(nbrSeatsToFill)) {
      throw new _errors.MeekValueError('nbrSeatsToFill is not a safe integer:', [['typeof nbrSeatsToFill', typeof nbrSeatsToFill], ['nbrSeatsToFill is a Number?', nbrSeatsToFill instanceof Number], ['nbrSeatsToFill', nbrSeatsToFill]]);
    }

    nbrSeatsToFill = Number(nbrSeatsToFill);

    if (nbrSeatsToFill <= 0) {
      throw new _errors.MeekValueError('nbrSeatsToFill is less than 1:', [['nbrSeatsToFill', nbrSeatsToFill]]);
    }

    return nbrSeatsToFill;
  }
  /** Validate a list of candidate identifiers.
   * @param {string|array<string>} candidates - A proposed value.
   * @return {array<string>} candidates if it was valid.
   * @throw {MeekValueError} If candidates was not valid.
   */


  candidates(candidates) {
    try {
      candidates = Validator.toArrayOfStrings(candidates);
    } catch (exc) {
      throw new _errors.MeekValueError('Invalid candidates type:', [], exc);
    }

    const candidateIndexes = {};
    candidates.forEach((candId, ix) => {
      if (!candId.length || _constants.default.RANKING_CODES_NOT_A_CANDIDATE.has(candId) || candId[0] === ':') {
        throw new _errors.MeekValueError('Invalid candidate ID in list of candidates:', [['candidate id', candId], ['list position', ix + 1]]);
      }

      if (typeof candidateIndexes[candId] == 'number') {
        throw new _errors.MeekValueError('Duplicate candidate ID in list of candidates:', [['candidate id', candId], ['first list position', candidateIndexes[candId]], ['next list position', ix + 1]]);
      }

      candidateIndexes[candId] = ix + 1;
    });
    return candidates;
  }
  /**
   * Validate a tieBreaker list of candidate identifiers.
   * @param {string|array<string>} tieBreaker - A proposed value.
   * @param {array<string>} candidates - A validated array of ranking codes.
   * @return {object} tieBreaker as an object keyed by candidate IDs
   *   and values equal to ordering indexes.
   * @throw {MeekValueError} If tieBreaker was not valid.
   */


  tieBreaker(tieBreaker, candidates) {
    try {
      tieBreaker = Validator.toArrayOfStrings(tieBreaker);
    } catch (exc) {
      throw new _errors.MeekValueError('Invalid tieBreaker type:', [], exc);
    }

    tieBreaker.forEach((candId, ix) => {
      if (candidates.indexOf(candId) === -1) {
        throw new _errors.MeekValueError('Invalid candidate ID in tieBreaker:', [['candidate candId', candId], ['tieBreaker list position', ix + 1]]);
      }
    });
    const result = {};
    const tieBreakerSet = new Set();
    tieBreaker.forEach((candId, ix) => {
      if (typeof result[candId] == 'number') {
        throw new _errors.MeekValueError('Duplicate candidate ID in tieBreaker:', [['candidate id', candId], ['first list position', result[candId] + 1], ['next list position', ix + 1]]);
      }

      result[candId] = ix;
      tieBreakerSet.add(candId);
    });
    return result;
  }
  /**
   * Validate an array of ballots.
   * @param {array<string|array>} ballots - A proposed value.
   * @param {array<string>} candidates - A validated array of ranking codes.
   * @param {number|null} maxRankingLevels - A validated value.
   * @param {Progress} progress - To report progress via callback.
   * @return {array<Ballot>} An array of Ballot objects.
   * @throw {MeekValueError} If ballots was not valid.
   */


  ballots(ballots, candidates, maxRankingLevels, progress) {
    const result = [];

    if (!Array.isArray(ballots)) {
      throw new _errors.MeekValueError('ballots is not an array:', [['typeof ballots', typeof ballots], ['ballots', ballots]]);
    }

    let absoluteTotalNbrBallots = 0;
    ballots.forEach((ballot, ix) => {
      let multiple = 1;
      let rankings = [];

      if (typeof ballot == 'string') {
        rankings = ballot;
      } else if (Array.isArray(ballot) && (ballot.length == 0 || typeof ballot[0] == 'string')) {
        rankings = ballot;
      } else {
        if (!Array.isArray(ballot)) {
          throw new _errors.MeekValueError('A ballot is not an array nor a string:', [['typeof ballot', typeof ballot], ['ballot', ballot], ['ballot nbr', ix + 1]]);
        }

        if (ballot.length !== 2) {
          throw new _errors.MeekValueError('A ballot is not a pair of values:', [['ballot.length', ballot.length], ['ballot', ballot], ['ballot nbr', ix + 1]]);
        }

        multiple = ballot[0];
        rankings = ballot[1];
      }

      if (!Validator.isSafeInteger(multiple)) {
        throw new _errors.MeekValueError('A ballot multiple is not a safe integer:', [['type(multiple)', typeof multiple], ['multiple', multiple], ['ballot nbr', ix + 1]]);
      }

      multiple = Number(multiple);

      if (multiple < 1) {
        throw new _errors.MeekValueError('A ballot multiple is zero or less:', [['multiple', multiple], ['ballot nbr', ix + 1]]);
      }

      try {
        rankings = Validator.toArrayOfStrings(rankings);
      } catch (exc) {
        throw new _errors.MeekValueError('Invalid ballot rankings type:', [['ballot nbr', ix + 1]], exc);
      }

      if (maxRankingLevels !== null && rankings.length > maxRankingLevels) {
        throw new _errors.MeekValueError('Ballot rankings is too long:', [['rankings.length', rankings.length], ['maxRankingLevels', maxRankingLevels], ['ballot nbr', ix + 1]]);
      }

      rankings.forEach((rankingCode, rix) => {
        if (candidates.indexOf(rankingCode) === -1 && !_constants.default.RANKING_CODES_NOT_A_CANDIDATE.has(rankingCode)) {
          throw new _errors.MeekValueError('Invalid ballot ranking code:', [['ranking code', rankingCode], ['ballot nbr', ix + 1], ['ranking code position', rix + 1]]);
        }
      });
      const internalBallot = new _ballot.Ballot(multiple, rankings);
      absoluteTotalNbrBallots += Math.abs(multiple);
      result.push(internalBallot);

      if (progress && (ix + 1) % progress.validationPeriod === 0) {
        progress.setValidationProgress(ix + 1);
      }
    });

    if (result.length !== ballots.length) {
      throw new _errors.MeekValueError('Ballots contains undefined items:', [['ballots.length', ballots.length], ['number of validated ballots', result.length]]);
    }

    if (!Validator.isSafeInteger(absoluteTotalNbrBallots)) {
      throw new _errors.MeekValueError('The absolute total number of ballots' + ' is not a safe integer:', [['typeof total nbr ballots)', typeof absoluteTotalNbrBallots], ['total nbr ballots', absoluteTotalNbrBallots], ['max safe integer', _constants.default.Decimal.MAX_SAFE_VALUE]]);
    }

    if (progress) {
      progress.setValidationProgress(progress.completedLabel);
    }

    return result;
  }
  /**
   * Validate maxRankingLevels.
   * @param {number|null} maxRankingLevels - A proposed value.
   * @return {number|null} A valid maxRankingLevels.
   * @throw {MeekValueError} If maxRankingLevels was not valid.
   */


  maxRankingLevels(maxRankingLevels) {
    if (maxRankingLevels === null) {
      return null;
    }

    if (!Validator.isSafeInteger(maxRankingLevels)) {
      throw new _errors.MeekValueError('maxRankingLevels is not a safe integer:', [['typeof maxRankingLevels', typeof maxRankingLevels], ['maxRankingLevels', maxRankingLevels]]);
    }

    maxRankingLevels = Number(maxRankingLevels);

    if (maxRankingLevels < _constants.default.MIN_RANKINGS_SUPPORTED) {
      throw new _errors.MeekValueError('maxRankingLevels is less than ' + _constants.default.MIN_RANKINGS_SUPPORTED + ':', [['maxRankingLevels', maxRankingLevels]]);
    }

    return maxRankingLevels;
  }
  /**
   * Validate a list of excluded candidates.
   * @param {string|array<string>} excluded - A proposed value.
   * @param {array<string>} candidates - A validated array of candidate IDs.
   * @return {Set<string>} A set of excluded candidate IDs.
   * @throw {MeekValueError} If excluded was not valid.
   */


  excluded(excluded, candidates) {
    if (excluded === null) {
      excluded = [];
    }

    try {
      excluded = Validator.toArrayOfStrings(excluded);
    } catch (exc) {
      throw new _errors.MeekValueError('Invalid excluded type:', [], exc);
    }

    const result = new Set();
    const candidateIndexes = {};
    excluded.forEach((candId, ix) => {
      if (candidates.indexOf(candId) === -1) {
        throw new _errors.MeekValueError('Invalid candidate ID in excluded:', [['candidate candId', candId], ['excluded list position', ix + 1]]);
      }

      if (result.has(candId)) {
        throw new _errors.MeekValueError('Candidate ID in excluded is not unique:', [['candid ID', candId], ['first list position', candidateIndexes[candId] + 1], ['next list position', ix + 1]]);
      }

      result.add(candId);
      candidateIndexes[candId] = ix;
    });
    return result;
  }
  /**
   * Validate a list of protected candidates.
   * @param {string|array<string>} protectedList - A proposed value.
   * @param {array<string>} candidates - A validated array of candidate IDs.
   * @param {Set<string>} excluded - A validated set of excluded candidate
   *   IDs.
   * @param {number} nbrSeatsToFill - A validated number of seats to fill.
   * @return {Set<string>} A set of protected candidate IDs.
   * @throw {MeekValueError} If protectedList was not valid.
   */


  protectedCandidates(protectedList, candidates, excluded, nbrSeatsToFill) {
    if (protectedList === null) {
      protectedList = [];
    }

    try {
      protectedList = Validator.toArrayOfStrings(protectedList);
    } catch (exc) {
      throw new _errors.MeekValueError('Invalid protectedList type:', [], exc);
    }

    const result = new Set();
    const candidateIndexes = {};
    protectedList.forEach((candId, ix) => {
      if (candidates.indexOf(candId) === -1) {
        throw new _errors.MeekValueError('Invalid protected candidate ID:', [['candidate ID', candId], ['list position', ix + 1]]);
      }

      if (excluded.has(candId)) {
        throw new _errors.MeekValueError('Candidate ID is protected and excluded:', [['candidate ID', candId], ['protected list position', ix + 1]]);
      }

      if (result.has(candId)) {
        throw new _errors.MeekValueError('Protected candidate ID is not unique:', [['candidate candId', candId], ['first list position', candidateIndexes[candId] + 1], ['next list position', ix + 1]]);
      }

      result.add(candId);
      candidateIndexes[candId] = ix;
    });

    if (result.size > nbrSeatsToFill) {
      throw new _errors.MeekValueError('More protected candidates than seats to fill:', [['nbr protected', result.size], ['nbr seats to fill', nbrSeatsToFill]]);
    }

    return result;
  }
  /**
   * Validate a plain old data object of tabulation options.
   * @param {Object} options - A proposed value.
   * @return {Object} An object with validated tabulation options,
   *   if options was valid.
   * @throw {MeekValueError} If options was not valid.
   */


  options(options) {
    const result = {};

    if (typeof options != 'object') {
      throw new _errors.MeekValueError('Options is not an object:', [['typeof options', typeof options]]);
    }

    for (let name in options) {
      // The following if statement can not be true.

      /*
      if (typeof name != 'string') {
        throw new MeekValueError('An option name is not a string:', [
              ['typeof option name', typeof name],
              ['option name', name],
        ]);
      }
      */
      let value = options[name];

      if (name === _constants.default.OPTIONS.alternativeDefeats._value) {
        if (typeof value == 'string' && _constants.default.OPTIONS.alternativeDefeats._value_set.has(value.toUpperCase())) {
          value = value.toUpperCase();
        } else {
          try {
            value = Validator.toArrayOfStrings(value);
          } catch (exc) {
            throw new _errors.MeekValueError('Invalid option value type:', [['option name', name]], exc);
          }

          value.forEach((perRoundValue, ix) => {
            if (!_constants.default.OPTIONS.alternativeDefeats._value_set.has(perRoundValue.toUpperCase())) {
              throw new _errors.MeekValueError('Invalid per-round option value:', [['per-round value', perRoundValue], ['index', ix], ['for round', ix + 1], ['option name', name]]);
            }
          });
          const newValue = [];
          value.forEach((perRoundValue, ix) => {
            newValue.push(perRoundValue.toUpperCase());
          });
          value = newValue;
        }

        result[_constants.default.OPTIONS.alternativeDefeats._value] = value;
      } else if (_constants.default.OPTIONS._value_set.has(name)) {
        const originalValue = value;

        if (typeof value == 'string') {
          value = value.toLowerCase();
        }

        const key = _constants.default.OPTIONS._valueToJsId[name];

        if (_constants.default.OPTIONS[key]._value_set.has(value)) {
          result[name] = value;
        } else {
          throw new _errors.MeekValueError('Invalid option value:', [['typeof value', typeof originalValue], ['value', originalValue], ['option name', name]]);
        }
      } else {
        throw new _errors.MeekValueError('Invalid option name:', [['typeof name', typeof name], ['name', name]]);
      }
    }

    return result;
  }

}

exports.Validator = Validator;