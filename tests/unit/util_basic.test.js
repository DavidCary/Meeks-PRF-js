/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module UtilBasicUnitTest
 * @summary Unit tests of basic utility classes and functions
 */

import {_getError, _expectError} from '../_test_aids.js';
import * as UtilBasic from '../../src/util_basic.js';
const UBF = UtilBasic.UBF;
const UtilValueError = UtilBasic.UtilValueError;

describe('test indentMessage()', () => {
  test('indent simple message', () => {
    expect(UBF.indentMessage('Hello')).toBe('  Hello');
  });

  test('indent empty message', () => {
    expect(UBF.indentMessage('')).toBe('  ');
  });

  test('indent message ending with new line', () => {
    expect(UBF.indentMessage('This looks easy.\n')).
      toBe('  This looks easy.\n');
  });

  test('indent multi-line message', () => {
    expect(UBF.indentMessage('Hello\n  and\nGoodbye!\n', 4)).
      toBe('    Hello\n      and\n    Goodbye!\n');
  });

  test('indent multi-line message with empty lines', () => {
    expect(UBF.indentMessage('Hello\n  or\n\nGoodbye?', 1)).
      toBe(' Hello\n   or\n \n Goodbye?');
  });

  test('indent zero spaces', () => {
    expect(UBF.indentMessage('Where:', 0)).toBe('Where:');
  });
});

describe('test describeError()', () => {
  test('what does Error() look like', () => {
    let err = Error();
    //console.log(err.toString());
    //console.log(err.toSource());
    //console.log(err.valueOf());
    //console.log(err);
    expect(err.toString()).toBe('Error');
  });
  test('what does Error() with a message look like', () => {
    let err = Error('This is a message.');
    expect(err.toString()).toBe('Error: This is a message.');
  });

  test('describe Error()', () => {
    let err = Error('Something went wrong!');
    let descr = UBF.describeError(err)
      .match(/^Error description:\n  Error: Something went wrong!/);

    expect(descr).not.toBeNull();
    expect(Array.from(descr))
      .toEqual(['Error description:\n  Error: Something went wrong!']);
  });
});

describe('test UtilBaseError', () => {
  test('create with empty message', () => {
    let err = new UtilBasic.UtilBaseError();
    expect(err.toString()).toBe('UtilBaseError: ERROR');
  });
  test('create with message', () => {
    let err = new UtilBasic.UtilBaseError('Test error');
    expect(err.toString()).toBe('UtilBaseError: Test error');
  });
  test('create with message and values', () => {
    let err = new UtilBasic.UtilBaseError('Test error values:', [
      ['a number', 3],
      ['a string', 'nice'],
    ]);
    expect(err.toString()).toBe('UtilBaseError: Test error values:\n' +
      '  a number                  = 3\n' +
      '  a string                  = "nice"'
    );
    let descr = UBF.describeError(err);
    let match1 = descr.match(
      /^Error description:\n  UtilBaseError: Test error values:\n/);
    expect(match1).not.toBeNull();
    expect(Array.from(match1).length).toBe(1);
    let match2 = descr.match(/END Error description$/);
    expect(match2).not.toBeNull();
    expect(Array.from(match2).length).toBe(1);
  });
  test('create with message, values, and prior error', () => {
    let err = new UtilBasic.UtilBaseError('Test error values:', [
      ['a number', 423],],
      Error('This was the prior error.'));
    expect(err.toString()).toBe(
      'UtilBaseError: Test error values:\n' +
      '  a number                  = 423\n' +
      '  Prior error:\n' +
      '    Error: This was the prior error.'
    );
    let descr = UBF.describeError(err);
    let match1 = descr.match(new RegExp([
          /\nPrior Error:\n  Error description:\n/,
          /    Error: This was the prior error.\n/,
    ].map(f=>f.source).join('')));
    expect(match1).not.toBeNull();
    expect(Array.from(match1).length).toBe(1);
  });
});

describe('test UtilBaseError', () => {
  test('create with empty message', () => {
    let err = new UtilBasic.UtilBaseError();
    expect(err.toString()).toBe('UtilBaseError: ERROR');
    expect(err.name).toBe('UtilBaseError');
  });
});

describe('test UtilValueError', () => {
  test('create with empty message', () => {
    let err = new UtilBasic.UtilValueError();
    expect(err.toString()).toBe('UtilValueError: ERROR');
    expect(err.name).toBe('UtilValueError');
  });
});

