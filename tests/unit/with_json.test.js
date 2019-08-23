/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module WithJsonUnitTest
 * @summary Unit tests WithJson module
 * */

import K from '../../src/constants.js';
import {UBF} from '../../src/util_basic.js';
import {Ballot} from '../../src/ballot.js';
import {Status} from '../../src/status.js';
import {Validator} from '../../src/validate.js';
import {MeekValueError} from '../../src/errors.js';
import {_getError, _expectError, _expectAsyncError} from '../_test_aids.js';
import {describeError} from '../../src/errors.js';
import Results from '../../src/results.js';
import WithJson from '../../src/with_json.js';
import * as fs from 'fs';

const D9 = K.Decimal;

describe('readFile', () => {
  test('readFile', async () => {
    let fileName='tests/unit/in/with_json-in-001.json';
    await expect(await WithJson.readFile(fileName)).toBe(
      '{\n  "key1": "value1"\n  ,"key2": [5, 17]\n}\n'
    );
  });
  test('readFile, file does not exist', async () => {
    let fileName='tests/unit/with_json-in-does-not-exist.json';
    /*
    let err = await _getError((async () => await WithJson.readFile(fileName)));
    console.debug(err);
    console.debug('err is an Error='+(err instanceof Error));
    console.debug('typeof err='+(typeof err));
    console.debug('err described='+UBF.describeError(err));
    let errProto = Object.getPrototypeOf(err);
    console.debug(errProto);
    console.debug(UBF.getOwnItems(errProto));
    */
    //await expect(await WithJson.readFile(fileName)).rejects.toThrow(Error);
    await _expectAsyncError((async () => await WithJson.readFile(fileName)),
          null,
          /^Error: ENOENT: no such file or directory,/);
  });
});

describe('readJson', () => {
  test('readJson', async () => {
    let fileName='tests/unit/in/with_json-in-001.json';
    await expect(await WithJson.readJson(fileName)).toMatchObject(
      {"key1": "value1", "key2": [5, 17]}
    );
  });
  test('readJson _show', async () => {
    let fileName='tests/unit/in/with_json-in-001.json';
    await expect(await UBF.show(await WithJson.readJson(fileName))).toBe(
      '{"key1": "value1", "key2": [5, 17]}'
    );
  });
});

describe('writeFile', () => {
  test('readJson', async () => {
    let fileName='tests/temp_output/with_json-ot-001.json';
    try {
      fs.unlinkSync(fileName);
    }
    catch (exc) {
      if (String(exc).match(
            /^Error: ENOENT: no such file or directory/) === null) {
        throw exc;
      }
    }
    let text = '{\n  "key1": "value2"\n  ,"key22": [7, 23]\n}\n';
    await WithJson.writeFile(fileName, text);
    await expect(await WithJson.readFile(fileName)).toBe(
      '{\n  "key1": "value2"\n  ,"key22": [7, 23]\n}\n'
    );
  });
  test('readJson no directory', async () => {
    let fileName='tests/temp_output/no-directory/with_json-ot-001B.json';
    let text = '{\n  "key1B": "value21"\n  ,"key23": [1, 13]\n}\n';
    await _expectAsyncError((
      async () => await WithJson.writeFile(
          fileName, text)),
          null,
          /^Error: ENOENT: no such file or directory/);
  });
});

