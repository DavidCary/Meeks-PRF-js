/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module MeekPartsUnitTest
 * @summary Unit tests parts of Meeks module and class
 */

import K from '../../src/constants.js';
import {Ballot} from '../../src/ballot.js';
import {Status} from '../../src/status.js';
import {tabulate, Tabulation}
      from '../../src/meek.js';
import {UBF} from '../../src/util_basic.js';

const D9 = K.Decimal;

function makeMeek01() {
  let candidates = ' A B C';
  let ballots = [
        [15, ' A B C'],
        [10, ' B C A'],
        [8,  ' C B A'],
        ];
  let tie_breaker = ' A B C';
  let options = {};
  return new Tabulation(1, candidates, ballots, 3, tie_breaker,
        [], [], options);
}

describe('create tabulation', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    expect(tab1._nbrSeatsToFill).toBe(1);
    expect(tab1._candidates).toMatchObject(['A', 'B', 'C']);
    expect(tab1._ballots).toMatchObject([
          {_multiple: 15, _rankings: ['A', 'B', 'C']},
          {_multiple: 10, _rankings: ['B', 'C', 'A']},
          {_multiple: 8 , _rankings: ['C', 'B', 'A']},
    ]);
    expect(tab1._maxRankingLevels).toBe(3);
    expect(tab1._tieBreaker).toMatchObject(
          {'A': 0, 'B': 1, 'C': 2});
    expect(tab1._excluded).toMatchObject(new Set());
    expect(tab1._protectedzz).toMatchObject(new Set());
    expect(tab1._options).toMatchObject({
          'alternative_defeats': 'N',
          'type_of_altdefs': 'if_no_new_electeds',
          'always_count_votes': true,
    });
  });
});

describe('setup to begin of round 1', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAtBegin: 1});
    expect(tab1._nbrRound).toBe(1);
    expect(tab1._nbrUnprotectedSeats).toBe(1);
    expect(tab1._omega).toMatchObject(new D9(1, -6));
    //Results.printStatus(tab1.status);
    expect(tab1._statuses).toMatchObject({
      'A': {candidate: 'A', status: 'hopeful', 'nbrRound': 0,
        votes: null, keepFactor: K.ONE, destiny: 'normal'},
      'B': {candidate: 'B', status: 'hopeful', 'nbrRound': 0,
        votes: null, keepFactor: K.ONE, destiny: 'normal'},
      'C': {candidate: 'C', status: 'hopeful', 'nbrRound': 0,
        votes: null, keepFactor: K.ONE, destiny: 'normal'},
    });
    //Results.printTally(tab1.tallies, tab1.status);
    expect(tab1._tallies).toMatchObject({
      'A': [],'B': [],'C': [],
      ':Votes for candidates': [],':Overvotes': [],':Abstentions': [],
      ':Other exhausted': [], ':Total votes': [],
      ':Quota': [], ':Total surplus': [],
      ':Iterations': []});
    expect(tab1._keepFactors).toMatchObject({
      'A': K.ONE, 'B': K.ONE, 'C': K.ONE});
    //console.debug('tab1='+JSON.stringify(tab1, null, 1));
  });
});

describe('distribute_votes', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAtBegin: 1});
    tab1._nbrIteration = 1;
    tab1._initIterTally();
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    tab1._distributeVotes();
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    expect(tab1._iterTally['A']).toMatchObject(new D9(15));
    expect(tab1._iterTally['B']).toMatchObject(new D9(10));
    expect(tab1._iterTally['C']).toMatchObject(new D9(8));
  });
});

describe('after status update, round 1', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAfterStatusUpdate: 1});
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    expect(tab1._nbrIteration).toBe(1);
    expect(tab1._iterTally['A']).toMatchObject(new D9(15));
    expect(tab1._iterTally['B']).toMatchObject(new D9(10));
    expect(tab1._iterTally['C']).toMatchObject(new D9(8));
    expect(tab1._iterTally[':Total votes']).toMatchObject(new D9(33));
    expect(tab1._iterTally[':Votes for candidates']).toMatchObject(new D9(33));
    expect(tab1._quota).toMatchObject(new D9(16.500000001));
    //console.debug('tab1.status='+JSON.stringify(tab1.status, null, 0));
    expect(tab1._statuses).toMatchObject({
      'A': {candidate: 'A', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(15), keepFactor: K.ONE, destiny: 'normal'},
      'B': {candidate: 'B', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(10), keepFactor: K.ONE, destiny: 'normal'},
      'C': {candidate: 'C', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(8), keepFactor: K.ONE, destiny: 'normal'},
    });
  });
});