describe('toArrayOfStrings simple tests', () => {
  test('convert from empty string', () => {
    let result = UBF.toArrayOfStrings('');
    expect(result).not.toBeNull();
    expect(result).toMatchObject([]);
  });
  test('convert from empty String', () => {
    let result = UBF.toArrayOfStrings(new String(''));
    expect(result).not.toBeNull();
    expect(result).toMatchObject([]);
  });
  test('convert from empty array', () => {
    let result = UBF.toArrayOfStrings([]);
    expect(result).not.toBeNull();
    expect(result).toMatchObject([]);
  });
  test('convert from one-character string', () => {
    let result = UBF.toArrayOfStrings('x');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['']);
  });
  test('convert from one-character String', () => {
    let result = UBF.toArrayOfStrings(new String(' '));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['']);
  });
});

describe('toArrayOfStrings from strings or Strings', () => {
  test('produce 3-item array', () => {
    let result = UBF.toArrayOfStrings(' A Bb CcC');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'Bb', 'CcC']);
  });
  test('last character is delimiter', () => {
    let result = UBF.toArrayOfStrings(new String(',A,B b,C,'));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'B b', 'C', '']);
  });
  test('produce empty string at beginning of array', () => {
    let result = UBF.toArrayOfStrings('||X|Y|Z');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['', 'X', 'Y', 'Z']);
  });
  test('produce empty string in the middle of array', () => {
    let result = UBF.toArrayOfStrings('pepper');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['e', '', 'er']);
  });
});

describe('toArrayOfStrings from array', () => {
  test('produce 3-item array', () => {
    let result = UBF.toArrayOfStrings(' A Bb CcC');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'Bb', 'CcC']);
  });
  test('last character is delimiter', () => {
    let result = UBF.toArrayOfStrings(new String(',A,B b,C,'));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'B b', 'C', '']);
  });
  test('produce empty string at beginning of array', () => {
    let result = UBF.toArrayOfStrings('||X|Y|Z');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['', 'X', 'Y', 'Z']);
  });
  test('produce empty string in the middle of array', () => {
    let result = UBF.toArrayOfStrings('pepper');
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['e', '', 'er']);
  });
  test('produce strings from String', () => {
    let result = UBF.toArrayOfStrings(new String(',A,B,C'));
    expect(result).not.toBeNull();
    expect(result).toMatchObject(['A', 'B', 'C']);
    expect(result[1]).toBe('B');
    expect(typeof result[1]).toBe('string');
    expect(result[1]).not.toBe(new String('B'));
  });
});

describe('toArrayOfStrings throws errors', () => {
  test('given a number', () => {
    _expectError((() => UBF.toArrayOfStrings(3)), UtilValueError,
         /^UtilValueError: Value is not a string or array:\n/);
  });
  test('given a data object', () => {
    _expectError((() => UBF.toArrayOfStrings({a: 'yes', b: 'no'})),
          UtilBasic.UtilValueError,
          /^UtilValueError: Value is not a string or array:\n/);
  });
  test('given no value', () => {
    _expectError((() => UBF.toArrayOfStrings()),
          UtilValueError,
          /^UtilValueError: Value is not a string or array:\n/);
  });
  test('given null value', () => {
    _expectError((() => UBF.toArrayOfStrings(null)),
          UtilValueError,
          /^UtilValueError: Value is not a string or array:\n/);
  });
  test('given a RegExp literal', () => {
    _expectError((() => UBF.toArrayOfStrings(/ababbabbb/)),
          UtilValueError,
          /^UtilValueError: Value is not a string or array:\n/);
  });
  test('given a data object', () => {
    _expectError((() => UBF.toArrayOfStrings({a: 'yes', b: 'no'})),
          UtilValueError,
          /^UtilValueError: Value is not a string or array:\n/);
  });
  test('given an array with a number', () => {
    _expectError((() => UBF.toArrayOfStrings(['A', 3, 'B'])),
          UtilValueError,
          /^UtilValueError: Array has an item that is not a string:\n/);
  });
  test('given an array with an undefined item', () => {
    let undef = undefined;
    let array = ['A', undef,'B'];
    _expectError((() => UBF.toArrayOfStrings(array)),
          UtilValueError,
          /^UtilValueError: Array has an item that is not a string:\n/);
  });
  test('given an array with a null item', () => {
    let nullItem = null;
    let array = ['A', nullItem,'B'];
    _expectError((() => UBF.toArrayOfStrings(array)),
          UtilValueError,
          /^UtilValueError: Array has an item that is not a string:\n/);
  });
  test('given an array with a plain data object', () => {
    let objectItem = {a: 'here', b: 'there'};
    let array = ['A', objectItem,'B'];
    _expectError((() => UBF.toArrayOfStrings(array)),
          UtilValueError,
          /^UtilValueError: Array has an item that is not a string:\n/);
  });
});

