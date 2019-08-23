/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Decimal9UnitTest
 * @summary Unit tests Decimal9 module components
 */

import * as Decimal9 from '../../src/decimal9.js';
import BigInt from 'big-integer';
import {_getError} from '../_test_aids.js';

const ONECK = 1000000000;
const D9 = Decimal9.Decimal9;
const D9TOTAL = Decimal9.Decimal9Total;

// TODO: make sure all functions are tested, for example isSafe(), ulp().
// TODO: do more testing at / near boundaries for safe integers.

function test_compare(x, y, comparison) {
  //"""Test all order comparisons for a pair of values"""
  expect(x.isLess(y)).toBe(comparison < 0);
  expect(x.isLessEqual(y)).toBe(comparison <= 0);
  expect(x.isEqual(y)).toBe(comparison == 0);
  expect(x.isNotEqual(y)).toBe(comparison != 0);
  expect(x.isGreaterEqual(y)).toBe(comparison >= 0);
  expect(x.isGreater(y)).toBe(comparison > 0);
}

describe('create with integer values', () => {
  test('create default zero', () => {
    expect(new D9()._getValue()).toBe(0);
  });

  test('create explicit zero', () => {
    expect(new D9(0)._getValue()).toBe(0);
  });

  test('create one', () => {
    expect(new D9(1)._getValue()).toBe(1 * ONECK);
  });

  test('create other simple integer values', () => {
    expect(new D9(2)._getValue()).toBe(2 * ONECK);
    expect(new D9(-1)._getValue()).toBe(-1 * ONECK);
    expect(new D9(10)._getValue()).toBe(10 * ONECK);
    expect(new D9(123)._getValue()).toBe(123 * ONECK);
  });

  test('create simpleone', () => {
    expect(new D9(1)._getValue()).toBe(1 * ONECK);
  });
});

describe('create values using exponents', () => {
  test('create nine', () => {
    expect(new D9(9, 0)._getValue()).toBe(9 * ONECK);
  });

  test('create fractions', () => {
    expect(new D9(11, -5)._getValue()).toBe(110000);
    expect(new D9(7, -3)._getValue()).toBe(7000000);
    expect(new D9(-7, -9)._getValue()).toBe(-7);
  });
});

describe('create other values', () => {
  test('create other values', () => {
    expect(new D9(9, 0)._getValue()).toBe(9 * ONECK);
    expect(new D9(1000000000, -9)._getValue()).toBe(1 * ONECK);
    expect(new D9(98765, -7)._getValue()).toBe(9876500);
    expect(new D9(-98765, -7)._getValue()).toBe(-9876500);
    expect(new D9(65432, -7)._getValue()).toBe(6543200);
    expect(new D9(-65432, -7)._getValue()).toBe(-6543200);
    // TODO: In Python, the following case and some other cases round or
    // truncate depending on the class of value argument, treating float and
    // int values differently.  As substitute, js checks whether the truncate
    // value is equal to itself.
    expect(new D9(98765, -11)._getValue()).toBe(987);
    expect(new D9(-98765, -11)._getValue()).toBe(-987);
    expect(new D9(65432, -11)._getValue()).toBe(654);
    expect(new D9(-65432, -11)._getValue()).toBe(-654);
    expect(new D9(721, 2)._getValue()).toBe(72100000000000);
    expect(new D9(-721, 2)._getValue()).toBe(-72100000000000);
    expect(new D9(-123, 2.4)._getValue()).toBe(-12300 * ONECK);
    expect(new D9(-123, 2.6)._getValue()).toBe(-123000 * ONECK);
  });
});