describe('readTabulationSpec', () => {
  test('test 002', async () => {
    let fileName='tests/unit/in/with_json-in-002.json';
    await expect(await WithJson.readTabulationSpec(fileName)).toMatchObject({
      "description": "Test description not provided."
      ,"nbrSeatsToFill": 0
      ,"candidates": ""
      ,"ballots": []
      ,"maxRankingLevels": 0
      ,"tieBreaker": ""
      ,"options": {}
      ,"elected": ""
      ,"statusCodes": []
      ,"tally": {}
    });
  });
  test('test 002 as string', async () => {
    let fileName='tests/unit/in/with_json-in-002.json';
    await expect(await UBF.show(
          await WithJson.readTabulationSpec(fileName))).toBe(
      '{"ballots": []' +
      ', "candidates": ""' +
      ', "description": "Test description not provided."' +
      ', "elected": ""' +
      ', "excluded": []' +
      ', "maxRankingLevels": 0' +
      ', "nbrSeatsToFill": 0' +
      ', "options": {}' +
      ', "protected": []' +
      ', "statusCodes": []' +
      ', "tally": {}' +
      ', "tieBreaker": ""}'
    );
  });
  test('test 003 as string', async () => {
    let fileName='tests/unit/in/with_json-in-003.json';
    await expect(await UBF.show(
          await WithJson.readTabulationSpec(fileName))).toBe(
      '{"ballots": []' +
      ', "candidates": ""' +
      ', "description": "Unit test for readTabulationSpec 003."' +
      ', "elected": ""' +
      ', "excluded": []' +
      ', "maxRankingLevels": 3' +
      ', "nbrSeatsToFill": 2' +
      ', "options": {}' +
      ', "protected": []' +
      ', "statusCodes": []' +
      ', "tally": {}' +
      ', "tieBreaker": ""}'
    );
  });
  test('test 003 with default, as string', async () => {
    let fileName='tests/unit/in/with_json-in-003.json';
    let defaultName='tests/unit/in/with_json-in-003-default.json';
    await expect(await UBF.show(await WithJson.readTabulationSpec(
      fileName, defaultName))).toBe(
      '{"ballots": []' +
      ', "candidates": " A B C D E F"' +
      ', "description": "Unit test for readTabulationSpec 003."' +
      ', "elected": ""' +
      ', "excluded": []' +
      ', "maxRankingLevels": 3' +
      ', "nbrSeatsToFill": 2' +
      ', "options": {}' +
      ', "protected": []' +
      ', "statusCodes": []' +
      ', "tally": {}' +
      ', "tieBreaker": ""}'
    );
  });
  test('test 004', async () => {
    let fileName='tests/unit/in/with_json-in-004A.json';
    let defaultName='tests/unit/in/with_json-in-004-default.json';
    await expect(await WithJson.readTabulationSpec(fileName, defaultName))
          .toMatchObject({
      "description": "readTabulationSpec 004 primary, before single defeats"
      ,"include": [
            "tests/unit/in/with_json-in-004-base.json",
            "tests/unit/in/with_json-in-004-results.json"
      ]
      ,"nbrSeatsToFill": 1
      ,"candidates": " AA BB CC DD EE"
      ,"ballots": [
            [300, " AA BB CC"],
            [250, " BB CC AA"],
            [150, " CC BB AA"],
            [50,  " CC AA BB"],
            [20,  " DD EE CC"],
            [170, " DD"],
            [9,   " EE DD EE"]
      ]
      ,"tieBreaker": ""
      ,"elected": ["BB"]
      ,"options": {
            "alternative_defeats": "Y",
            "type_of_altdefs": "before_single_defeats"
      }
      ,"maxRankingLevels": 3
      ,"statusCodes": [
            ["BB", "elected", 3, 400.0, 1.0],
            ["AA", "defeated", 3, 350.0, 1.0],
            ["CC", "defeated", 2, 220.0, 0.0],
            ["DD", "defeated", 1, 190.0, 0.0],
            ["EE", "defeated", 1, 9.0, 0.0]
      ]
      ,"tally": {
            "BB": [250.0, 250.0, 400.0],
            "AA": [300.0, 300.0, 350.0],
            "CC": [200.0, 220.0],
            "DD": [190.0],
            "EE": [9.0],
            ":Votes for candidates": [949.0, 770.0, 750.0],
            ":Overvotes": [0.0, 0.0, 0.0],
            ":Abstentions": [0.0, 179.0, 179.0],
            ":Other exhausted": [0.0, 0.0, 20.0],
            ":Total votes": [949.0, 949.0, 949.0],
            ":Quota": [474.500000001, 385.000000001, 375.000000001],
            ":Total surplus": [0.0, 0.0, 24.999999999],
            ":Iterations": [1, 1, 1]
      }
    });
  });
  test('test 004, as string', async () => {
    let fileName='tests/unit/in/with_json-in-004A.json';
    let defaultName='tests/unit/in/with_json-in-004-default.json';
    await expect(await UBF.show(await WithJson.readTabulationSpec(
          fileName, defaultName))).toBe(
      '{"ballots": [' +
        '[300, " AA BB CC"], ' +
        '[250, " BB CC AA"], ' +
        '[150, " CC BB AA"], ' +
        '[50, " CC AA BB"], ' +
        '[20, " DD EE CC"], ' +
        '[170, " DD"], ' +
        '[9, " EE DD EE"]]' +
      ', "candidates": " AA BB CC DD EE"' +
      ', "description": ' +
        '"readTabulationSpec 004 primary, before single defeats"' +
      ', "elected": ["BB"]' +
      ', "excluded": []' +
      ', "include": ["tests/unit/in/with_json-in-004-base.json",' +
        ' "tests/unit/in/with_json-in-004-results.json"]' +
      ', "maxRankingLevels": 3' +
      ', "nbrSeatsToFill": 1' +
      ', "options": {"alternative_defeats": "Y"' +
        ', "type_of_altdefs": "before_single_defeats"}' +
      ', "protected": []' +
      ', "statusCodes": [' +
        '["BB", "elected", 3, 400, 1], ' +
        '["AA", "defeated", 3, 350, 1], ' +
        '["CC", "defeated", 2, 220, 0], ' +
        '["DD", "defeated", 1, 190, 0], ' +
        '["EE", "defeated", 1, 9, 0]]' +
      ', "tally": {' +
        '":Abstentions": [0, 179, 179], ' +
        '":Iterations": [1, 1, 1], ' +
        '":Other exhausted": [0, 0, 20], ' +
        '":Overvotes": [0, 0, 0], ' +
        '":Quota": [474.500000001, 385.000000001, 375.000000001], ' +
        '":Total surplus": [0, 0, 24.999999999], ' +
        '":Total votes": [949, 949, 949], ' +
        '":Votes for candidates": [949, 770, 750], ' +
        '"AA": [300, 300, 350], ' +
        '"BB": [250, 250, 400], ' +
        '"CC": [200, 220], ' +
        '"DD": [190], ' +
        '"EE": [9]' +
      '}' +
      ', "tieBreaker": ""' +
      '}'
    );
  });
});