describe('test getClassNameOf', () => {
  test('test with instances', () => {
    expect(UBF.getClassNameOf(3)).toBe('');
    expect(UBF.getClassNameOf( [] )).toBe('Array');
    expect(UBF.getClassNameOf( {} )).toBe('Object');
    expect(UBF.getClassNameOf( ({}) )).toBe('Object');
    expect(UBF.getClassNameOf( new Set() )).toBe('Set');
    expect(UBF.getClassNameOf( Date.now() )).toBe('');
    expect(UBF.getClassNameOf( new Date() )).toBe('Date');
    expect(UBF.getClassNameOf( Date )).toBe('');
    expect(UBF.getClassNameOf( String(5) )).toBe('');
    expect(UBF.getClassNameOf( new String(5) )).toBe('String');
    expect(UBF.getClassNameOf( String )).toBe('');
    expect(UBF.getClassNameOf( new UtilBasic.UtilValueError ))
          .toBe('UtilValueError');
  });
});

describe('test getKeys', () => {
  test('test getKeys with primitives', () => {
    expect(UBF.getKeys(3)).toEqual([]);
    expect(UBF.getKeys('abc')).toEqual(['0', '1', '2']);
    expect(UBF.getKeys([][0])).toEqual([]);
    expect(UBF.getKeys(null)).toEqual([]);
    expect(UBF.getKeys(true)).toEqual([]);
  });
  test('test getKeys with arrays', () => {
    expect(UBF.getKeys([])).toEqual([]);
    expect(UBF.getKeys([1, 5, 24])).toEqual(['0', '1', '2']);
    let a = [7, 27, 12, -1];
    a[9] = 23;
    expect(UBF.getKeys(a)).toEqual(['0', '1', '2', '3', '9']);
    a.sort();
    expect(UBF.getKeys(a)).toEqual(['0', '1', '2', '3', '4']);
    let b = [29, 8];
    b.hi = 67;
    b['bag'] = 37;
    b.push(24);
    expect(UBF.getKeys(a)).toEqual(['0', '1', '2', '3', '4']);
    expect(b[2]).toBe(24);
    expect(b[3]).toBe(undefined);
    expect(b[4]).toBe(undefined);
    expect(b.length).toBe(3);
  });
  test('test getKeys with data objects', () => {
    expect(UBF.getKeys({})).toEqual([]);
    expect(UBF.getKeys({a: 5, f: 'abc'})).toEqual(['a', 'f']);
    expect(UBF.getKeys({f: 'abc', a: 5})).toEqual(['f', 'a']);
    let a = {};
    a['z a b'] = 'baz';
    a['q'] = 'q';
    a['d f m'] = 'dfm';
    expect(UBF.getKeys(a)).toEqual(['z a b', 'q', 'd f m']);
    let b = {'15': 15, '1': 1, '2': 2}
    expect(UBF.getKeys(b)).toEqual(['1', '2', '15']);
    let c = {'15': 15, '1': 1, '2': 2, '-3': -3}
    expect(UBF.getKeys(c)).toEqual(['1', '2', '15', '-3']);
    let d = {'15': 15, '1': 1, '2': 2, '-3': -3, '-.4': -.44}
    expect(UBF.getKeys(d)).toEqual(['1', '2', '15', '-3', '-.4']);
    let e = {'15': 15, '1': 1, '##': '###', '2': 2, '-3': -3}
    expect(UBF.getKeys(e)).toEqual(['1', '2', '15', '##', '-3']);
  });
  test('test getKeys with other objects', () => {
    expect(UBF.getKeys(Math)).toEqual([]);
    expect(UBF.getKeys(Date)).toEqual([]);
    expect(UBF.getKeys(String)).toEqual([]);
    expect(UBF.getKeys(Number)).toEqual([]);
    expect(UBF.getKeys(Array)).toEqual([]);
    expect(UBF.getKeys(Date.now())).toEqual([]);
    expect(UBF.getKeys(new Date())).toEqual([]);
    expect(UBF.getKeys(new Set([5, true]))).toEqual([]);
    expect(typeof UtilBasic.UtilBaseError).toBe('function');
    expect(UBF.getKeys(UtilBasic.UtilBaseError))
          .toEqual(['stackTraceLimit', 'prepareStackTrace']);
    expect(UBF.getKeys(UtilBasic.UtilValueError))
          .toEqual(['stackTraceLimit', 'prepareStackTrace']);
    expect(UBF.getKeys(new UtilBasic.UtilBaseError('smash')))
          .toEqual([
          "otherValues", "priorError", "priorErrorDescription", "name"]);
    expect(UBF.getKeys(new UtilBasic.UtilValueError('smash')))
          .toEqual([
          "otherValues", "priorError", "priorErrorDescription", "name"]);
  });
});

