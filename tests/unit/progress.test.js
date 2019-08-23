
/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module ProgressUnitTest
 * @summary Unit tests Progress class
 */
const DBG = 0;
const PDBG = console.debug;

import {Progress} from '../../src/progress.js';

describe('Progress creation', () => {
  test('create a Progress instance with default values', () => {
    let progress1 = new Progress();
    expect(progress1).not.toBeNull();
    expect(progress1.callback).toBeNull();
    expect(progress1.firstDelay).toBe(1);
    expect(progress1.updateDelay).toBe(100);
    expect(progress1.isBallotTreeUsed).toBe(false);
    expect(progress1.isDynamicTreeUsed).toBe(false);
    expect(progress1.nbrBallotGroups).toBe(1);
    expect(progress1.nbrOriginalHopefuls).toBe(1);
    expect(progress1.startTime).toBe(progress1.now);
    expect(progress1.earliestUpdateTime).toBe(progress1.now + 100);
    expect(progress1.earliestFirstTime).toBe(progress1.now + 1);
    expect(progress1.otherBase).toBe(1);
    expect(progress1.otherCompleted).toBe(0);
    expect(progress1.inProgress).toBe(0);
    expect(progress1.nbrResolvedHopefuls).toBe(0);
    expect(progress1.description).toBe('Tabulation started.');
    expect(progress1.progress).toBe(0);
    expect(progress1.validationPeriod).toBe(1001);
    expect(progress1.treeInitPeriod).toBe(1001);
    expect(progress1.treeBuildPeriod).toBe(1001);
    expect(progress1.completedLabel).toBe('COMPLETE');
    expect(progress1.validationComplete).toBe(false);
    expect(progress1.buildComplete).toBe(false);
    expect(progress1.initComplete).toBe(false);
    expect(progress1.maxNbrIterations).toBe(1);
  });
});

describe('Progress set start time earlier', () => {
  test('set the start time earlier', () => {
    let progress1 = new Progress(response => response);
    let now = Date.now();
    let asIfNow = now - 3000;
    progress1.startTimers(asIfNow);
    expect(progress1.now).toBe(asIfNow);
    expect(progress1.startTime).toBe(asIfNow);
    expect(progress1.earliestUpdateTime).toBe(now - 2900);
    expect(progress1.earliestFirstTime).toBe(now - 2999);
    expect(progress1.isTimeToUpdate()).toBe(true);
  });
});

describe('Progress set up', () => {
  test('set the start time earlier', () => {
    let progress1 = new Progress();
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(12);
    expect(progress1.nbrBallotGroups).toBe(5000);
    expect(progress1.nbrOriginalHopefuls).toBe(12);
  });
});