describe('defeat candidate', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAfterStatusUpdate: 1});
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    //console.debug('tab1.status='+JSON.stringify(tab1.status, null, 0));
    expect(tab1._statuses).toMatchObject({
      'A': {candidate: 'A', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(15), keepFactor: K.ONE, destiny: 'normal'},
      'B': {candidate: 'B', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(10), keepFactor: K.ONE, destiny: 'normal'},
      'C': {candidate: 'C', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(8), keepFactor: K.ONE, destiny: 'normal'},
    });
    expect(tab1._hopeful()).toMatchObject(new Set(['A', 'B', 'C']));
    expect(tab1._elected()).toMatchObject(new Set([]));
    expect(tab1._keepFactors['B']).toMatchObject(K.ONE);
    tab1._defeatCandidates(new Set(['B']));
    expect(tab1._statuses).toMatchObject({
      'A': {candidate: 'A', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(15), keepFactor: K.ONE, destiny: 'normal'},
      'B': {candidate: 'B', status: 'defeated', 'nbrRound': 1,
        votes: new D9(10), keepFactor: K.ONE, destiny: 'normal'},
      'C': {candidate: 'C', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(8), keepFactor: K.ONE, destiny: 'normal'},
    });
    expect(tab1._hopeful()).toMatchObject(new Set(['A', 'C']));
    expect(tab1._elected()).toMatchObject(new Set([]));
    expect(tab1._keepFactors['B']).toMatchObject(K.ZERO);

  });
});

describe('elect candidate', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAfterStatusUpdate: 1});
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    //console.debug('tab1.status='+JSON.stringify(tab1.status, null, 0));
    expect(tab1._hopeful()).toMatchObject(new Set(['A', 'B', 'C']));
    expect(tab1._elected()).toMatchObject(new Set([]));
    tab1._electCandidates(new Set(['B', 'C']));
    expect(tab1._statuses).toMatchObject({
      'A': {candidate: 'A', status: 'hopeful', 'nbrRound': 1,
        votes: new D9(15), keepFactor: K.ONE, destiny: 'normal'},
      'B': {candidate: 'B', status: 'elected', 'nbrRound': 1,
        votes: new D9(10), keepFactor: K.ONE, destiny: 'normal'},
      'C': {candidate: 'C', status: 'elected', 'nbrRound': 1,
        votes: new D9(8), keepFactor: K.ONE, destiny: 'normal'},
    });
    expect(tab1._hopeful()).toMatchObject(new Set(['A']));
    expect(tab1._elected()).toMatchObject(new Set(['B', 'C']));
  });
});

describe('resolve_tie', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAfterStatusUpdate: 1});
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    //console.debug('tab1.status='+JSON.stringify(tab1.status, null, 0));
    expect(tab1._tieBreaker).toMatchObject({'A':0, 'B':1, 'C':2});
    expect(tab1._resolveTie(new Set(['A', 'B', 'C']))).toBe('A');
    expect(tab1._resolveTie(new Set(['C', 'B']))).toBe('B');
  });
});

describe('get single defeat candidate', () => {
  test('tabulation 01', () => {
    let tab1 = makeMeek01();
    tab1.tabulate({stopAfterStatusUpdate: 1});
    //console.debug('tab1.iterTally='+JSON.stringify(tab1.iterTally, null, 0));
    //console.debug('tab1.status='+JSON.stringify(tab1.status, null, 0));
    tab1._totalSurplus = tab1._getTotalSurplus();
    expect(tab1._tieBreaker).toMatchObject({'A':0, 'B':1, 'C':2});
    expect(tab1._getSingleDefeatCandidate())
          .toMatchObject(new Set(['C']));
    tab1._statuses['A'].votes = K.ONE.times(8);
    expect(tab1._getSingleDefeatCandidate())
          .toMatchObject(new Set(['A']));
  });
});

