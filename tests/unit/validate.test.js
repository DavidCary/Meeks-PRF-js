/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module ValidateUnitTest
 * @summary Unit tests Validator class and toArrayOfStrings function
 */

import K from '../../src/constants.js';
import {Ballot} from '../../src/ballot.js';
import {Validator} from '../../src/validate.js';
import {MeekValueError} from '../../src/errors.js';
import {_getError, _expectError} from '../_test_aids.js';

const D9 = K.Decimal;

describe('toArrayOfStrings simple tests', () => {
  test('convert from empty string', () => {
    let result = Validator.toArrayOfStrings('');
    expect(result).not.toBeNull();
    expect(result).toMatchObject([]);
  });
  test('convert from empty String', () => {
    let result = Validator.toArrayOfStrings(new String(''));
    expect(result).not.toBeNull();
    expect(result).toMatchObject([]);
  });
  test('convert from empty array', () => {
    let result = Validator.toArrayOfStrings([]);
    expect(result).not.toBeNull();
    expect(result).toMatchObject([]);
  });
  test('convert from one-character string', () => {
    let result = Validator.toArrayOfStrings('x');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['']);
  });
  test('convert from one-character String', () => {
    let result = Validator.toArrayOfStrings(new String(' '));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['']);
  });
});

describe('toArrayOfStrings from strings or Strings', () => {
  test('produce 3-item array', () => {
    let result = Validator.toArrayOfStrings(' A Bb CcC');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'Bb', 'CcC']);
  });
  test('last character is delimiter', () => {
    let result = Validator.toArrayOfStrings(new String(',A,B b,C,'));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'B b', 'C', '']);
  });
  test('produce empty string at beginning of array', () => {
    let result = Validator.toArrayOfStrings('||X|Y|Z');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['', 'X', 'Y', 'Z']);
  });
  test('produce empty string in the middle of array', () => {
    let result = Validator.toArrayOfStrings('pepper');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['e', '', 'er']);
  });
});

describe('toArrayOfStrings from array', () => {
  test('produce 3-item array', () => {
    let result = Validator.toArrayOfStrings(' A Bb CcC');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'Bb', 'CcC']);
  });
  test('last character is delimiter', () => {
    let result = Validator.toArrayOfStrings(new String(',A,B b,C,'));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'B b', 'C', '']);
  });
  test('produce empty string at beginning of array', () => {
    let result = Validator.toArrayOfStrings('||X|Y|Z');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['', 'X', 'Y', 'Z']);
  });
  test('produce empty string in the middle of array', () => {
    let result = Validator.toArrayOfStrings('pepper');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['e', '', 'er']);
  });
  test('produce strings from String', () => {
    let result = Validator.toArrayOfStrings(new String(',A,B,C'));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'B', 'C']);
    expect(result[1]).toBe('B');
    expect(typeof result[1]).toBe('string');
    expect(result[1]).not.toBe(new String('B'));
  });
});