describe('test getSortedKeys', () => {
  test('test getSortedKeys with primitives', () => {
    expect(UBF.getSortedKeys(3)).toEqual([]);
    expect(UBF.getSortedKeys('abc')).toEqual(['0', '1', '2']);
    expect(UBF.getSortedKeys([][0])).toEqual([]);
    expect(UBF.getSortedKeys(null)).toEqual([]);
    expect(UBF.getSortedKeys(true)).toEqual([]);
  });
  test('test getSortedKeys with arrays', () => {
    expect(UBF.getSortedKeys([])).toEqual([]);
    expect(UBF.getSortedKeys([1, 5, 24])).toEqual(['0', '1', '2']);
    let a = [7, 27, 12, -1];
    a[9] = 23;
    expect(UBF.getSortedKeys(a)).toEqual(['0', '1', '2', '3', '9']);
    a.sort();
    expect(UBF.getSortedKeys(a)).toEqual(['0', '1', '2', '3', '4']);
  });
  test('test getSortedKeys with data objects', () => {
    expect(UBF.getSortedKeys({})).toEqual([]);
    expect(UBF.getSortedKeys({a: 5, f: 'abc'})).toEqual(['a', 'f']);
    expect(UBF.getSortedKeys({f: 'abc', a: 5})).toEqual(['a', 'f']);
    let a = {};
    a['z a b'] = 'baz';
    a['q'] = 'q';
    a['d f m'] = 'dfm';
    expect(UBF.getSortedKeys(a)).toEqual(['d f m', 'q', 'z a b']);
    let b = {'15': 15, '1': 1, '2': 2}
    expect(UBF.getSortedKeys(b)).toEqual(['1', '2', '15']);
    let c = {'15': 15, '1': 1, '2': 2, '-3': -3}
    expect(UBF.getSortedKeys(c)).toEqual(['-3', '1', '2', '15']);
    let d = {'15': 15, '1': 1, '2': 2, '-3': -3, '-.4': -.44}
    expect(UBF.getSortedKeys(d)).toEqual(['-3', '1', '2', '15', '-.4']);
    let e = {'15': 15, '1': 1, '##': '###', '2': 2, '-3': -3}
    expect(UBF.getSortedKeys(e)).toEqual(['-3', '1', '2', '15', '##']);
  });
  test('test getSortedKeys with other objects', () => {
    expect(UBF.getSortedKeys(Math)).toEqual([]);
    expect(UBF.getSortedKeys(Date)).toEqual([]);
    expect(UBF.getSortedKeys(String)).toEqual([]);
    expect(UBF.getSortedKeys(Number)).toEqual([]);
    expect(UBF.getSortedKeys(Array)).toEqual([]);
    expect(UBF.getSortedKeys(Date.now())).toEqual([]);
    expect(UBF.getSortedKeys(new Date())).toEqual([]);
    expect(UBF.getSortedKeys(new Set([5, true]))).toEqual([]);
    expect(typeof UtilBasic.UtilBaseError).toBe('function');
    expect(UBF.getSortedKeys(UtilBasic.UtilBaseError))
          .toEqual(['prepareStackTrace', 'stackTraceLimit']);
    expect(UBF.getSortedKeys(UtilBasic.UtilValueError))
          .toEqual(['prepareStackTrace', 'stackTraceLimit']);
    expect(UBF.getSortedKeys(new UtilBasic.UtilBaseError('smash')))
          .toEqual([
          "name", "otherValues", "priorError", "priorErrorDescription"]);
    expect(UBF.getSortedKeys(new UtilBasic.UtilValueError('smash')))
          .toEqual([
          "name", "otherValues", "priorError", "priorErrorDescription"]);
  });
});

