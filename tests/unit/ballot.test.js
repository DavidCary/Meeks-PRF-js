/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module StatusUnitTest
 * @summary Unit tests Status class
 */

import K from '../../src/constants.js';
import {Ballot} from '../../src/ballot.js';

const D9 = K.Decimal;

describe('Ballot creation', () => {
  test('create a Ballot with default values', () => {
    let ballot1 = new Ballot();
    expect(ballot1).not.toBeNull();
    expect(ballot1._multiple).toBe(0);
    expect(ballot1._rankings).toMatchObject([]);
  });
  test('create a Ballot with non-default values', () => {
    let ballot1 = new Ballot(7, ['C', 'A', 'B']);
    expect(ballot1).not.toBeNull();
    expect(ballot1._multiple).toBe(7);
    expect(ballot1._rankings).toMatchObject(['C', 'A', 'B']);
  });
});

describe('Ballot getters', () => {
  test('get multiple', () => {
    let ballot1 = new Ballot();
    expect(ballot1).not.toBeNull();
    expect(ballot1.getMultiple()).toBe(0);
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot2).not.toBeNull();
    expect(ballot2.getMultiple()).toBe(17);
  });
  test('get rankings', () => {
    let ballot1 = new Ballot();
    expect(ballot1).not.toBeNull();
    expect(ballot1.getRankings()).toMatchObject([]);
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot2).not.toBeNull();
    expect(ballot2.getRankings()).toMatchObject(['C', '#', 'B']);
  });
});

describe('Ballot conversions', () => {
  test('valueOf()', () => {
    let ballot1 = new Ballot();
    expect(ballot1).not.toBeNull();
    expect(ballot1.valueOf()).toBe(
          '{multiple: 0, rankings: []}');
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot2).not.toBeNull();
    expect(ballot2.valueOf()).toBe(
          '{multiple: 17, rankings: ["C", "#", "B"]}');
  });
  test('toString()', () => {
    let ballot1 = new Ballot();
    expect(ballot1).not.toBeNull();
    expect(ballot1.toString()).toBe(
          '{multiple: 0, rankings: []}');
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot2).not.toBeNull();
    expect(ballot2.toString()).toBe(
          '{multiple: 17, rankings: ["C", "#", "B"]}');
  });
  test('asArray()', () => {
    let ballot1 = new Ballot();
    expect(ballot1).not.toBeNull();
    expect(ballot1.asArray()).toMatchObject([0, []]);
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot2).not.toBeNull();
    expect(ballot2.asArray()).toMatchObject(
          [17, ["C", "#", "B"]]);
  });
});


describe('Equality and inequalities', () => {
  test('default Ballots are equal', () => {
    let ballot1 = new Ballot();
    let ballot2 = new Ballot();
    expect(ballot1.isEqual(ballot2)).toBe(true);
    expect(ballot1.isNotEqual(ballot2)).toBe(false);
  });
  test('non-default Ballots are equal', () => {
    let ballot1 = new Ballot(17, ['C', '#', 'B']);
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot1.isEqual(ballot2)).toBe(true);
    expect(ballot1.isNotEqual(ballot2)).toBe(false);
  });
  test('different multiples make Ballots not equal', () => {
    let ballot1 = new Ballot(17, ['C', '#', 'B']);
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot1.isEqual(ballot2)).toBe(true);
    expect(ballot1.isNotEqual(ballot2)).toBe(false);
    ballot2._multiple = 17;
    expect(ballot1.isEqual(ballot2)).toBe(true);
    expect(ballot1.isNotEqual(ballot2)).toBe(false);
    ballot2._multiple = 23;
    expect(ballot1.isEqual(ballot2)).toBe(false);
    expect(ballot1.isNotEqual(ballot2)).toBe(true);
  });
  test('different rankings make Ballots not equal', () => {
    let ballot1 = new Ballot(17, ['C', '#', 'B']);
    let ballot2 = new Ballot(17, ['C', '#', 'B']);
    expect(ballot1.isEqual(ballot2)).toBe(true);
    expect(ballot1.isNotEqual(ballot2)).toBe(false);
    ballot2._rankings = ['C', '#', 'B'];
    expect(ballot1.isEqual(ballot2)).toBe(true);
    expect(ballot1.isNotEqual(ballot2)).toBe(false);
    ballot2._rankings = ['C', '', 'B'];
    expect(ballot1.isEqual(ballot2)).toBe(false);
    expect(ballot1.isNotEqual(ballot2)).toBe(true);
    ballot2._rankings = ['C', '#', 'B', ''];
    expect(ballot1.isEqual(ballot2)).toBe(false);
    expect(ballot1.isNotEqual(ballot2)).toBe(true);
    ballot2._rankings = {};
    expect(ballot1.isEqual(ballot2)).toBe(false);
    expect(ballot1.isNotEqual(ballot2)).toBe(true);
    expect(ballot1.isEqual(null)).toBe(false);
    expect(ballot1.isNotEqual(null)).toBe(true);
  });
});