describe('toArrayOfStrings throws errors', () => {
  test('given a number', () => {
    _expectError((() => Validator.toArrayOfStrings(3)), MeekValueError,
         /^MeekValueError: Value is not a string or array:\n/);
  });
  test('given a data object', () => {
    _expectError((() => Validator.toArrayOfStrings({a: 'yes', b: 'no'})),
          MeekValueError,
          /^MeekValueError: Value is not a string or array:\n/);
  });
  test('given no value', () => {
    _expectError((() => Validator.toArrayOfStrings()),
          MeekValueError,
          /^MeekValueError: Value is not a string or array:\n/);
  });
  test('given null value', () => {
    _expectError((() => Validator.toArrayOfStrings(null)),
          MeekValueError,
          /^MeekValueError: Value is not a string or array:\n/);
  });
  test('given a RegExp literal', () => {
    _expectError((() => Validator.toArrayOfStrings(/ababbabbb/)),
          MeekValueError,
          /^MeekValueError: Value is not a string or array:\n/);
  });
  test('given a data object', () => {
    _expectError((() => Validator.toArrayOfStrings({a: 'yes', b: 'no'})),
          MeekValueError,
          /^MeekValueError: Value is not a string or array:\n/);
  });
  test('given an array with a number', () => {
    _expectError((() => Validator.toArrayOfStrings(['A', 3, 'B'])),
          MeekValueError,
          /^MeekValueError: Array has an item that is not a string:\n/);
  });
  test('given an array with an undefined item', () => {
    let undef = undefined;
    let array = ['A', undef,'B'];
    _expectError((() => Validator.toArrayOfStrings(array)),
          MeekValueError,
          /^MeekValueError: Array has an item that is not a string:\n/);
  });
  test('given an array with a null item', () => {
    let nullItem = null;
    let array = ['A', nullItem,'B'];
    _expectError((() => Validator.toArrayOfStrings(array)),
          MeekValueError,
          /^MeekValueError: Array has an item that is not a string:\n/);
  });
  test('given an array with a plain data object', () => {
    let objectItem = {a: 'here', b: 'there'};
    let array = ['A', objectItem,'B'];
    _expectError((() => Validator.toArrayOfStrings(array)),
          MeekValueError,
          /^MeekValueError: Array has an item that is not a string:\n/);
  });
});

describe('Validator.nbrSeatsToFill', () => {
  test('given 1', () => {
    expect(new Validator().nbrSeatsToFill(1)).toBe(1);
  });
  test('given 5', () => {
    expect(new Validator().nbrSeatsToFill(5)).toBe(5);
  });
  test('given 7654321', () => {
    expect(new Validator().nbrSeatsToFill(7654321)).toBe(7654321);
  });
});