describe('test Show', () => {
  test('test show primitives', () => {
    expect(UBF.show(3)).toBe('3');
    expect(UBF.show(-17)).toBe('-17');
    expect(UBF.show(Infinity)).toBe('Infinity');
    expect(UBF.show(NaN)).toBe('NaN');
    expect(UBF.show(true)).toBe('true');
    expect(UBF.show(false)).toBe('false');
    expect(UBF.show(null)).toBe('null');
    expect(UBF.show((x=>x)())).toBe('undefined');
    expect(UBF.show('')).toBe('""');
    expect(UBF.show('abc')).toBe('"abc"');
    expect(UBF.show('"\n\""')).toBe('"\\"\\n\\"\\""');
    expect(UBF.show('"\n\""'.length)).toBe('4');
    expect(UBF.show('"\n\""').length).toBe(10);
  });
  test('test show arrays', () => {
    expect(UBF.show([])).toBe('[]');
    expect(UBF.show([3,7,    19])).toBe('[3, 7, 19]');
    let a = [9, 3, 7];
    a[7] = 19;
    expect(UBF.show(a)).toBe('[9, 3, 7, <skip 4>, 19]');
    let b = [3, 29, 17];
    b['xyz'] = 'quut';
    expect(UBF.show(b)).toBe('[3, 29, 17]');
  });
  test('test show objects', () => {
    expect(UBF.show({})).toBe('{}');
    expect(UBF.show({s: 9, k: 3})).toBe('{"k": 3, "s": 9}');
    expect(UBF.show({t: 'tug', g: [5, 2], m: {d: 9, 'z': 7}}))
          .toBe('{"g": [5, 2], "m": {"d": 9, "z": 7}, "t": "tug"}');
    expect(UBF.show({'3': 33, g: [5, 2], '-4': {d: 9, '2': 7}, '-.3': -.33}))
          .toBe(
          '{"-4": {"2": 7, "d": 9}, "3": 33, "-.3": -0.33, "g": [5, 2]}');
  });
  test('test show sets', () => {
    expect(UBF.show(new Set())).toBe('@Set:[]');
    expect(UBF.show(new Set([19,3,7]))).toBe('@Set:[19, 3, 7]');
  });
});

describe('setUnion', () => {
  test('union with arrays', () => {
    expect(UBF.setUnion([1, 3], [3, 7])).toMatchObject(new Set([1, 3, 7]));
    expect(UBF.setUnion([9, 3, 1, 3], [7, 3, 7, 4]))
          .toMatchObject(new Set([7, 3, 9, 4, 1]));
    expect(UBF.setUnion([9, 3, 1, 3], [7, 3, 7, 4]))
          .toMatchObject(new Set([7, 3, 9, 4, 1]));
    expect(Array.from(UBF.setUnion([9, 3, 1, 3], [7, 3, 7, 4])))
          .not.toMatchObject([7, 3, 9, 4, 1]);
    expect(Array.from(UBF.setUnion([9, 3, 1, 3], [7, 3, 7, 4])))
          .toMatchObject([9, 3, 1, 7, 4]);
  });
  test('union with sets', () => {
    expect(UBF.setUnion(new Set([1, 3]), new Set([3, 7])))
          .toMatchObject(new Set([1, 3, 7]));
    expect(UBF.setUnion(new Set([9, 3, 1, 3]), new Set([7, 3, 7, 4])))
          .toMatchObject(new Set([7, 3, 9, 4, 1]));
    expect(UBF.setUnion(new Set([9, 3, 1, 3]), new Set([7, 3, 7, 4])))
          .toMatchObject(new Set([7, 3, 9, 4, 1]));
    expect(Array.from(UBF.setUnion(new Set([9, 3, 1, 3]),
          new Set([7, 3, 7, 4]))))
          .toMatchObject(new Set([7, 3, 9, 4, 1]));
    expect(Array.from(UBF.setUnion(new Set([9, 3, 1, 3]),
          new Set([7, 3, 7, 4]))))
          .toMatchObject(new Set([9, 3, 1, 7, 4]));
  });
});