describe('create many-digit values', () => {
  test('create other values', () => {
    expect(new D9(987654321987654321)._getValue()).toBe(
          987654321987654321 * ONECK);
    expect(new D9(-987654321987654321)._getValue()).toBe(
          -987654321987654321 * ONECK);
    expect(new D9(987654321987654321, -2)._getValue()).toBe(
          9876543219876543210000000);
    expect(new D9(-987654321987654321, -2)._getValue()).toBe(
          -9876543219876543210000000);
    expect(new D9(987654321987654321, -5)._getValue()).toBe(
          9876543219876543210000);
    expect(new D9(-987654321987654321, -5)._getValue()).toBe(
          -9876543219876543210000);
    expect(new D9(987654321987654321, -7)._getValue()).toBe(
          98765432198765432100);
    expect(new D9(-987654321987654321, -7)._getValue()).toBe(
          -98765432198765432100);
    // TODO: Result is not a safe integer.  With BigInt should end with 43
    expect(new D9(987654321987654321, -11)._getValue()).toBe(
          9876543219876542);
    // TODO: Result is not a safe integer.  With BigInt should end with 43
    expect(new D9(-987654321987654321, -11)._getValue()).toBe(
          -9876543219876542);
  });
});

describe('create with float values', () => {
  test('create float values', () => {
    expect(new D9(1.7,)._getValue()).toBe( 1700000000);
    expect(new D9(1.2345678)._getValue()).toBe( 1234567800);
    expect(new D9(-0.00237)._getValue()).toBe( -2370000);
    expect(new D9(9876.54321987654321)._getValue()).toBe(9876543219877);
    expect(new D9(98765.4321987654321)._getValue()).toBe(98765432198765);
  });
});

describe('create with other values', () => {
  test('create with Decimal9 values', () => {
    const three = new D9(3);
    expect(new D9(three, 0)._getValue()).toBe( 3000000000);
    expect(new D9(three, 1)._getValue()).toBe(30000000000);
    expect(new D9(three, -1)._getValue()).toBe( 300000000);
  });
  test('create with Number values', () => {
    const three = new Number(3);
    expect(new D9(three, 0)._getValue()).toBe( 3000000000);
    expect(new D9(three, 1)._getValue()).toBe(30000000000);
    expect(new D9(three, -1)._getValue()).toBe( 300000000);
  });
  test.each([
    [3, 0, 3e9],
    [3, 1, 3e10],
    [3, -1, 3e8],
  ])('create as Number(%i) * 10^%i',
    (value, exponent, expected) => {
      const asNumber = new Number(value);
      expect(new D9(asNumber, exponent)._getValue()).toBe(expected);
  });
});

describe('create with invalid types', () => {
  test('create with string', () => {
    let err = _getError(() => new D9('2.8'));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: Value is not a supported type:\n/);
    //expect(new D9('2.8')._getValue()).toThrow(Decimal9.Decimal9Error)
    //      .toThrow(/^Value is not a supported type:\n/);
  });
  test('create with array', () => {
    let err = _getError(() => new D9([-3.9]));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: Value is not a supported type:\n/);
  });
  test('create with invalid exponent of 10', () => {
    let err = _getError(() => new D9(3, {}));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: exponentOf10 is not a supported value:\n/);
  });
});

describe('decimal9.toString()', () => {
  test('simple values with .toString()', () => {
    expect(new D9().toString()).toBe('0.0');
    expect(new D9(1).toString()).toBe('1.0');
    expect(new D9(-21).toString()).toBe('-21.0');
    expect(new D9(1, -5).toString()).toBe('0.00001');
    expect(new D9(-1, -5).toString()).toBe('-0.00001');
    expect(new D9(238, -4).toString()).toBe('0.0238');
    expect(new D9(238, -2).toString()).toBe('2.38');
  });
  test('not safe integers with toString()', () => {
    // TODO: The next several test cases use input that is not a safe integer,
    // and accuracy is lost as a result. BigInt would be more accurate.
    expect(new D9(987654321987654321).toString()).toBe(
          '987654321987654258.182324224');
          //'987654321987654300.0');
          //'987654321987654272.0');
          //'987654321987654321.0');
    expect(new D9(-987654321987654321).toString()).toBe(
          '-987654321987654258.182324224');
          //'-987654321987654300.0');
          //'-987654321987654272.0');
          //'-987654321987654321.0');
    expect(new D9(987654321987654321, -5).toString()).toBe(
          '9876543219876.543594496');
          //'9876543219876.54272');
          //'9876543219876.543162368');
          //'9876543219876.54321');
    expect(new D9(-987654321987654321, -5).toString()).toBe(
          '-9876543219876.543594496');
          //'-9876543219876.54272');
          //'-9876543219876.543162368');
          //'-9876543219876.54321');
    expect(new D9(-987654321987654321, -11).toString()).toBe(
          '-9876543.219876542');
          //'-9876543.219876543');
  });
});