describe('Validator.nbrSeatsToFill throws errors', () => {
  test('given 0', () => {
    _expectError((() => new Validator().nbrSeatsToFill(0)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is less than 1:\n/);
  });
  test('given -1', () => {
    _expectError((() => new Validator().nbrSeatsToFill(-1)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is less than 1:\n/);
  });
  test('given "3"', () => {
    _expectError((() => new Validator().nbrSeatsToFill("3")),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
  test('given undefined', () => {
    _expectError((() => new Validator().nbrSeatsToFill(undefined)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
  test('given an integer too big', () => {
    _expectError((() => new Validator().nbrSeatsToFill(9000101)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
  test('given a NaN', () => {
    _expectError((() => new Validator().nbrSeatsToFill(0/0)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
  test('given a number not an integer', () => {
    _expectError((() => new Validator().nbrSeatsToFill(9.5)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
  test('given null', () => {
    _expectError((() => new Validator().nbrSeatsToFill(null)),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
  test('given new Number(2)', () => {
    _expectError((() => new Validator().nbrSeatsToFill(new Number(2))),
          MeekValueError,
          /^MeekValueError: nbrSeatsToFill is not a safe integer:\n/);
  });
});

describe('Validator.candidates', () => {
  test('given empty string', () => {
    let candidates = '';
    expect(new Validator().candidates(candidates)).toMatchObject([]);
  });
  test('given a string with a single name', () => {
    let candidates = ';G';
    expect(new Validator().candidates(candidates)).toMatchObject(['G']);
  });
  test('given a string with three names', () => {
    let candidates = '-G-H-I';
    expect(new Validator().candidates(candidates)).toMatchObject(
          ['G', 'H', 'I']);
  });
  test('given an empty array', () => {
    let candidates = [];
    expect(new Validator().candidates(candidates)).toMatchObject([]);
  });
  test('given an array with three names', () => {
    let candidates = ['pad', 'sad', 'glad'];
    expect(new Validator().candidates(candidates)).toMatchObject(
          ['pad', 'sad', 'glad']);
  });
  test('given a string with lots of names', () => {
    let candidates = ' A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
    expect(new Validator().candidates(candidates)).toMatchObject(
          ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  });
});

describe('Validator.candidates throws errors', () => {
  test('given a one-character string, "x"', () => {
    _expectError((() => new Validator().candidates("x")),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in list of candidates:\n/);
  });
  test('given the number 7', () => {
    _expectError((() => new Validator().candidates(7)),
          MeekValueError,
          /^MeekValueError: Invalid candidates type:\n/);
  });
  test('given an array with an undefined item', () => {
    _expectError((() => new Validator().candidates(['A', , 'C'])),
          MeekValueError,
          /^MeekValueError: Invalid candidates type:\n/);
  });
  test('given an array with an empty string', () => {
    _expectError((() => new Validator().candidates(['A', '', 'C'])),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in list of candidates:\n/);
  });
  test('given a string with an overvote ranking code', () => {
    _expectError((() => new Validator().candidates(':A:#:C')),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in list of candidates:\n/);
  });
  test('given a string with a name that starts with ":"', () => {
    _expectError((() => new Validator().candidates('.A.:more?.C')),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in list of candidates:\n/);
  });
  test('given a string with a duplicate name', () => {
    _expectError((() => new Validator().candidates(['A', 'K', 'A'])),
          MeekValueError,
          /^MeekValueError: Duplicate candidate ID in list of candidates:/);
  });
  test('given an array with duplicate names', () => {
    _expectError((() => new Validator().candidates(['A', 'B', 'A'])),
          MeekValueError,
          /^MeekValueError: Duplicate candidate ID in list of candidates:/);
  });
});

describe('Validator.tieBreaker', () => {
  test('valid tieBreakers', () => {
    let candidates = ['B', 'C', 'A', 'I', 'H', 'G', 'F', 'E', 'D', 'J', 'K',
          'L', 'Joe Smith', 'John Doe', 'Smith, Joe', 'Doe, John'];
    expect(new Validator().tieBreaker([], candidates)).toMatchObject({});
    expect(new Validator().tieBreaker('', candidates)).toMatchObject({});
    expect(new Validator().tieBreaker(['A'], candidates))
          .toMatchObject({'A': 0});
    expect(new Validator().tieBreaker(['B', 'A'], candidates))
          .toMatchObject({'B': 0, 'A': 1});
    expect(new Validator().tieBreaker(['B', 'C', 'A'], candidates))
          .toMatchObject({'B': 0, 'C': 1, 'A': 2});
    expect(new Validator().tieBreaker(
          ['B', 'C', 'A', 'I', 'H', 'G', 'F', 'E', 'D', 'J', 'K', 'L'],
          candidates)).toMatchObject(
          {'B': 0, 'C': 1, 'A': 2, 'I': 3, 'H': 4, 'G': 5, 'F': 6, 'E': 7,
          'D': 8, 'J': 9, 'K': 10, 'L': 11});
    expect(new Validator().tieBreaker(' A', candidates))
          .toMatchObject({'A': 0});
    expect(new Validator().tieBreaker(' B A', candidates))
          .toMatchObject({'B': 0, 'A': 1});
    expect(new Validator().tieBreaker(' B C A', candidates))
          .toMatchObject({'B': 0, 'C': 1, 'A': 2});
    expect(new Validator().tieBreaker(
          ' B C A I H G F E D J K L', candidates)).toMatchObject(
          {'B': 0, 'C': 1, 'A': 2, 'I': 3, 'H': 4, 'G': 5, 'F': 6, 'E': 7,
          'D': 8, 'J': 9, 'K': 10, 'L': 11});
    expect(new Validator().tieBreaker(
          ',Joe Smith,John Doe', candidates)).toMatchObject(
          {'Joe Smith': 0, 'John Doe': 1});
    expect(new Validator().tieBreaker(
          ';Smith, Joe;Doe, John', candidates)).toMatchObject(
          {'Smith, Joe': 0, 'Doe, John': 1});
  });
});

describe('Validator.tieBreaker throws errors', () => {
  let candidates = ['A', 'C'];
  test('given a number', () => {
    _expectError((() => new Validator().tieBreaker(17, candidates)),
          MeekValueError,
          /^MeekValueError: Invalid tieBreaker type:\n/);
  });
  test('given an array with a number', () => {
    _expectError((() => new Validator().tieBreaker(['A', 17], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid tieBreaker type:\n/);
  });
  test('given an array with an empty string', () => {
    _expectError((() => new Validator().tieBreaker(['A', ''], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in tieBreaker:\n/);
  });
  test('given an array with an "#"', () => {
    _expectError((() => new Validator().tieBreaker(['A', '#'], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in tieBreaker:\n/);
  });
  test('given an array with a name beginning with ":"', () => {
    _expectError((() => new Validator().tieBreaker(['A', ':?'], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in tieBreaker:\n/);
  });
  test('given an array with a valid name, but not in candidates', () => {
    _expectError((() => new Validator().tieBreaker(['A', 'B'], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in tieBreaker:\n/);
  });
  test('given an array with duplicate names', () => {
    _expectError((() => new Validator().tieBreaker(
          ['A', 'C', 'A'], candidates)),
          MeekValueError,
          /^MeekValueError: Duplicate candidate ID in tieBreaker:/);
  });
});

describe('Validator.ballots', () => {
  test('valid ballots', () => {
    let candidates = Validator.toArrayOfStrings(' A B C D E F G H I J K L');
    expect(new Validator().ballots([], candidates, 3)).toMatchObject([]);
    expect(new Validator().ballots(
          [[5, ['A']]],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[5, ['A']]]);
    expect(new Validator().ballots(
          [[5, ' A']],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[5, ['A']]]);
    expect(new Validator().ballots(
          [[3, ' A B'], [5, ' B A']],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[3, ['A', 'B']], [5, ['B', 'A']]]);
    expect(new Validator().ballots(
          [[3, ' A B'], [5, ' B # A']],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[3, ['A', 'B']], [5, ['B', '#', 'A']]]);
    expect(new Validator().ballots(
          [[3, ' A B'], [5, ' B   A']],
          candidates, 4).map(x => x.asArray())).toMatchObject(
          [[3, ['A', 'B']], [5, ['B', '', '', 'A']]]);
    expect(new Validator().ballots(
          [[3, ' A B'], [5, ' B   A']],
          candidates, null).map(x => x.asArray())).toMatchObject(
          [[3, ['A', 'B']], [5, ['B', '', '', 'A']]]);
    expect(new Validator().ballots(
          [[3, ' A B'], [5, '   A']],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[3, ['A', 'B']], [5, ['', '', 'A']]]);
    expect(new Validator().ballots(
          [[3, ' A B'], [5, ' #']],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[3, ['A', 'B']], [5, ['#']]]);
    expect(new Validator().ballots(
          [[9000095, ' A B'], [5, ' #']],
          candidates, 3).map(x => x.asArray())).toMatchObject(
          [[9000095, ['A', 'B']], [5, ['#']]]);
    expect(new Validator().ballots(
          [' A B', ',C,#,,A'],
          candidates, 4).map(x => x.asArray())).toMatchObject(
          [[1, ['A', 'B']], [1, ['C', '#', '', 'A']]]);
    expect(new Validator().ballots(
          [['A', 'B'], ['C', '', '#', 'A']],
          candidates, 4).map(x => x.asArray())).toMatchObject(
          [[1, ['A', 'B']], [1, ['C', '', '#', 'A']]]);
    expect(new Validator().ballots(
          [[3, ' A B C D E F G H I J K L'],
          [5, ' L K J I H G F E D C B A']],
          candidates, 12).map(x => x.asArray())).toMatchObject(
          [[3, ['A','B','C','D','E','F','G','H','I','J','K','L']],
          [5, ['L','K','J','I','H','G','F','E','D','C','B','A']]]);
    expect(new Validator().ballots(
          [[3, ' A B C D E F G H I J K L'],
          [5, ' L K J I H G F E D C B A']],
          candidates, null).map(x => x.asArray())).toMatchObject(
          [[3, ['A','B','C','D','E','F','G','H','I','J','K','L']],
          [5, ['L','K','J','I','H','G','F','E','D','C','B','A']]]);
  });
});

describe('Validator.ballots throws errors', () => {
  let candidates = Validator.toArrayOfStrings(' A B C D E F G H I J K L');
  test('given a number', () => {
    _expectError((() => new Validator().ballots(17, candidates)),
          MeekValueError,
          /^MeekValueError: ballots is not an array:\n/);
  });
  test('given a string', () => {
    _expectError((() => new Validator().ballots(' A B', candidates)),
          MeekValueError,
          /^MeekValueError: ballots is not an array:\n/);
  });
  test('ballot has only one element that is not a string', () => {
    _expectError((() => new Validator().ballots([[7]], candidates)),
          MeekValueError,
          /^MeekValueError: A ballot is not a pair of values:\n/);
  });
  test('with a ballot multiple that is not an integer', () => {
    _expectError((() => new Validator().ballots([[0.12, ' A B']], candidates)),
          MeekValueError,
          /^MeekValueError: A ballot multiple is not a safe integer:\n/);
  });
  test('with a ballot multiple that is too big', () => {
    _expectError((() => new Validator().ballots(
          [[9000101, ' A B']], candidates)),
          MeekValueError,
          /^MeekValueError: A ballot multiple is not a safe integer:\n/);
  });
  test('with a ballot multiple that is 0', () => {
    _expectError((() => new Validator().ballots([[0, ' A B']], candidates)),
          MeekValueError,
          /^MeekValueError: A ballot multiple is zero or less:\n/);
  });
  test('with a ballot multiple that is -1', () => {
    _expectError((() => new Validator().ballots([[-1, ' A B']], candidates)),
          MeekValueError,
          /^MeekValueError: A ballot multiple is zero or less:\n/);
  });
  test('with a ballot with number as rankings', () => {
    _expectError((() => new Validator().ballots([[31, 77]], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid ballot rankings type:\n/);
  });
  test('with a ballot with number in rankings array', () => {
    _expectError((() => new Validator().ballots([[31, [77]]], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid ballot rankings type:\n/);
  });
  test('with a ballot with too many rankings', () => {
    _expectError((() => new Validator().ballots(
          [[31, ' A B C D']], candidates, 3)),
          MeekValueError,
          /^MeekValueError: Ballot rankings is too long:\n/);
  });
  test('with a ballot with invalid ranking code', () => {
    _expectError((() => new Validator().ballots(
          [[3, ' A B Z D']], candidates, 4)),
          MeekValueError,
          /^MeekValueError: Invalid ballot ranking code:\n/);
  });
  test('with a skipped item in ballots array', () => {
    _expectError((() => new Validator().ballots(
          [[3, ' A B E D'],,[2, '']], candidates, 4)),
          MeekValueError,
          /^MeekValueError: Ballots contains undefined items:\n/);
  });
  test('with a ballot that is a number', () => {
    _expectError((() => new Validator().ballots(
          [3], candidates, 4)),
          MeekValueError,
          /^MeekValueError: A ballot is not an array nor a string:\n/);
  });
  test('with too many ballots', () => {
    _expectError((() => new Validator().ballots(
          [[9000099, ' A B'], [2, ' B A']], candidates, 4)),
          MeekValueError,
          new RegExp([
          /^MeekValueError: The absolute total number of ballots/,
          / is not a safe integer:\n/,
          ].map(f=>f.source).join('')));
  });
});

describe('Validator.maxRankingLevels', () => {
  test('given 3', () => {
    expect(new Validator().maxRankingLevels(3)).toBe(3);
  });
  test('given 5', () => {
    expect(new Validator().maxRankingLevels(5)).toBe(5);
  });
  test('given 7654321', () => {
    expect(new Validator().maxRankingLevels(7654321)).toBe(7654321);
  });
  test('given null', () => {
    expect(new Validator().maxRankingLevels(null)).toBeNull();
  });
});

describe('Validator.maxRankingLevels throws errors', () => {
  test('given 0', () => {
    _expectError((() => new Validator().maxRankingLevels(0)),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is less than 3:\n/);
  });
  test('given -1', () => {
    _expectError((() => new Validator().maxRankingLevels(-1)),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is less than 3:\n/);
  });
  test('given "3"', () => {
    _expectError((() => new Validator().maxRankingLevels("3")),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is not a safe integer:\n/);
  });
  test('given undefined', () => {
    _expectError((() => new Validator().maxRankingLevels(undefined)),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is not a safe integer:\n/);
  });
  test('given an integer too big', () => {
    _expectError((() => new Validator().maxRankingLevels(9000101)),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is not a safe integer:\n/);
  });
  test('given a NaN', () => {
    _expectError((() => new Validator().maxRankingLevels(0/0)),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is not a safe integer:\n/);
  });
  test('given a number not an integer', () => {
    _expectError((() => new Validator().maxRankingLevels(9.5)),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is not a safe integer:\n/);
  });
  test('given new Number(7)', () => {
    _expectError((() => new Validator().maxRankingLevels(new Number(7))),
          MeekValueError,
          /^MeekValueError: maxRankingLevels is not a safe integer:\n/);
  });
});

describe('Validator.excluded', () => {
  let candidates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  test('given empty string', () => {
    let excluded = '';
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set());
  });
  test('given null', () => {
    let excluded = null;
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set());
  });
  test('given a string with a single name', () => {
    let excluded = ';G';
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set(['G']));
  });
  test('given a string with three names', () => {
    let excluded = '-G-H-I';
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set(['G', 'H', 'I']));
  });
  test('given an empty array', () => {
    let excluded = [];
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set());
  });
  test('given an array with three names', () => {
    let excluded = ['G', 'F', 'E'];
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set(['G', 'F', 'E']));
  });
  test('given a string with lots of names', () => {
    let candidates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
          'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
          'Y', 'Z'];
    let excluded = ' A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
    expect(new Validator().excluded(excluded, candidates)).toMatchObject(
          new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
          'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
          'Y', 'Z']));
  });
});

describe('Validator.excluded throws errors', () => {
  let candidates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  test('given a one-character string, "x"', () => {
    _expectError((() => new Validator().excluded("x", candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in excluded:\n/);
  });
  test('given the number 7', () => {
    _expectError((() => new Validator().excluded(7, candidates)),
          MeekValueError,
          /^MeekValueError: Invalid excluded type:\n/);
  });
  test('given an array with an undefined item', () => {
    _expectError((() => new Validator().excluded(['A', , 'C'], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid excluded type:\n/);
  });
  test('given an array with a non-candidate name', () => {
    _expectError((() => new Validator().excluded(['A', 'Z', 'C'], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in excluded:\n/);
  });
  test('given an array with an empty string', () => {
    _expectError((() => new Validator().excluded(['A', '', 'C'], candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in excluded:\n/);
  });
  test('given a string with an overvote ranking code', () => {
    _expectError((() => new Validator().excluded(':A:#:C', candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in excluded:\n/);
  });
  test('given a string with a name that starts with ":"', () => {
    _expectError((() => new Validator().excluded('.A.:more?.C', candidates)),
          MeekValueError,
          /^MeekValueError: Invalid candidate ID in excluded:\n/);
  });
  test('given a string with a duplicate name', () => {
    _expectError((() => new Validator().excluded(['A', 'H', 'A'], candidates)),
          MeekValueError,
          /^MeekValueError: Candidate ID in excluded is not unique./);
  });
  test('given an array with duplicate names', () => {
    _expectError((() => new Validator().excluded(['A', 'B', 'A'], candidates)),
          MeekValueError,
          /^MeekValueError: Candidate ID in excluded is not unique./);
  });
});

describe('Validator.protectedCandidates', () => {
  let candidates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  let excluded = new Set(['F', 'G', 'I']);
  test('given empty string', () => {
    let protectedList = '';
    expect(new Validator().protectedCandidates(
          protectedList, candidates, excluded, 3)).toMatchObject(
          new Set());
  });
  test('given null', () => {
    let protectedList = null;
    expect(new Validator().protectedCandidates(
          protectedList, candidates, excluded, 3)).toMatchObject(
          new Set());
  });
  test('given a string with a single name', () => {
    let protectedList = ';H';
    expect(new Validator().protectedCandidates(
          protectedList, candidates, excluded, 3)).toMatchObject(
          new Set(['H']));
  });
  test('given a string with three names', () => {
    let protectedList = '-B-E-H';
    expect(new Validator().protectedCandidates(
          protectedList, candidates, excluded, 3)).toMatchObject(
          new Set(['B', 'E', 'H']));
  });
  test('given an empty array', () => {
    let protectedList = [];
    expect(new Validator().protectedCandidates(
          protectedList, candidates, excluded, 3)).toMatchObject(
          new Set());
  });
  test('given an array with three names', () => {
    let protectedList = ['A', 'C', 'E'];
    expect(new Validator().protectedCandidates(
          protectedList, candidates, excluded, 3)).toMatchObject(
          new Set(['A', 'C', 'E']));
  });
  test('given a string with lots of names', () => {
    let candidates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
          'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
          'Y', 'Z'];
    let protectedList = ' A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
    expect(new Validator().protectedCandidates(
          protectedList, candidates, new Set(), 26)).toMatchObject(
          new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
          'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
          'Y', 'Z']));
  });
});

describe('Validator.protected throws errors', () => {
  let candidates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  let excluded = new Set(['F', 'G', 'I']);
  test('given a one-character string, "x"', () => {
    _expectError((() => new Validator().protectedCandidates(
          "x", candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protected candidate ID:\n/);
  });
  test('given the number 7', () => {
    _expectError((() => new Validator().protectedCandidates(
          7, candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protectedList type:\n/);
  });
  test('given an array with an undefined item', () => {
    _expectError((() => new Validator().protectedCandidates(
          ['A', , 'C'], candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protectedList type:\n/);
  });
  test('given an array with a non-candidate name', () => {
    _expectError((() => new Validator().protectedCandidates(
          ['A', 'Z', 'C'], candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protected candidate ID:\n/);
  });
  test('given an array with an empty string', () => {
    _expectError((() => new Validator().protectedCandidates(
          ['A', '', 'C'], candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protected candidate ID:\n/);
  });
  test('given a string with an overvote ranking code', () => {
    _expectError((() => new Validator().protectedCandidates(
          ':A:#:C', candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protected candidate ID:\n/);
  });
  test('given a string with a name that starts with ":"', () => {
    _expectError((() => new Validator().protectedCandidates(
          '.A.:more?.C', candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Invalid protected candidate ID:\n/);
  });
  test('given a candidate name that is both excluded and protected', () => {
    _expectError((() => new Validator().protectedCandidates(
          ' F', candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Candidate ID is protected and excluded:\n/);
  });
  test('given a string with a duplicate name', () => {
    _expectError((() => new Validator().protectedCandidates(
          ['A', 'H', 'A'], candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Protected candidate ID is not unique./);
  });
  test('given an array with duplicate names', () => {
    _expectError((() => new Validator().protectedCandidates(
          ['A', 'B', 'A'], candidates, excluded, 3)),
          MeekValueError,
          /^MeekValueError: Protected candidate ID is not unique./);
  });
  test('given an array with more names than seats to fill', () => {
    _expectError((() => new Validator().protectedCandidates(
          ['A', 'B', 'C'], candidates, excluded, 2)),
          MeekValueError,
          /^MeekValueError: More protected candidates than seats to fill:\n/);
  });
});

describe('Validator.options', () => {
  test('Option alternative defeat', () => {
    expect(new Validator().options({'alternative_defeats': 'Y'}))
          .toMatchObject({'alternative_defeats': 'Y'});
    expect(new Validator().options({'alternative_defeats': 'y'}))
          .toMatchObject({'alternative_defeats': 'Y'});
    expect(new Validator().options({'alternative_defeats': 'N'}))
          .toMatchObject({'alternative_defeats': 'N'});
    expect(new Validator().options({'alternative_defeats': 'n'}))
          .toMatchObject({'alternative_defeats': 'N'});
    expect(new Validator().options({'alternative_defeats': ['y', 'n', 'Y']}))
          .toMatchObject({'alternative_defeats': ['Y', 'N', 'Y']});
    expect(new Validator().options({'alternative_defeats': ['N', 'y', 'n']}))
          .toMatchObject({'alternative_defeats': ['N', 'Y', 'N']});
    expect(new Validator().options({'alternative_defeats': ' y n N Y'}))
          .toMatchObject({'alternative_defeats': ['Y', 'N', 'N', 'Y']});
  });
  test('Option type of altdef', () => {
    expect(new Validator().options({'type_of_altdefs': 'per_reference_rule'}))
          .toMatchObject({'type_of_altdefs': 'per_reference_rule'});
    expect(new Validator().options({'type_of_altdefs': 'pEr_RefereNce_ruLe'}))
          .toMatchObject({'type_of_altdefs': 'per_reference_rule'});
    expect(new Validator()
          .options({'type_of_altdefs': 'before_single_defeats'}))
          .toMatchObject({'type_of_altdefs': 'before_single_defeats'});
    expect(new Validator().options({'type_of_altdefs': 'if_no_new_electeds'}))
          .toMatchObject({'type_of_altdefs': 'if_no_new_electeds'});
  });
  test('Option always count votes', () => {
    expect(new Validator().options({'always_count_votes': true}))
          .toMatchObject({'always_count_votes': true});
    expect(new Validator().options({'always_count_votes': false}))
          .toMatchObject({'always_count_votes': false});
  });
  test('Option combinations', () => {
    expect(new Validator().options({
          'alternative_defeats': 'y',
          'type_of_altdefs': 'before_SINGLE_defeats'}))
          .toMatchObject({
          'alternative_defeats': 'Y',
          'type_of_altdefs': 'before_single_defeats'});
    expect(new Validator().options({
          'alternative_defeats': ' y n n n n',
          'type_of_altdefs': 'if_no_new_electeds',
          'always_count_votes': false}))
          .toMatchObject({
          'alternative_defeats': ['Y', 'N', 'N', 'N', 'N'],
          'type_of_altdefs': 'if_no_new_electeds',
          'always_count_votes': false});
  });
});

describe('Validator.options throws errors', () => {
  test('Option is invalid', () => {
    _expectError((() => new Validator().options(7)),
          MeekValueError,
          /^MeekValueError: Options is not an object:\n/);
    _expectError((() => new Validator().options({'phony': true})),
          MeekValueError,
          /^MeekValueError: Invalid option name:\n/);
  });
  test('Option altdef is invalid', () => {
    _expectError((() => new Validator().options({
          'alternative_defeats': true})),
          MeekValueError,
          /^MeekValueError: Invalid option value type:\n/);
    _expectError((() => new Validator().options({
          'alternative_defeats': 'yes'})),
          MeekValueError,
          /^MeekValueError: Invalid per-round option value:\n/);
    _expectError((() => new Validator().options({
          'alternative_defeats': ['y', 'u']})),
          MeekValueError,
          /^MeekValueError: Invalid per-round option value:\n/);
  });
  test('Option type altdef is invalid', () => {
    _expectError((() => new Validator().options({
          'type_of_altdefs': true})),
          MeekValueError,
          /^MeekValueError: Invalid option value:\n/);
    _expectError((() => new Validator().options({
          'type_of_altdefs': 'reference_rule'})),
          MeekValueError,
          /^MeekValueError: Invalid option value:\n/);
  });
  test('Option always count votes is invalid', () => {
    _expectError((() => new Validator().options({
          'always_count_votes': 7})),
          MeekValueError,
          /^MeekValueError: Invalid option value:\n/);
    _expectError((() => new Validator().options({
          'always_count_votes': 'Y'})),
          MeekValueError,
          /^MeekValueError: Invalid option value:\n/);
  });
});

