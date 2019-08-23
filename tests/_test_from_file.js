/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module TestFromFile
 * @summary Run test cases based on JSON files
 */

import * as _TestAids from './_test_aids.js';
import WithJson from '../src/with_json.js';
import * as Meek from '../src/meek.js';
import Results from '../src/results.js';
import {UBF} from '../src/util_basic.js';
import * as Validate from '../src/validate.js';
import K from '../src/constants.js';
import {Progress} from '../src/progress.js';
import {describeError} from '../src/util_basic.js';

export async function runTestSpec(inputJson) {
  /*"""
  Run a test case using test specs from a JSON text file
  """
  */
  let [tabulateArgs, testSpec] = await WithJson.buildTabulateArgs(
        inputJson, 'all-tests-spec.json');
  /*
  if 'maxDiff' in testSpec:
    maxDiff = testSpec['maxDiff']
    if maxDiff is None:
      testCase.maxDiff = None
    if type(maxDiff) == int and maxDiff >= 0:
      testCase.maxDiff = maxDiff
  */

  let printDescription = false;
  if ('printDescription' in testSpec) {
    printDescription = testSpec.printDescription;
  }
  if (printDescription) {
    print('\n  """' + testSpec['description'] + '"""')
  }
  if ('exception' in testSpec) {
    let [exceptionType, exceptionMessage] = testSpec['exception'];
    _TestAids._expectError((() =>
          new Meek.Tabulation(...tabulateArgs).tabulate()),
          null, new RegExp(exceptionMessage));
  } else {
    let expectedElected = Validate.Validator.toArrayOfStrings(
          testSpec['elected']);
    let expectedStatus = _TestAids.buildExpectedStatus(
          testSpec['statusCodes'])
    let expectedTally = {};
    UBF.getOwnItems(testSpec['tally']).forEach((item) => {
      let category = item.name;
      let value = item.value;
      if (Array.isArray(value)) {
        if (category != K.LABEL.nbrIterations) {
          value = value.map(votes => new K.Decimal(votes));
        }
      }
      expectedTally[category] = value;
    });
    let startTime = Date.now();
    /** /
    let consoleCallback = (response => {
      console.debug('progress @'+((Date.now()-startTime)/1000).toFixed(3)+
            ': '+JSON.stringify(response));
    });
    let progress = new Progress(consoleCallback);
    progress.updateDelay = 500;
    tabulateArgs.push(progress);  //consoleCallback);
    /* */
    let results;
    try {
      results = new Meek.Tabulation(...tabulateArgs)
            .tabulate(/*{stopAtBegin: 3}*/);
    }
    catch (exc) {
      console.debug('Unexpected tabulation exception:');
      console.debug(String(exc));
      console.debug(describeError(exc));
      throw exc;
    }
    let elapsedTime = (Date.now() - startTime) / 1000;
    if ('printResults' in testSpec && testSpec['printResults']) {
      printElected(results.elected);
      Results.printStatus(results.statuses);
      Results.printTally(results.tally, results.statuses);
      let description = null;
      if ('description' in testSpec) {
        description = testSpec['description'];
      }
      let jasonStr = WithJson.resultsToJsonString(results,
            //stats,
            description);
      console.log(jasonStr);
    }
    if (testSpec.showElapsedTime) {
      console.log('tabulation elapsed time = '+elapsedTime.toFixed(3));
    }
    let statusDict = {};
    let statusItems = UBF.getOwnItems(results.statuses);
    statusItems.forEach((item) => {
      statusDict[item.name] = item.value.asSimpleObject();
    });
    expect(results.tally).toEqual(expectedTally);
    expect(statusDict).toEqual(expectedStatus);
    expect(new Set(Array.from(results.elected)))
          .toEqual(new Set(Array.from(expectedElected)));
  }
}

//# The following are convenience debugging methods

function printElected(elected) {
  /*"""
  Print a list of elected candidates; for debugging
  """
  */
  console.log('elected:'+UBF.show(Array.from(elected).sort()));
}