describe('decimal9.toNumber()', () => {
  test('simple values with .toNumber()', () => {
    expect(new D9().toNumber()).toBe(0);
    expect(new D9(345, -6).toNumber()).toBe(0.000345);
    expect(new D9(90000101).toNumber()).toBe(90000101);
  });
});

describe('decimal9.isSafe()', () => {
  test('simple isSafe()', () => {
    expect(new D9(90001, 2).isSafe()).toBe(true);
    expect(new D9(90001.01, 2).isSafe()).toBe(false);
    expect(new D9(-9000100).isSafe()).toBe(true);
    expect(new D9(-9000101).isSafe()).toBe(false);
    expect(new D9(9000100).plus(new D9(1, -9)).isSafe()).toBe(false);
    expect(new D9(-9000100).minus(new D9(1, -9)).isSafe()).toBe(false);
  });
});

describe('critical failures near Number.MAX_SAFE_INTEGER', () => {
  /*
  IEEE 754 double precision (64 bit) floating point numbers can
  exactly represent all integers between 0 and
  9,007,199,254,740,992.  The following tests demonstrate that this
  is also approximately where the precision of Javascript's conversion
  of floats to and from strings of floats with 9 decimals of
  precision begins to break down.  As a result, this is also where
  the precision of conversion of Decimal9 values to and from JSON
  numeric values and to and from JavaScript Number's begins to fail.
  */
  test('Confirm Decimal9 boundaries for safe integers', () => {
    expect(Decimal9.Decimal9.MAX_SAFE_VALUE).toBe(9000100);
    expect(Decimal9.Decimal9.MIN_SAFE_VALUE).toBe(-9000100);
    expect(Decimal9.Decimal9.MAX_SAFE_INTEGER).toBe(9000100000000000);
    expect(Decimal9.Decimal9.MIN_SAFE_INTEGER).toBe(-9000100000000000);
  });
  test('Confirm Javascript limits for safe integers', () => {
    expect(Number.MAX_SAFE_INTEGER).not.toBe(9007199254740990);
    expect(Number.MAX_SAFE_INTEGER).not.toBe(9007199254740992);
    expect(Number.MAX_SAFE_INTEGER.toString()).toBe('9007199254740991');
    expect(Number.MIN_SAFE_INTEGER.toString()).toBe('-9007199254740991');
  });
  test('Show anomalies for Javascript boundaries for safe integers', () => {
    expect(9007199.254740981.toString()).toBe('9007199.254740981');
    expect(9007199.254740983.toString()).toBe('9007199.254740983');
    expect(9007199.254740985.toString()).toBe('9007199.254740985');
    expect(9007199.254740987.toString()).toBe('9007199.254740987');
    expect(9007199.254740989.toString()).toBe('9007199.254740989');
    expect(9007199.254740989.toFixed(9)).toBe('9007199.254740989');
    expect(9007199.254740990.toString()).toBe('9007199.25474099');
    expect(9007199.254740990.toFixed(9)).toBe('9007199.254740991');
    expect(9007199.254740990.toFixed(9)).not.toBe('9007199.254740990');
    expect(9007199.254740991.toString()).not.toBe('9007199.254740991');
    expect(9007199.254740991.toString()).toBe('9007199.25474099');
    expect(9007199.254740993.toString()).toBe('9007199.254740993');
    expect(9007199.254740995.toString()).toBe('9007199.254740994');
    expect(9007199.254740995.toString()).not.toBe('9007199.254740995');
    expect(Number('9007199.254740993').toString()).toBe('9007199.254740993');
    expect(Number('9007199.254740995').toString()).toBe('9007199.254740994');
    expect(Number('9007199.254740995').toString())
          .not.toBe('9007199.254740995');
    expect(Number('9007199.254740995')).toBe(Number('9007199.254740994'));
    expect(9007199254740993.0.toString()).toBe('9007199254740992');
  });
  test('Conversions with Decimal9, Number, and strings near boundary', () => {
    expect(new D9(9007199.254740991).toString()).toBe('9007199.254740991');
    expect(new D9(9007199254740991, -9).toString()).toBe('9007199.254740991');
    expect(Number(new D9(9007199254740989, -9).toString())).toBe(
          9007199.254740989);
    expect(Number(new D9(9007199254740989, -9).toString()).toString()).toBe(
          '9007199.254740989');
    expect(Number(new D9(9007199254740991, -9).toString())).toBe(
          9007199.254740991);
    expect(Number(new D9(9007199254740991, -9).toString()).toString()).toBe(
          '9007199.25474099');
    expect(Number(new D9(9007199254740991, -9).toString()).toString())
          .not.toBe('9007199.254740991');
    expect(new D9(Number('9007199.254740991')).toString()).toBe(
          '9007199.254740991');
    expect(new D9(Number('9007199.254740993')).toString()).toBe(
          '9007199.254740992');
    expect(new D9(Number('9007199.254740993')).toString()).not.toBe(
          '9007199.254740993');
  });
});