describe('buildTabulateArgs', () => {
  test('test 004B, as string', async () => {
    let fileName='tests/unit/in/with_json-in-004B.json';
    let defaultName='tests/unit/in/with_json-in-004-default.json';
    let [tabArgs, tabSpec] = await WithJson.buildTabulateArgs(
          fileName, defaultName);
    expect(UBF.show(tabArgs)).toBe(
      '[1, " AA BB CC DD EE", '+
      '[' +
        '[300, " AA BB CC"], ' +
        '[250, " BB CC AA"], ' +
        '[150, " CC BB AA"], ' +
        '[50, " CC AA BB"], ' +
        '[20, " DD EE CC"], ' +
        '[170, " DD"], ' +
        '[9, " EE DD EE"], ' +
        '[5, " AA BB"]' +
      '], 3, "", [], [], ' +
      '{"alternative_defeats": "Y"' +
        ', "type_of_altdefs": "before_single_defeats"}' +
      ']'
    );
    expect(UBF.show(tabSpec)).toBe(
      '{"ballots": [' +
        '[300, " AA BB CC"], ' +
        '[250, " BB CC AA"], ' +
        '[150, " CC BB AA"], ' +
        '[50, " CC AA BB"], ' +
        '[20, " DD EE CC"], ' +
        '[170, " DD"], ' +
        '[9, " EE DD EE"]]' +
      ', "ballotsMore": [[5, " AA BB"]]' +
      ', "candidates": " AA BB CC DD EE"' +
      ', "description": ' +
        '"readTabulationSpec 004B primary, before single defeats"' +
      ', "elected": ["BB"]' +
      ', "excluded": []' +
      ', "include": ["tests/unit/in/with_json-in-004-base.json",' +
        ' "tests/unit/in/with_json-in-004-results.json"]' +
      ', "maxRankingLevels": 3' +
      ', "nbrSeatsToFill": 1' +
      ', "options": {"alternative_defeats": "Y"' +
        ', "type_of_altdefs": "before_single_defeats"}' +
      ', "protected": []' +
      ', "statusCodes": [' +
        '["BB", "elected", 3, 400, 1], ' +
        '["AA", "defeated", 3, 350, 1], ' +
        '["CC", "defeated", 2, 220, 0], ' +
        '["DD", "defeated", 1, 190, 0], ' +
        '["EE", "defeated", 1, 9, 0]]' +
      ', "tally": {' +
        '":Abstentions": [0, 179, 179], ' +
        '":Iterations": [1, 1, 1], ' +
        '":Other exhausted": [0, 0, 20], ' +
        '":Overvotes": [0, 0, 0], ' +
        '":Quota": [474.500000001, 385.000000001, 375.000000001], ' +
        '":Total surplus": [0, 0, 24.999999999], ' +
        '":Total votes": [949, 949, 949], ' +
        '":Votes for candidates": [949, 770, 750], ' +
        '"AA": [300, 300, 350], ' +
        '"BB": [250, 250, 400], ' +
        '"CC": [200, 220], ' +
        '"DD": [190], ' +
        '"EE": [9]' +
      '}' +
      ', "tieBreaker": ""' +
      '}'
    );
  });
});

