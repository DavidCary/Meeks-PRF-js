/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module K
 * @summary Centrally defined constants for an Meek tabulation
 */

import {Decimal9} from './decimal9.js';

/** Major, minor, patch version numbers using semantic versioning */
const _versionNumbers = [1, 0, 0];
/** Major, minor, patch version as a string */
const _versionString = _versionNumbers.join('.');

/** The ranking codes other than candidate identifiers */
const _ranking_code = Object.freeze({
  undervote: '',
  overvote: '#',
});

/** Labels and identifiers for tabulation categories other than
 * candidate identifiers */
const _label = Object.freeze({
  totalCandidateVotes: ':Votes for candidates',
  overvotes: ':Overvotes',
  abstentions: ':Abstentions',
  otherExhausted: ':Other exhausted',
  totalVotes: ':Total votes',
  protectedQuota: ':Protected quota',
  quotaVotes: ':Quota votes',
  quota: ':Quota',
  totalSurplus: ':Total surplus',
  nbrIterations: ':Iterations',
});

/** This class represents a node in a tree structured options constant
 * Each node facilitates identifying and validating values at the next
 * lower level within the tree. */
class _Option {
  constructor(jsId, value, options=[], toUpper=false) {
    this._jsId = String(jsId);
    this._value = value;
    this._value_set = new Set();
    this._valueToJsId = {}
    options.forEach(option => {
      this[option._jsId] = option._value_set.size == 0 ?
            option._value : option;
      this._value_set.add(option._value);
      this._valueToJsId[option._value] = option._jsId;
    });
    Object.freeze(this);
  }
}

/** The tree-structured options constant. */
const _options = new _Option('option', 'options', [
  new _Option('alternativeDefeats', 'alternative_defeats', [
    new _Option('yes', 'Y'),
    new _Option('never', 'N'),
  ]),
  new _Option('typeOfAltDefs', 'type_of_altdefs', [
    new _Option('perRefRule', 'per_reference_rule'),
    new _Option('beforeSingleDefeats', 'before_single_defeats'),
    new _Option('ifNoNewElecteds', 'if_no_new_electeds'),
  ]),
  new _Option('alwaysCountVotes', 'always_count_votes', [
    new _Option('yes', true),
    new _Option('no', false),
  ]),
  new _Option('ballotTree', 'ballot_tree', [
    new _Option('dynamic', 'dynamic'),
    new _Option('static', 'static'),
    new _Option('none', 'none'),
  ]),
]);

/**
 * This is a data object that provides various constants that are used
 * across multiple modules.
 * Some of its values are as if the following initializations had been made:
 * 
 * ~~~
 * K.Decimal = Decimal9; // the Decimal9 class
 * K.VERSION_NUMBERS = [ 1, 0, 0 ];
 * K.VERSION_STRING = '1.0.0';
 * K.ZERO = new Decimal9(0);
 * K.ONE = new Decimal9(1);
 * K.ULP = new Decimal9(0.000000001); // =  new Decimal9(1, -9);
 * K.MIN_RANKINGS_SUPPORTED = 3,
 * K.RANKING_CODE = { undervote: '', overvote: '#' },
 * K.RANKING_CODES_NOT_A_CANDIDATE = Set {['', '#']},
 * K.LABEL = {
 *   totalCandidateVotes:   ':Votes for candidates',
 *   overvotes:   ':Overvotes',
 *   abstentions:   ':Abstentions',
 *   otherExhausted:   ':Other exhausted',
 *   totalVotes:   ':Total votes',
 *   protectedQuota:   ':Protected quota',
 *   quotaVotes:   ':Quota votes',
 *   quota:   ':Quota',
 *   totalSurplus:   ':Total surplus',
 *   nbrIterations:   ':Iterations'
 * };
 * K.OTHER_LABELS_LIST = [
 *      ':Votes for candidates',
 *      ':Overvotes',
 *      ':Abstentions',
 *      ':Other exhausted',
 *      ':Total votes',
 *      ':Protected quota',
 *      ':Quota votes',
 *      ':Quota',
 *      ':Total surplus',
 *      ':Iterations'
 * ];
 * K.OPTIONS = {};
 * K.OPTIONS._value_set = Set {[
 *         'alternative_defeats',
 *         'type_of_altdefs',
 *         'always_count_votes',
 *         'ballot_tree'
 *         ]},
 * K.OPTIONS.alternativeDefeats = {
 *   _value = 'alternative_defeats',
 *   yes: 'Y',
 *   never: 'N',
 * };
 * K.OPTIONS.typeOfAltDefs = {
 *   _value: 'type_of_altdefs',
 *   perRefRule: 'per_reference_rule',
 *   beforeSingleDefeats: 'before_single_defeats',
 *   ifNoNewElecteds: 'if_no_new_electeds',
 * };
 * K.OPTIONS.alwaysCountVotes = {
 *   _value: 'always_count_votes',
 *   yes: true,
 *   'no': false,
 * };
 * K.OPTIONS.ballotTree = {
 *   _value: 'ballot_tree',
 *   'dynamic': 'dynamic',
 *   'static': 'static',
 *   'none': 'none',
 * };
 * K.STATUS = {
 *   hopeful: 'hopeful',
 *   defeated: 'defeated',
 *   elected: 'elected'
 * };
 * K.DESTINY = {
 *   normal: 'normal',
 *   excluded: 'excluded',
 *   'protected': 'protected'
 * };
 * K.ROUND = {
 *   away: 'away',
 *   truncate: 'truncate',
 *   nearest: 'nearest'
 * };
 *~~~
 */
const K = Object.freeze({
  Decimal: Decimal9,
  /** @type {array<number>} Major, minor, patch version numbers
   * using semantic versioning */
  VERSION_NUMBERS: _versionNumbers,
  /** @type {string} Major, minor, patch version numbers separated by periods
   * based on semantic versioning */
  VERSION_STRING: _versionString,
  ZERO: Object.freeze(new Decimal9(0)),
  ONE: Object.freeze(new Decimal9(1)),
  ULP: Object.freeze(Decimal9.ulp()),
  MIN_RANKINGS_SUPPORTED: 3,
  RANKING_CODE: _ranking_code,
  RANKING_CODES_NOT_A_CANDIDATE: Object.freeze(new Set(
        [_ranking_code.undervote, _ranking_code.overvote])),
  LABEL: _label,
  OTHER_LABELS_LIST: Object.freeze([
    _label.totalCandidateVotes, _label.overvotes, _label.abstentions,
    _label.otherExhausted, _label.totalVotes,
    _label.protectedQuota, _label.quotaVotes, _label.quota,
    _label.totalSurplus, _label.nbrIterations
  ]),
  OPTIONS: _options,
  STATUS: Object.freeze({
    hopeful: 'hopeful',
    defeated: 'defeated',
    elected: 'elected',
  }),
  DESTINY: Object.freeze({
    normal: 'normal',
    excluded: 'excluded',
    protected: 'protected',
  }),
  ROUND: Object.freeze({
    away: 'away',
    truncate: 'truncate',
    nearest: 'nearest',
  }),
});

export default K;