describe('equality and order comparisons', () => {
  /**/
  test('simple comparisons between Decimal9 values', () => {
    test_compare(new D9(), new D9(), 0);
    test_compare(new D9(), new D9(0), 0)
    test_compare(new D9(-1), new D9(-1), 0)
    test_compare(new D9(-3), new D9(-2), -1)
    test_compare(new D9(798, -9), new D9(7987, -10), 0)
    test_compare(new D9(798, -5), new D9(7987, -6), -1)
    test_compare(new D9(12) , new D9(2), 1)
    test_compare(new D9(122), new D9(29), 1)
    expect(new D9().isEqual(null)).toBe(false);
  });
  /**/
  test('invalid equality and order comparisons', () => {
    let err = _getError(() => new D9().isEqual([0,0]));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: Value is not an instance of the required type:\n/);
    err = _getError(() => new D9(1).isLess(7));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: Value is not an instance of the required type:\n/);
  });
});

describe('additive operations', () => {
  test('plus()', () => {
    expect(new D9(3).plus(new D9(4))._getValue()).toBe(7000000000);
    expect(new D9(3).plus(new D9(9))).toMatchObject(new D9(12));
    expect(new D9(314159, -5).plus(new D9(314159, -5)))
          .toMatchObject(new D9(628318, -5));
    expect(new D9(314159, -5).plus(new D9(-314159, -5)))
          .toMatchObject(new D9());
  });
  test('minus()', () => {
    expect(new D9(3).minus(new D9(4))._getValue()).toBe(-1000000000);
    expect(new D9(3).minus(new D9(9))).toMatchObject(new D9(-6));
    expect(new D9(314159, -5).minus(new D9(-314159, -5)))
          .toMatchObject(new D9(628318, -5));
    expect(new D9(314159265358, -11).minus(new D9(-314159265358, -11)))
          .toMatchObject(new D9(6283185306, -9));
    expect(new D9(314159265358, -11).minus(new D9(314159265363, -11)))
          .toMatchObject(new D9());
  });
  test('negative()', () => {
    expect(new D9(3).negative()._getValue()).toBe(-3000000000);
    expect(new D9(-3).negative()).toMatchObject(new D9(3));
    expect(new D9(314159265358, -5).negative())
          .toMatchObject(new D9(-314159265358, -5));
    expect(new D9().negative().isEqual(new D9())).toBe(true);
  });
});

