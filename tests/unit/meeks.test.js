/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module MeekUnitTest
 * @summary Unit tests parts of Meeks module and class
 */

import * as _TestAids from '../_test_aids.js';
import * as _TestFromFile from '../_test_from_file.js';
import * as Meek from '../../src/meek.js';
import Results from '../../src/results.js';

describe('5 candidates, 3 winners', () => {
  const candidates = ' A B C D E';
  const ballots = [
        [15, ' A B C D E'],
        [7,  ' B C A E D'],
        ' C B A D E',
        ['C', 'B', 'A', 'D', 'E'],
        [7,  ' D E A B C'],
        [9,  ' E D C B A'],
        ];
  const tie_breaker = ' A B C E D';
  const options = {};
  const exp_elected = ['A', 'B', 'E'];
  const exp_status = _TestAids.buildExpectedStatus([
        ['A', 'elected', 1, 15.0, 0.556687034],
        ['B', 'elected',  2, 11.999999995, 0.646687698],
        ['C', 'defeated', 3, 3.999999987, 0.0],
        ['D', 'defeated', 4, 9.662674708, 1.0],
        ['E', 'elected', 4, 10.096395468, 1.0]
        ]);
  const exp_tally = _TestAids.buildStvTally({
        'A': [15.0, 10.000000005, 10.000000005, 10.120464912],
        'B': [7.0, 11.999999995, 10.000000008, 10.120464912],
        'C': [2.0, 2.0, 3.999999987],
        'D': [7.0, 7.0, 7.0, 9.662674708],
        'E': [9.0, 9.0, 9.0, 10.096395468],
        ':Overvotes': [0.0, 0.0, 0.0, 0.0],
        ':Abstentions': [0.0, 0.0, 0.0, 0.0],
        ':Other exhausted': [0.0, 0.0, 0.0, 0.0],
        ':Votes for candidates': [40.0, 40.0, 40.0, 40.0],
        ':Total votes': [40.0, 40.0, 40.0, 40.0],
        ':Quota': [10.000000001, 10.000000001, 10.000000001, 10.000000001],
        ':Total surplus': [4.999999999, 1.999999998, 1.1e-08, 0.337325289],
        ':Iterations': [1, 2, 2, 4]
        });
  const expectedElectedString1 = '  "elected": ["A", "B", "E"]';
  const expectedStatusesString1 = `
  "status": [
    ["A", "elected", 1, 15.0, 0.556687034],
    ["B", "elected", 2, 11.999999995, 0.646687698],
    ["E", "elected", 4, 10.096395468, 1.0],
    ["D", "defeated", 4, 9.662674708, 1.0],
    ["C", "defeated", 3, 3.999999987, 0.0]
  ]`;
  const expectedTallyString1 = `
  "tally": {
    "A": [15.0, 10.000000005, 10.000000005, 10.120464912],
    "B": [7.0, 11.999999995, 10.000000008, 10.120464912],
    "E": [9.0, 9.0, 9.0, 10.096395468],
    "D": [7.0, 7.0, 7.0, 9.662674708],
    "C": [2.0, 2.0, 3.999999987],
    ":Votes for candidates": [40.0, 40.0, 40.0, 40.0],
    ":Overvotes": [0.0, 0.0, 0.0, 0.0],
    ":Abstentions": [0.0, 0.0, 0.0, 0.0],
    ":Other exhausted": [0.0, 0.0, 0.0, 0.0],
    ":Total votes": [40.0, 40.0, 40.0, 40.0],
    ":Quota": [10.000000001, 10.000000001, 10.000000001, 10.000000001],
    ":Total surplus": [4.999999999, 1.999999998, 1.1e-8, 0.337325289],
    ":Iterations": [1, 2, 2, 4]
  }`;

  test('5 candidates, 3 winners, plain', () => {
    let tabulator = new Meek.Tabulation(3, candidates, ballots,
          5, tie_breaker, [], [], options);
    let results = tabulator.tabulate();
    /*
    console.debug('result elected='+Meek._show(elected));
    console.debug('result status='+Meek._show(status));
    console.debug('result tally='+Meek._show(tally));
    console.debug('exp_tally='+Meek._show(exp_tally));
    */
    expect(new Set(results.elected)).toMatchObject(new Set(exp_elected));
    expect(results.statuses).toMatchObject(exp_status);
    expect(results.tally).toMatchObject(exp_tally);
  });
  test('5 candidates, 3 winners, + results to strings', () => {
    let options = {'ballot_tree': 'static'};
    let tabulator = new Meek.Tabulation(3, candidates, ballots,
          5, tie_breaker, [], [], options);
    let results = tabulator.tabulate();
    expect(new Set(results.elected)).toMatchObject(new Set(exp_elected));
    expect(results.statuses).toMatchObject(exp_status);
    expect(results.tally).toMatchObject(exp_tally);

    let electedString1 = Results.getElectedAsString(results.elected);
    let electedString2 = results.getElectedAsString();
    expect(electedString1).toBe(expectedElectedString1);
    expect(electedString1).toBe(electedString2);

    let statusesString1 = Results.getStatusesAsString(results.statuses);
    let statusesString2 = results.getStatusesAsString();
    expect(statusesString1).toBe(expectedStatusesString1.slice(1));
    expect(statusesString1).toBe(statusesString2);

    let tallyString1 = Results.getTallyAsString(
          results.tally, results.statuses);
    let tallyString2 = results.getTallyAsString();
    expect(tallyString1).toBe(expectedTallyString1.slice(1));
    expect(tallyString1).toBe(tallyString2);
  });
  test('5 candidates, 3 winners, with Meek.tabulate()', () => {
    let options = {'ballot_tree': 'static'};
    let results = Meek.tabulate(3, candidates, ballots,
          5, tie_breaker, [], [], options);
    expect(new Set(results.elected)).toMatchObject(new Set(exp_elected));
    expect(results.statuses).toMatchObject(exp_status);
    expect(results.tally).toMatchObject(exp_tally);
  });
  test.each([null, 'dynamic', 'static', 'none'])
  ('with option ballot_tree: %s',
  (ballot_tree_type) => {
    let options = ballot_tree_type ?
        {'ballot_tree': ballot_tree_type} :
        {};
    let tabulator = new Meek.Tabulation(3, candidates, ballots,
          5, tie_breaker, [], [], options);
    let results = tabulator.tabulate();
    expect(new Set(results.elected)).toMatchObject(new Set(exp_elected));
    expect(results.statuses).toMatchObject(exp_status);
    expect(results.tally).toMatchObject(exp_tally);
  });
});