describe('resultsToJsonString', () => {
  test('simple', () => {
    let elected = ['B'];
    let statuses = {
      'A': new Status('A', new D9(8), 2, 'defeated', K.ONE),
      'B': new Status('B', new D9(10), 2, 'elected', K.ONE),
      'C': new Status('C', new D9(5), 1, 'defeated', K.ONE)
    };
    let tally = {
      'B': [new D9(6), new D9(10)],
      'A': [new D9(7), new D9(8)],
      'C': [new D9(5)],
      ':Votes for candidates': [new D9(18), new D9(18)],
      ':Total votes': [new D9(18), new D9(18)],
      ':Quota': [new D9(9.000000001), new D9(9.000000001)],
    }
    let results = new Results(elected, statuses, tally);
    let description = 'A simple election with partial tally';
    expect(WithJson.resultsToJsonString(
          results, description)).toBe(
      '{\n  "description": "A simple election with partial tally"\n' +
      '  ,"elected": ["B"]\n' +
      '  ,"status": [\n' +
      '    ["B", "elected", 2, 10.0, 1.0],\n' +
      '    ["A", "defeated", 2, 8.0, 1.0],\n' +
      '    ["C", "defeated", 1, 5.0, 1.0]\n' +
      '  ]\n' +
      '  ,"tally": {\n' +
      '    "B": [6.0, 10.0],\n' +
      '    "A": [7.0, 8.0],\n' +
      '    "C": [5.0],\n' +
      '    ":Votes for candidates": [18.0, 18.0],\n' +
      '    ":Total votes": [18.0, 18.0],\n' +
      '    ":Quota": [9.000000001, 9.000000001]\n' +
      '  }\n' +
      '}\n'
    );
  });
});

describe('tabulate', () => {
  test('test 004C, as string', async () => {
    let fileName='tests/unit/in/with_json-in-004C.json';
    let defaultName='tests/unit/in/with_json-in-004-default.json';
    let outFileName='tests/temp_output/with_json-ot-004C.json';
    let expectedOutFileName='tests/unit/in/with_json-ot-004C-results.json';
    try {
      fs.unlinkSync(outFileName);
    }
    catch (exc) {
      if (String(exc).match(
            /^Error: ENOENT: no such file or directory/) === null) {
        throw exc;
      }
    }
    let [results, tabulationSpec] = await WithJson.tabulate(
          fileName, outFileName, defaultName);
    expect(results.elected).toEqual(new Set(["BB"]));
    expect(results.statuses).toEqual({
      "BB": new Status("BB", new D9(400.0), 3, 'elected', K.ONE),
      "AA": new Status("AA", new D9(350.0), 3, 'defeated', K.ONE),
      "CC": new Status("CC", new D9(220.0), 2, 'defeated', K.ZERO),
      "DD": new Status("DD", new D9(190.0), 1, 'defeated', K.ZERO),
      "EE": new Status("EE", new D9(9.0), 1, 'defeated', K.ZERO),
    });
    expect(results.tally).toEqual({
      "BB": [new D9(250.0), new D9(250.0), new D9(400.0)],
      "AA": [new D9(300.0), new D9(300.0), new D9(350.0)],
      "CC": [new D9(200.0), new D9(220.0)],
      "DD": [new D9(190.0)],
      "EE": [new D9(9.0)],
      ":Votes for candidates": [new D9(949.0), new D9(770.0), new D9(750.0)],
      ":Overvotes": [new D9(0.0), new D9(0.0), new D9(0.0)],
      ":Abstentions": [new D9(0.0), new D9(179.0), new D9(179.0)],
      ":Other exhausted": [new D9(0.0), new D9(0.0), new D9(20.0)],
      ":Total votes": [new D9(949.0), new D9(949.0), new D9(949.0)],
      ":Quota": [new D9(474.500000001), new D9(385.000000001),
            new D9(375.000000001)],
      ":Total surplus": [new D9(0.0), new D9(0.0), new D9(24.999999999)],
      ":Iterations": [1, 1, 1]
    });
    let outFileText = await WithJson.readFile(outFileName);
    let expectedOutFileText = await WithJson.readFile(expectedOutFileName);
    expect(outFileText).toBe(expectedOutFileText);
  });
});