describe('times operations', () => {
  test('simple times()', () => {
    expect(new D9(3).times(new D9(4))._getValue()).toBe(12000000000);
    expect(new D9(3).times(new D9(-9))).toMatchObject(new D9(-27));
    expect(new D9(-314159, -5).times(new D9(-314159, -5)))
          .toMatchObject(new D9(9869587728, -9));
    expect(new D9(-3141592653, -9).times(new D9(-3141592653, -9)))
          .toMatchObject(new D9(9869604397, -9));
    expect(new D9(3).times(4)._getValue()).toBe(12000000000);
    expect(new D9(3).times(-9)).toMatchObject(new D9(-27));
  });
  test('advanced times()', () => {
    let twoThirds = new D9(2).divideBy(new D9(3));
    expect(twoThirds).toMatchObject(new D9(666666666, -9));
    expect(twoThirds.times(twoThirds)).toMatchObject(new D9(444444443, -9));
    expect(twoThirds.times(twoThirds.negative()))
          .toMatchObject(new D9(-444444443, -9));
    expect(twoThirds.times(twoThirds, 'away'))
          .toMatchObject(new D9(444444444, -9));
    expect(twoThirds.times(-twoThirds, 'away'))
          .toMatchObject(new D9(-444444444, -9));
    expect(twoThirds.times(2)).toMatchObject(new D9(1333333332, -9));
    expect(twoThirds.times(2, 'away')).toMatchObject(new D9(1333333332, -9));
    expect(twoThirds.times(-2)).toMatchObject(new D9(-1333333332, -9));
    expect(twoThirds.times(-2, 'away')).toMatchObject(new D9(-1333333332, -9));
    let eightNinths = new D9(8).divideBy(new D9(9));
    expect(eightNinths).toMatchObject(new D9(888888888, -9));
    expect(eightNinths.times(eightNinths))
          .toMatchObject(new D9(790123455, -9));
  });
});