describe('10 candidates, 5 winners', () => {
  test('bike accessories', () => {
    let candidates = '|Lock|Lights|Bike Computer|Patch Kit|Tire Pump|Helmet|Bell|Mirror|Rack|Fenders'
    let ballots = [
          [1, '|Lights|Lock|Rack|Bell|Bike Computer|Tire Pump|Patch Kit|Fenders|Helmet|Mirror'],
          [1, '|Lights|Tire Pump|Bike Computer|Helmet|Bell|Lock|Rack|Patch Kit|Fenders|Mirror'],
          [1, '|Helmet|Lights|Lock|Patch Kit|Tire Pump|Rack|Bell|Bike Computer|Fenders|Mirror'],
          [1, '|Helmet|Lights|Bell|Lock|Mirror|Bike Computer||||'],
          [1, '|Bell|Lights|Helmet|Lock|Bike Computer|||||'],
          [1, '|Helmet|Bell|Patch Kit|Lock|Rack|Lights|Mirror|Bike Computer|Fenders|Tire Pump'],
          [1, '|Helmet|Mirror|Lock|Lights|Patch Kit|Tire Pump|Rack|Fenders|Bell|Bike Computer'],
          [1, '|Lock|Helmet|Lights|Rack|Bell|Mirror|Fenders|Tire Pump|Patch Kit|Bike Computer'],
          [1, '|Helmet|Lock|Lights|Bell|Rack|Patch Kit|Tire Pump|Mirror|Fenders|Bike Computer'],
          [1, '|Lock|Lights|Fenders|Rack|Tire Pump|Patch Kit|||Mirror|Bike Computer'],
          ];

    let tie_breaker = '|Tire Pump|Rack|Lights|Bell|Mirror|Bike Computer|Helmet|Fenders|Patch Kit|Lock';
    let options = {};
    let exp_elected = ['Helmet', 'Lights', 'Lock', 'Bell', 'Rack'];
    let exp_status = _TestAids.buildExpectedStatus([
          ['Helmet', 'elected', 1, 5.0, 0.277431723],
          ['Lights', 'elected', 1, 2.0, 0.281481953],
          ['Lock', 'elected', 1, 2.0, 0.311956109],
          ['Bell', 'elected', 2, 1.796296294, 0.643793424],
          ['Rack', 'elected', 7, 1.650295804, 1.0],
          ['Tire Pump', 'defeated', 7, 1.432953025, 1.0],
          ['Mirror', 'defeated', 6, 0.829464938, 0.0],
          ['Patch Kit', 'defeated', 5, 0.547571763, 0.0],
          ['Fenders', 'defeated', 4, 0.419393612, 0.0],
          ['Bike Computer', 'defeated', 3, 0.097371969, 0.0],
          ]);
    let exp_tally = _TestAids.buildStvTally({
          'Helmet': [5.0, 1.722222226, 1.666666729, 1.649436679, 1.649436679, 1.648330517, 1.649049930],
          'Lights': [2.0, 3.101851853, 1.666666815, 1.649436756, 1.649436756, 1.648330646, 1.683505025],
          'Lock': [2.0, 2.453703705, 1.666666806, 1.649436756, 1.649436756, 1.648330682, 1.656513773],
          'Bell': [1.0, 1.796296294, 1.666666791, 1.649436742, 1.649436742, 1.648330618, 1.673196007],
          'Rack': [0.0, 0.046296295, 0.801966117, 0.823846149, 1.243239761, 1.460919757, 1.650295804],
          'Tire Pump': [0.0, 0.166666666, 0.681050552, 0.686805846, 0.686805846, 1.006275255, 1.432953025],
          'Mirror': [0.0, 0.666666666, 0.811469017, 0.821255352, 0.821255352, 0.829464938],
          'Patch Kit': [0.0, 0.018518518, 0.530416712, 0.547571763, 0.547571763],
          'Fenders': [0.0, 0.027777777, 0.411058492, 0.419393612],
          'Bike Computer': [0.0, 0.0, 0.097371969],
          ':Overvotes': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          ':Abstentions': [0.0, 0.0, 0.0, 0.103380345, 0.103380345, 0.110017587, 0.254486436],
          ':Other exhausted': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          ":Votes for candidates": [10.0, 10.0, 10.0, 9.896619655, 9.896619655,
              9.889982413, 9.745513564],
          ":Total votes": [10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0],
          ":Quota": [1.666666667, 1.666666667, 1.666666667, 1.64943661,
              1.64943661, 1.648330403, 1.624252261],
          ":Total surplus": [3.999999999, 2.407407410, 4.73e-07, 4.93e-07, 4.93e-07,
              8.51e-07, 0.191299234],
          ":Iterations": [1, 2, 17, 14, 1, 14, 2]
          });
    let results = new Meek.Tabulation(5, candidates, ballots,
          10, tie_breaker, [], [], options).tabulate();
    //status_dict = {candidate: status.as_dict()
    //      for candidate, status in status.items()}
    /*
    console.debug('result elected='+Meek._show(elected));
    console.debug('result status='+Meek._show(status));
    console.debug('result tally='+Meek._show(tally));
    console.debug('exp_tally='+Meek._show(exp_tally));
    */
    expect(new Set(results.elected)).toMatchObject(new Set(exp_elected));
    expect(results.statuses).toMatchObject(exp_status);
    expect(results.tally).toMatchObject(exp_tally);
  });
});

describe('test from file, runTestSpec', () => {
  test('test 004D', async () => {
    let fileName='tests/unit/in/test_from_file-in-004D.json';
    await _TestFromFile.runTestSpec(fileName);
  });
});

