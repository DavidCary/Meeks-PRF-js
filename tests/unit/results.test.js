/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module ResultsUnitTest
 * @summary Unit tests the Results class
 */

import K from '../../src/constants.js';
import Results from '../../src/results.js';
//import {Ballot} from '../../src/ballot.js';
import {Status} from '../../src/status.js';
//import {Results} from '../../src/util_basic.js';

const D9 = K.Decimal;

describe('get sort key', () => {
  let tstatus = {};
  beforeAll(() => {
    let tstatus1 = new Status('A', K.ONE.times(11), 3,
          'hopeful', K.ONE);
    let tstatus2 = new Status('B', K.ONE.times(4), 2,
          'defeated', K.ZERO);
    let tstatus3 = new Status('C', K.ONE.times(21), 5,
          'elected', K.ONE.times(0.6), 'protected');

    //console.debug('tstatus1.asArray()='+tstatus1.asArray().valueOf());
    //console.debug('tstatus2.asArray()='+tstatus2.asArray().valueOf());
    //console.debug('tstatus3.asArray()='+tstatus3.asArray().valueOf());
    tstatus['A'] = tstatus1;
    tstatus['B'] = tstatus2;
    tstatus['C'] = tstatus3;
  });
  test('hopeful', () => {
    expect(Results.getSortKey('A', tstatus)).toMatchObject(
          [1, 2, -3, new D9(-11), 'A']);
  });
  test('defeated', () => {
    expect(Results.getSortKey('B', tstatus)).toMatchObject(
          [1, 3, -2, new D9(-4), 'B']);
  });
  test('elected', () => {
    expect(Results.getSortKey('C', tstatus)).toMatchObject(
          [1, 1, 5, new D9(-21), 'C']);
  });
  test('elected', () => {
    expect(Results.getSortKey(':Total votes', tstatus)).toMatchObject(
          [2, 4, ':Total votes']);
  });
  test('elected', () => {
    expect(Results.getSortKey('junk', tstatus)).toMatchObject(
          [3, 1, 'junk']);
  });
});

describe('compare sort keys', () => {
  test('first less at index 0', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'A']},
          {sortKey: [2, 4, ':Total votes']})).toBe(-1);
  });
  test('first less at index 1', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'A']},
          {sortKey: [1, 3, -2, new D9(-4), 'B']})).toBe(-1);
  });
  test('first less at index 2', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'A']},
          {sortKey: [1, 2, -2, new D9(-4), 'D']})).toBe(-1);
  });
  test('first less at index 3', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'A']},
          {sortKey: [1, 2, -3, new D9(-4), 'E']})).toBe(-1);
  });
  test('first less at index 4', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'A']},
          {sortKey: [1, 2, -3, new D9(-11), 'F']})).toBe(-1);
  });
  test('equal', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'A']},
          {sortKey: [1, 2, -3, new D9(-11), 'A']})).toBe(0);
  });
  test('first greater at index 0', () => {
    expect(Results.compareSortKeys(
          {sortKey: [2, 4, ':Total votes']},
          {sortKey: [1, 2, -3, new D9(-11), 'A']})).toBe(1);
  });
  test('first greater at index 1', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 3, -2, new D9(-4), 'B']},
          {sortKey: [1, 2, -3, new D9(-11), 'A']})).toBe(1);
  });
  test('first greater at index 2', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -2, new D9(-4), 'D']},
          {sortKey: [1, 2, -3, new D9(-11), 'A']})).toBe(1);
  });
  test('first greater at index 3', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-4), 'E']},
          {sortKey: [1, 2, -3, new D9(-11), 'A']})).toBe(1);
  });
  test('first greater at index 4', () => {
    expect(Results.compareSortKeys(
          {sortKey: [1, 2, -3, new D9(-11), 'F']},
          {sortKey: [1, 2, -3, new D9(-11), 'A']})).toBe(1);
  });
});

describe('getStatusesAsString', () => {
  let statusA, statusB, statuses;
  let tallyA, tallyB, tallyVFC, tallyI, tally;
  beforeEach(() => {
    statusA = new Status(
          'A', new D9(7.3), 3, 'elected', new D9(1), 'normal');
    statusB = new Status(
          'B', new D9(5), 2, 'defeated', new D9(1), 'normal');
    statuses = {'A': statusA, 'B': statusB};
    tallyA = [ new D9(5), new D9(6.3), new D9(7.3)];
    tallyB = [ new D9(3), new D9(5)]
    tallyVFC = [ new D9(10), new D9(12), new D9(12)];
    tallyI = [ 1, 3, 2]
    tally = {'A': tallyA, 'B': tallyB, ':Votes for candidates': tallyVFC,
          ':Iterations': tallyI};
  });
  test('two statuses', () => {
    let asStatusesString = Results.getStatusesAsString(statuses);
    //console.debug('asString=~\n'+asString+'\n~');
    const expectedStatusesString = `
  "status": [
    ["A", "elected", 3, 7.3, 1.0],
    ["B", "defeated", 2, 5.0, 1.0]
  ]`;
    expect(asStatusesString).toBe(expectedStatusesString.slice(1));
  });
  test('two statuses with extras', () => {
    statusB.votes = null;
    let asStatusesString = Results.getStatusesAsString(statuses);
    //console.debug('asString=~\n'+asString+'\n~');
    const expectedStatusesString = `
  "status": [
    ["A", "elected", 3, 7.3, 1.0],
    ["B", "defeated", 2, null, 1.0]
  ]`;
    expect(asStatusesString).toBe(expectedStatusesString.slice(1));
  });
  test('tally', () => {
    const asTallyString = Results.getTallyAsString(tally, statuses);
    const expectedTallyString = `
  "tally": {
    "A": [5.0, 6.3, 7.3],
    "B": [3.0, 5.0],
    ":Votes for candidates": [10.0, 12.0, 12.0],
    ":Iterations": [1, 3, 2]
  }`;
    expect(asTallyString).toBe(expectedTallyString.slice(1));
  });
  test('tally order as array', () => {
    const asTallyOrderArray = Results.getTallyOrderAsArray(tally, statuses);
    const expectedTallyOrderArray = [
          'A', 'B', ':Votes for candidates', ':Iterations'];
    expect(asTallyOrderArray).toEqual(expectedTallyOrderArray);
  });
  test('tally order as lookup', () => {
    const asTallyOrderLookup = Results.getTallyOrderAsLookup(tally, statuses);
    const expectedTallyOrderLookup = {
          'A': 0, 'B': 1, ':Votes for candidates': 2, ':Iterations': 3};
    expect(asTallyOrderLookup).toEqual(expectedTallyOrderLookup);
  });
});