// TODO: Test rounding between near zero, between -1 and 1,
//   and near the boundaries for safe integers.
describe('rounding', () => {
  let exact = new D9(200, -9);
  let lowlow = new D9(201, -9);
  let low = new D9(222, -9);
  let midlow = new D9(249, -9);
  let mid = new D9(250, -9);
  let midhigh = new D9(251, -9);
  let high = new D9(277, -9);
  let highhigh = new D9(299, -9);
  let exact2 = new D9(300, -9);
  let mid2 = new D9(350, -9);
  let point01 = new D9(1, -2);
  test('default rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(point01)._getValue()).toBe(2);
    expect(lowlow.times(point01)._getValue()).toBe(2);
    expect(low.times(point01)._getValue()).toBe(2);
    expect(midlow.times(point01)._getValue()).toBe(2);
    expect(mid.times(point01)._getValue()).toBe(2);
    expect(midhigh.times(point01)._getValue()).toBe(2);
    expect(high.times(point01)._getValue()).toBe(2);
    expect(highhigh.times(point01)._getValue()).toBe(2);
    expect(exact2.times(point01)._getValue()).toBe(3);
    expect(mid2.times(point01)._getValue()).toBe(3);
  });
  test('explicit truncate rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(point01, 'truncate')._getValue()).toBe(2);
    expect(lowlow.times(point01, 'truncate')._getValue()).toBe(2);
    expect(low.times(point01, 'truncate')._getValue()).toBe(2);
    expect(midlow.times(point01, 'truncate')._getValue()).toBe(2);
    expect(mid.times(point01, 'truncate')._getValue()).toBe(2);
    expect(midhigh.times(point01, 'truncate')._getValue()).toBe(2);
    expect(high.times(point01, 'truncate')._getValue()).toBe(2);
    expect(highhigh.times(point01, 'truncate')._getValue()).toBe(2);
    expect(exact2.times(point01, 'truncate')._getValue()).toBe(3);
    expect(mid2.times(point01, 'truncate')._getValue()).toBe(3);
  });
  test('nearest rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(point01, 'nearest')._getValue()).toBe(2);
    expect(lowlow.times(point01, 'nearest')._getValue()).toBe(2);
    expect(low.times(point01, 'nearest')._getValue()).toBe(2);
    expect(midlow.times(point01, 'nearest')._getValue()).toBe(2);
    expect(mid.times(point01, 'nearest')._getValue()).toBe(2);
    expect(midhigh.times(point01, 'nearest')._getValue()).toBe(3);
    expect(high.times(point01, 'nearest')._getValue()).toBe(3);
    expect(highhigh.times(point01, 'nearest')._getValue()).toBe(3);
    expect(exact2.times(point01, 'nearest')._getValue()).toBe(3);
    expect(mid2.times(point01, 'nearest')._getValue()).toBe(4);
  });
  test('away rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(point01, 'away')._getValue()).toBe(2);
    expect(lowlow.times(point01, 'away')._getValue()).toBe(3);
    expect(low.times(point01, 'away')._getValue()).toBe(3);
    expect(midlow.times(point01, 'away')._getValue()).toBe(3);
    expect(mid.times(point01, 'away')._getValue()).toBe(3);
    expect(midhigh.times(point01, 'away')._getValue()).toBe(3);
    expect(high.times(point01, 'away')._getValue()).toBe(3);
    expect(highhigh.times(point01, 'away')._getValue()).toBe(3);
    expect(exact2.times(point01, 'away')._getValue()).toBe(3);
    expect(mid2.times(point01, 'away')._getValue()).toBe(4);
  });
  let negPoint01 = new D9(-1, -2);
  test('default rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(negPoint01)._getValue()).toBe(-2);
    expect(lowlow.times(negPoint01)._getValue()).toBe(-2);
    expect(low.times(negPoint01)._getValue()).toBe(-2);
    expect(midlow.times(negPoint01)._getValue()).toBe(-2);
    expect(mid.times(negPoint01)._getValue()).toBe(-2);
    expect(midhigh.times(negPoint01)._getValue()).toBe(-2);
    expect(high.times(negPoint01)._getValue()).toBe(-2);
    expect(highhigh.times(negPoint01)._getValue()).toBe(-2);
    expect(exact2.times(negPoint01)._getValue()).toBe(-3);
    expect(mid2.times(negPoint01)._getValue()).toBe(-3);
  });
  test('explicit truncate rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(lowlow.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(low.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(midlow.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(mid.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(midhigh.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(high.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(highhigh.times(negPoint01, 'truncate')._getValue()).toBe(-2);
    expect(exact2.times(negPoint01, 'truncate')._getValue()).toBe(-3);
    expect(mid2.times(negPoint01, 'truncate')._getValue()).toBe(-3);
  });
  test('nearest rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(negPoint01, 'nearest')._getValue()).toBe(-2);
    expect(lowlow.times(negPoint01, 'nearest')._getValue()).toBe(-2);
    expect(low.times(negPoint01, 'nearest')._getValue()).toBe(-2);
    expect(midlow.times(negPoint01, 'nearest')._getValue()).toBe(-2);
    expect(mid.times(negPoint01, 'nearest')._getValue()).toBe(-2);
    expect(midhigh.times(negPoint01, 'nearest')._getValue()).toBe(-3);
    expect(high.times(negPoint01, 'nearest')._getValue()).toBe(-3);
    expect(highhigh.times(negPoint01, 'nearest')._getValue()).toBe(-3);
    expect(exact2.times(negPoint01, 'nearest')._getValue()).toBe(-3);
    expect(mid2.times(negPoint01, 'nearest')._getValue()).toBe(-4);
  });
  test('away rounding', () => {
    expect(exact._getValue()).toBe(200);
    expect(exact2._getValue()).toBe(300);
    expect(exact.times(negPoint01, 'away')._getValue()).toBe(-2);
    expect(lowlow.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(low.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(midlow.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(mid.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(midhigh.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(high.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(highhigh.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(exact2.times(negPoint01, 'away')._getValue()).toBe(-3);
    expect(mid2.times(negPoint01, 'away')._getValue()).toBe(-4);
  });
});

describe('divideBy operations', () => {
  test('divideBy()', () => {
    /**/
    expect(new D9(24).divideBy(new D9(3))._getValue()).toBe(8000000000);
    expect(new D9(2).divideBy(new D9(3))).toMatchObject(new D9(666666666, -9));
    expect(new D9(-2).divideBy(new D9(3))).toMatchObject(
          new D9(-666666666, -9));
    expect(new D9(2).divideBy(new D9(-3))).toMatchObject(
          new D9(-666666666, -9));
    expect(new D9(-2).divideBy(new D9(-3))).toMatchObject(
          new D9(666666666, -9));
    expect(new D9(2) / 3).toBe(2/3);
    expect(new D9(2).divideBy(3)).toMatchObject(new D9(666666666, -9));
    expect(new D9(2).divideBy(3, 'away')).toMatchObject(new D9(666666667, -9));
    expect(new D9(2).divideBy(new D9(3), 'away')).toMatchObject(
          new D9(666666667, -9));
    expect(new D9(-2).divideBy(new D9(3), 'away')).toMatchObject(
          new D9(-666666667, -9));
    expect(new D9(-3141592653, -9).divideBy(new D9(-3141592653, -9)))
          .toMatchObject(new D9(1));
    expect(new D9(2).divideBy(new D9(-3)))
          .toMatchObject(new D9(-666666666, -9));
    expect(new D9(2).divideBy(new D9(-3), 'away')).toMatchObject(
          //new D9(-666666665, -9));
          new D9(-666666667, -9));
    let err = _getError(() => new D9(2).divideBy(new D9()));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: Divide by zero.$/);
    err = _getError(() => new D9(0).divideBy(new D9()));
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Decimal9.Decimal9Error);
    expect(err.toString()).toMatch(
      /^Decimal9Error: Divide by zero.$/);
    /**/
  });
});


describe('Decimal9Total creation', () => {
  test('the only kind of Decimal9Total creation', () => {
    /**/
    expect(new D9TOTAL()._getValue()).toBe(0);
  });
});

describe('Decimal9Total addition', () => {
  test('total accumulations with addition', () => {
    /**/
    expect(new D9TOTAL().plus(new D9(4))._getValue()).toBe(4000000000);
    let total = new D9TOTAL();
    total.plus(new D9(3)), total.plus(new D9(9));
    expect(total).toMatchObject(new D9(12));
    expect((total = new D9TOTAL(), total.plus(new D9(314159, -5)),
          total.plus(new D9(314159, -5)), total))
          .toMatchObject(new D9(628318, -5));
    expect((total = new D9TOTAL(), total.plus(new D9(314159, -5)),
          total.plus(new D9(-314159, -5)), total))
          .toMatchObject(new D9());
    expect((total = new D9TOTAL(), total.plus(new D9(3)),
          total.plus((new D9TOTAL().plus(new D9(-8))))))
          .toMatchObject(new D9(-5));
  });
});

describe('Decimal9Total subtraction', () => {
  test('total accumulations with subtraction', () => {
    /**/
    expect(new D9TOTAL().minus(new D9(4))._getValue()).toBe(-4000000000);
    let total = new D9TOTAL();
    total.plus(new D9(3)), total.minus(new D9(4));
    expect(total).toMatchObject(new D9(-1));
    expect((total = new D9TOTAL(), total.plus(new D9(4)),
          total.minus(new D9(3)), total))
          .toMatchObject(new D9(1));
    expect((total = new D9TOTAL(), total.plus(new D9(3)),
          total.minus(new D9(9)), total))
          .toMatchObject(new D9(-6));
    expect((total = new D9TOTAL(), total.plus(new D9(314159, -5)),
          total.minus(new D9(314159, -5)), total))
          .toMatchObject(new D9());
    expect((total = new D9TOTAL(), total.plus(new D9(3141592653, -9)),
          total.minus(new D9(3141592653, -9)), total))
          .toMatchObject(new D9());
    expect((total = new D9TOTAL(), total.plus(new D9(3)),
          total.minus(new D9(-8)), total))
          .toMatchObject(new D9(11));
    expect((total = new D9TOTAL(), total.minus(new D9(3)),
          total.minus(new D9(-8)), total))
          .toMatchObject(new D9(5));
  });
});

