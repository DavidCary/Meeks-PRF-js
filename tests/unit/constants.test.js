/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module ConstantsUnitTest
 * @summary Unit tests centrally declared constants
 */

import K from '../../src/constants.js';
import util from 'util';

const D9 = K.Decimal;

describe('Decimal9 constant values', () => {
  //console.debug(util.inspect(K));
  test('Decimal9 value constants', () => {
    expect(K.ZERO).toMatchObject(new D9());
    expect(K.ONE).toMatchObject(new D9(1));
    expect(K.ULP).toMatchObject(new D9(1, -9));
  });
});

describe('Ranking Codes', () => {
  test('Ranking Codes', () => {
    expect(K.RANKING_CODE.undervote).toBe('');
    expect(K.RANKING_CODE.overvote).toBe('#');
    expect(K.RANKING_CODES_NOT_A_CANDIDATE.size).toBe(2);
  });
});

describe('OPTIONs', () => {
  test('OPTION values', () => {
    expect(K.OPTIONS.alternativeDefeats._value).toBe('alternative_defeats');
    expect(K.OPTIONS.typeOfAltDefs._value).toBe('type_of_altdefs');
    expect(K.OPTIONS.alwaysCountVotes._value).toBe('always_count_votes');
    expect(K.OPTIONS.ballotTree._value).toBe('ballot_tree');
    expect(K.OPTIONS._value_set.size).toBe(4);
  });
  test('OPTIONS.alternativeDefeats values', () => {
    expect(K.OPTIONS.alternativeDefeats.yes).toBe('Y');
    expect(K.OPTIONS.alternativeDefeats.never).toBe('N');
    expect(K.OPTIONS.alternativeDefeats._value_set.size).toBe(2);
  });
  test('OPTIONS.typeOfAltDefs values', () => {
    expect(K.OPTIONS.typeOfAltDefs.perRefRule).toBe('per_reference_rule');
    expect(K.OPTIONS.typeOfAltDefs.beforeSingleDefeats)
          .toBe('before_single_defeats');
    expect(K.OPTIONS.typeOfAltDefs.ifNoNewElecteds)
          .toBe('if_no_new_electeds');
    expect(K.OPTIONS.typeOfAltDefs._value_set.size).toBe(3);
  });
  test('OPTIONS.alwaysCountVotes values', () => {
    expect(K.OPTIONS.alwaysCountVotes.yes).toBe(true);
    expect(K.OPTIONS.alwaysCountVotes.no).toBe(false);
    expect(K.OPTIONS.alwaysCountVotes._value_set.size).toBe(2);
  });
  test('OPTIONS.ballotTree values', () => {
    expect(K.OPTIONS.ballotTree.dynamic).toBe('dynamic');
    expect(K.OPTIONS.ballotTree.static).toBe('static');
    expect(K.OPTIONS.ballotTree.none).toBe('none');
    expect(K.OPTIONS.ballotTree._value_set.size).toBe(3);
  });
});

describe('STATUS', () => {
  test('STATUS values', () => {
    expect(K.STATUS.hopeful).toBe('hopeful');
    expect(K.STATUS.defeated).toBe('defeated');
    expect(K.STATUS.elected).toBe('elected');
  });
});

describe('DESTINY', () => {
  test('DESTINY values', () => {
    expect(K.DESTINY.normal).toBe('normal');
    expect(K.DESTINY.excluded).toBe('excluded');
    expect(K.DESTINY.protected).toBe('protected');
  });
});

describe('ROUND', () => {
  test('ROUND values', () => {
    expect(K.ROUND.away).toBe('away');
    expect(K.ROUND.truncate).toBe('truncate');
    expect(K.ROUND.nearest).toBe('nearest');
  });
});

