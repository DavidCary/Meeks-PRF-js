/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module OnewUnitTest
 * @summary Unit tests with one-winner tabulations
 */

import K from '../../src/constants.js';
import * as _TestAids from '../_test_aids.js';
import * as _TestFromFile from '../_test_from_file.js';
import * as Meek from '../../src/meek.js';
import Progress from '../../src/progress.js';
import {Validator} from '../../src/validate.js';
import {UBF} from '../../src/util_basic.js';
import {_getError} from '../_test_aids.js';
import {MeekValueError} from '../../src/errors.js';

const D9 = K.Decimal;

describe('one winner #1', () => {
  const candidates = ' A B C';
  const ballots = [
        [15, ' A B C'],
        [10, ' B C A'],
        [8,  ' C B A'],
        ];
  const tieBreaker = ' A B C';
  const options = {};
  const expElected = ['B'];
  const expStatus = _TestAids.buildExpectedStatus([
        ['A', 'defeated', 2, K.ONE * 15, K.ONE],
        ['B', 'elected',  2, K.ONE * 18, K.ONE],
        ['C', 'defeated', 1, K.ONE *  8, K.ZERO],
        ]);
  const expTally = _TestAids.buildStvTally({
        'A': [15.0, 15.0],
        'B': [10.0, 18.0],
        'C': [8.0],
        ':Overvotes': [0.0, 0.0],
        ':Abstentions': [0.0, 0.0],
        ':Other exhausted': [0.0, 0.0],
        ':Votes for candidates': [33.0, 33.0],
        ':Total votes': [33.0, 33.0],
        ':Quota': [16.500000001, 16.500000001],
        ':Total surplus': [0.0, 1.499999999],
        ':Iterations': [1, 1]
        });
  test('one winner, plain', () => {
    let results = new Meek.Tabulation(1, candidates, ballots,
          3, tieBreaker, [], [], options).tabulate();
    expect(Array.from(results.elected)).toEqual(Array.from(expElected));
    expect(results.statuses).toEqual(expStatus);
    expect(results.tally).toEqual(expTally);
  });
  test('one winner, counting progress', () => {
    let progressCount = 0;
    let progress = new Progress(response => {
      progressCount++;
    });
    progress.firstDelay = 0;
    progress.updateDelay = 0;
    progress.startTimers();
    let options = {'ballot_tree': 'dynamic'};

    let results = new Meek.Tabulation(1, candidates, ballots,
          3, tieBreaker, [], [], options, progress).tabulate();

    expect(Array.from(results.elected)).toEqual(Array.from(expElected));
    expect(results.statuses).toEqual(expStatus);
    expect(results.tally).toEqual(expTally);
    expect(progressCount).toBe(6);
  });
  test('one winner, check hopefulVotes', () => {
    let tabulator = new Meek.Tabulation(1, candidates, ballots,
          3, tieBreaker, [], [], options);
    let results = tabulator.tabulate({'stopAtBegin': 2});
    let hopefulVotes = tabulator._hopefulVotes();
    expect(hopefulVotes).toEqual({'A': new D9(15), 'B': new D9(10)});
  });
  test('one winner, tie with no tieBreaker', () => {
    const newBallots = Array.from(ballots);
    newBallots[2] = [10, ' C B A'];
    const newTieBreaker = '';
    let tabulator = new Meek.Tabulation(1, candidates, newBallots,
          3, newTieBreaker, [], [], options);
    let err = _getError(() => tabulator.tabulate());
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(MeekValueError);
    expect(err.toString()).toMatch(
      /^MeekValueError: Tied candidate is not in tieBreaker:\n/);
  });
  test('one winner, not enough rounds in altdef option', () => {
    const newOptions = {'alternative_defeats': []};
    let tabulator = new Meek.Tabulation(1, candidates, ballots,
          3, tieBreaker, [], [], newOptions);
    let err = _getError(() => tabulator.tabulate());
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(MeekValueError);
    expect(err.toString()).toMatch(new RegExp([
      /^MeekValueError: Round by round value/,
      / for alternative defeats option/,
      / is too short:\n/
    ].map(f=>f.source).join('')));
  });
});

describe('one winner #2', () => {
  test('one winner #2', () => {
    let candidates = ' A B C D';
    let ballots = [
          [15, ' A B C'],
          [8, ' B C D'],
          [1,  ' B'],
          [1,  ' B #'],
          [8,  ' C B A'],
          [5,  ' D C B'],
          ];
    let tieBreaker = ' A B C D';
    let options = {};
    let expElected = ['C'];
    let expStatus = _TestAids.buildExpectedStatus([
          ['A', 'defeated', 3, K.ONE * 15, K.ONE],
          ['B', 'defeated',  2, K.ONE * 10, K.ZERO],
          ['C', 'elected', 3, K.ONE * 21, K.ONE],
          ['D', 'defeated',  1, K.ONE * 5, K.ZERO],
          ]);
    let expTally = _TestAids.buildStvTally({
          'A': [15, 15, 15],
          'B': [10, 10],
          'C': [8, 13, 21],
          'D': [5],
          ':Overvotes': [0, 0, 1],
          ':Abstentions': [0, 0, 1],
          ':Other exhausted': [0, 0, 0],
          ':Votes for candidates': [38.0, 38.0, 36.0],
          ':Total votes': [38.0, 38.0, 38.0],
          ':Quota': [19.000000001, 19.000000001, 18.000000001],
          ':Total surplus': [0.0, 0.0, 2.999999999],
          ':Iterations': [1, 1, 1]
          });
    let results = new Meek.Tabulation(1, candidates, ballots,
          3, tieBreaker, [], [], options).tabulate();
    let statusDict = {};
    for (let candidate in results.statuses) {
      statusDict[candidate] = results.statuses[candidate].asSimpleObject();
    }
    expect(Array.from(results.elected)).toEqual(Array.from(expElected));
    expect(statusDict).toEqual(expStatus);
    expect(results.tally).toEqual(expTally);
  });
});