describe('setIntersection', () => {
  test('intersection with arrays', () => {
    expect(UBF.setIntersection([1, 3], [3, 7])).toMatchObject(new Set([3]));
    expect(UBF.setIntersection([9, 3, 4, 3], [7, 3, 7, 4]))
          .toMatchObject(new Set([3, 4]));
    expect(UBF.setIntersection([9, 3, 7, 3], [7, 3, 7, 4]))
          .toMatchObject(new Set([7, 3]));
    expect(Array.from(UBF.setIntersection([9, 3, 7, 3], [7, 3, 7, 4])))
          .not.toMatchObject([7, 3]);
    expect(Array.from(UBF.setIntersection([9, 3, 7, 3], [7, 3, 7, 4])))
          .toMatchObject([3, 7]);
  });
  test('intersection with sets', () => {
    expect(UBF.setIntersection(new Set([1, 3]), new Set([3, 7])))
          .toMatchObject(new Set([3]));
    expect(UBF.setIntersection(new Set([9, 3, 1, 3]), new Set([7, 3, 7, 4])))
          .toMatchObject(new Set([3]));
    expect(UBF.setIntersection(new Set([9, 3, 4, 3]), new Set([7, 3, 7, 4])))
          .toMatchObject(new Set([3, 4]));
    expect(Array.from(UBF.setIntersection(new Set([9, 3, 7, 3]),
          new Set([7, 3, 7, 4]))))
          .toMatchObject(new Set([7, 3]));
    expect(Array.from(UBF.setIntersection(new Set([9, 3, 4, 3]),
          new Set([7, 3, 7, 4]))))
          .toMatchObject(new Set([4, 3]));
  });
});

describe('setDifference', () => {
  test('difference with arrays', () => {
    expect(UBF.setDifference([1, 3], [3, 7])).toMatchObject(new Set([1]));
    expect(UBF.setDifference([9, 3, 4, 3], [7, 3, 7, 4]))
          .toMatchObject(new Set([9]));
    expect(UBF.setDifference([9, 3, 7, 8], [7, 3, 7, 4]))
          .toMatchObject(new Set([9, 8]));
    expect(Array.from(UBF.setDifference([9, 3, 7, 1], [7, 3, 7, 4])))
          .not.toMatchObject([1, 9]);
    expect(Array.from(UBF.setDifference([9, 3, 7, 1], [7, 3, 7, 4])))
          .toMatchObject([9, 1]);
  });
  test('difference with sets', () => {
    expect(UBF.setDifference(new Set([1, 3]), new Set([3, 7])))
          .toMatchObject(new Set([1]));
    expect(UBF.setDifference(new Set([9, 3, 1, 3]), new Set([7, 3, 7, 4])))
          .toMatchObject(new Set([9, 1]));
    expect(UBF.setDifference(new Set([9, 3, 4, 3]), new Set([7, 3, 7, 4])))
          .toMatchObject(new Set([9]));
    expect(Array.from(UBF.setDifference(new Set([9, 3, 7, 5]),
          new Set([7, 3, 7, 4]))))
          .toMatchObject(new Set([9, 5]));
    expect(Array.from(UBF.setDifference(new Set([9, 3, 4, 5]),
          new Set([7, 3, 7, 4]))))
          .toMatchObject(new Set([9, 5]));
  });
});

describe('get object property names, values, and items', () => {
  let tcase = {};
  beforeAll(() => {
    tcase[1] = {a:1, b:3};
    let a = Object.create({x: 27, y: 29});
    a['c'] = 13;
    a['d'] = 17;
    a['x'] = 16;
    tcase[2] = a;
  });
  test('get names', () => {
    expect(UBF.getNames(tcase[1])).toMatchObject(['a', 'b']);
    expect(UBF.getNames(tcase[2])).toMatchObject(['c', 'd', 'x', 'y']);
  });
  test('get own names', () => {
    expect(UBF.getOwnNames(tcase[1])).toMatchObject(['a', 'b']);
    expect(UBF.getOwnNames(tcase[2])).toMatchObject(['c', 'd', 'x']);
  });
  test('get items', () => {
    expect(UBF.getItems(tcase[1])).toMatchObject([
      {name: 'a', value: 1}, {name: 'b', value: 3}]);
    expect(UBF.getItems(tcase[2])).toMatchObject([
      {name: 'c', value: 13}, {name: 'd', value: 17},
      {name: 'x', value: 16}, {name: 'y', value: 29}]);
  });
  test('get own items', () => {
    expect(UBF.getOwnItems(tcase[1])).toMatchObject([
      {name: 'a', value: 1}, {name: 'b', value: 3}]);
    expect(UBF.getOwnItems(tcase[2])).toMatchObject([
      {name: 'c', value: 13}, {name: 'd', value: 17},
      {name: 'x', value: 16}]);
  });
});