describe('Progress, validation', () => {
  test('validation progress', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(7);

    progress1.setValidationProgress(1000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1/5 / 7);
    expect(received.description).toBe(
          'Ballot validation: 1000 ballot groups, 20.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress(3000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(3/5 / 7);
    expect(received.description).toBe(
          'Ballot validation: 3000 ballot groups, 60.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress(4999);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(4999/5000 / 7);
    expect(received.description).toBe(
          'Ballot validation: 4999 ballot groups, 99.9%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress(5000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1 / 7);
    expect(received.description).toBe(
          'Ballot validation: 5000 ballot groups, 100.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1 / 7);
    expect(received.description).toBe(
          'Ballot validation complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1 / 7);
    expect(received.description).toBe(
          'Ballot validation complete.');
  });
});

describe('Progress, validation, ballot tree', () => {
  test('validation progress with ballot tree', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(7);
    progress1.useBallotTree();

    progress1.setValidationProgress(1000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1/5 / 8);
    expect(received.description).toBe(
          'Ballot validation: 1000 ballot groups, 20.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress(3000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(3/5 / 8);
    expect(received.description).toBe(
          'Ballot validation: 3000 ballot groups, 60.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress(4999);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(4999/5000 / 8);
    expect(received.description).toBe(
          'Ballot validation: 4999 ballot groups, 99.9%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress(5000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1 / 8);
    expect(received.description).toBe(
          'Ballot validation: 5000 ballot groups, 100.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1 / 8);
    expect(received.description).toBe(
          'Ballot validation complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setValidationProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1 / 8);
    expect(received.description).toBe(
          'Ballot validation complete.');
  });
});

describe('Progress, static tree build', () => {
  test('build progress of static ballot tree', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(7);
    progress1.useBallotTree();
    progress1.setValidationProgress('COMPLETE');
    expect(progress1.description).toBe(
          'Ballot validation complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(1000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(6/5 / 8);
    expect(received.description).toBe(
          'Build ballot tree: 1000 ballot groups, 20.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(3000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(8/5 / 8);
    expect(received.description).toBe(
          'Build ballot tree: 3000 ballot groups, 60.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(4999);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1 + 4999/5000) / 8);
    expect(received.description).toBe(
          'Build ballot tree: 4999 ballot groups, 99.9%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(5000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 8);
    expect(received.description).toBe(
          'Build ballot tree: 5000 ballot groups, 100.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 8);
    expect(received.description).toBe(
          'Build ballot tree complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 8);
    expect(received.description).toBe(
          'Build ballot tree complete.');
  });
});

describe('Progress, dynamic tree init and build', () => {
  test('init and build progress of static ballot tree', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(7);
    progress1.useBallotTree(true);
    progress1.setValidationProgress('COMPLETE');
    expect(progress1.description).toBe(
          'Ballot validation complete.');

    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress(1000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1 + 1/10) / 8);
    expect(received.description).toBe(
          'Init for ballot tree: 1000 ballot groups, 20.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress(3000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1 + 3/10) / 8);
    expect(received.description).toBe(
          'Init for ballot tree: 3000 ballot groups, 60.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress(4999);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1 + 4999/10000) / 8);
    expect(received.description).toBe(
          'Init for ballot tree: 4999 ballot groups, 99.9%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress(5000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1.5 / 8);
    expect(received.description).toBe(
          'Init for ballot tree: 5000 ballot groups, 100.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1.5 / 8);
    expect(received.description).toBe(
          'Init for ballot tree complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1.5 / 8);
    expect(received.description).toBe(
          'Init for ballot tree complete.');

    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(1000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1.5 + 1/10) / 8);
    expect(received.description).toBe(
          'Build ballot tree: 1000 ballot groups, 20.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(3000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1.5 + 3/10) / 8);
    expect(received.description).toBe(
          'Build ballot tree: 3000 ballot groups, 60.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(4999);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe((1.5 + 4999/10000) / 8);
    expect(received.description).toBe(
          'Build ballot tree: 4999 ballot groups, 99.9%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress(5000);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 8);
    expect(received.description).toBe(
          'Build ballot tree: 5000 ballot groups, 100.0%');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 8);
    expect(received.description).toBe(
          'Build ballot tree complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 8);
    expect(received.description).toBe(
          'Build ballot tree complete.');
  });
});

describe('Progress, rounds and iterations', () => {
  test('progress during rounds and iterations', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(10);
    progress1.setValidationProgress('COMPLETE');
    expect(progress1.description).toBe(
          'Ballot validation complete.');

    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(1, 1, 9);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 10);
    expect(received.description).toBe(
          'Round 1 complete : 9 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(2, 1, 9);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((2 + 1/4.4) / 10, 15);
    expect(received.description).toBe(
          'Round 2 iteration 1 : 9 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(2, 2, 9);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((2 + 2/5.5) / 10, 15);
    expect(received.description).toBe(
          'Round 2 iteration 2 : 9 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(2, 3, 9);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((2 + 3/6.6) / 10, 15);
    expect(received.description).toBe(
          'Round 2 iteration 3 : 9 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(2, 4, 8);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo(3 / 10, 15);
    expect(received.description).toBe(
          'Round 2 complete : 8 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(4, 3, 6);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo(5 / 10, 15);
    expect(received.description).toBe(
          'Round 4 complete : 6 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(5, 1, 6);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((5 + 1/7.7) / 10, 15);
    expect(received.description).toBe(
          'Round 5 iteration 1 : 6 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(9, 2, 0);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo(10 / 10, 15);
    expect(received.description).toBe(
          'Round 9 complete : 0 hopefuls remain.');
  });
});


describe('Progress, rounds and iterations, dynamic tree', () => {
  test('progress during rounds and iterations with dynamic tree', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(5000);
    progress1.setNbrOriginalHopefuls(9);
    progress1.useBallotTree(true);
    progress1.setValidationProgress('COMPLETE');
    expect(received.progressFraction).toBe(1 / 10);
    expect(progress1.description).toBe(
          'Ballot validation complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setDynamicTreeInitProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(1.5 / 10);
    expect(received.description).toBe(
          'Init for ballot tree complete.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setTreeBuildProgress('COMPLETE');
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(2 / 10);
    expect(received.description).toBe(
          'Build ballot tree complete.');

    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(1, 1, 8);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBe(3 / 10);
    expect(received.description).toBe(
          'Round 1 complete : 8 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(2, 1, 8);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((3 + 2/5.5) / 10, 15);
    expect(received.description).toBe(
          'Round 2 iteration 1 : 8 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(2, 2, 8);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((3 + 3/6.6) / 10, 15);
    expect(received.description).toBe(
          'Round 2 iteration 2 : 8 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setIterationProgress(2, 3, 8);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo((3 + 4/7.7) / 10, 15);
    expect(received.description).toBe(
          'Round 2 iteration 3 : 8 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(2, 4, 7);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo(4 / 10, 15);
    expect(received.description).toBe(
          'Round 2 complete : 7 hopefuls remain.');
    progress1.setEarliestUpdateTime(progress1.now - 150);
    progress1.setRoundProgress(8, 3, 0);
    if(DBG>2)PDBG('received='+JSON.stringify(received));
    expect(received.progressFraction).toBeCloseTo(10 / 10, 15);
    expect(received.description).toBe(
          'Round 8 complete : 0 hopefuls remain.');
  });
});


describe('Progress, progressFraction with bad data', () => {
  test('progressFraction with bad data', () => {
    let received = {};
    let progress1 = new Progress(response => {received = response;});
    progress1.startTimers(progress1.now - 3000);
    progress1.setNbrBallotGroups(500);
    progress1.setNbrOriginalHopefuls(NaN);
    progress1.useBallotTree(false);
    progress1.nbrOriginalHopefuls = NaN;
    progress1.setRoundProgress(3, 2, 4);
    expect(received.progressFraction).toBe(0);
    expect(progress1.description).toBe(
          'Round 3 complete : 4 hopefuls remain.');
  });
});

