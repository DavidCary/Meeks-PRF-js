/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module WithJson
 *
 * @summary Tabulate using JSON files as input and output
 */

import K from "./constants.js";
import Results from "./results.js";
import * as Meek from "./meek.js";
import {MeekValueError, MeekImplementationError, describeError}
      from "./errors.js";
import {Status} from './status.js';
import {Validator} from './validate.js';
//import Version from './index.js';

import * as fs from 'fs';
//import * as fsp from 'fs/promises';

const fsp = fs.promises;
const D9 = K.Decimal;


/** A class with static functions for tabulating with JSON files. */
class WithJson {

  /**
   * Tabulate an Meek contest using JSON files for input and output.
   *
   * This facilitates doing file-based tabulations from the command line.
   *
   * @param {string|File|null} [inputJson='']
   *   A string name of a file or an opened file that is read to get a
   *   JSON specification of the tabulation to be performed.
   *   If the value is an empty string, standard input is read.
   *   If the value is null, nothing is read.
   *
   *   The JSON specification should be a JSON object with names that
   *   correspond to the parameters of `Meek.Tabulation()`
   *   initialization.
   *
   *   Additional names may be specified.
   *   Some that are recognized include:
   *
   * - 'description'
   *
   *    A description of the contest being tabulated.
   *
   * - 'include'
   *
   *   An array of additional input JSON file names that are read.
   *   The name and value pairs in an included file are subject to being
   *   overridden by subsequent file names in the array of included file
   *   names and also, ultimately, by contents of the inputJson file.
   *
   *   Files can only be included by the inputJSON file.
   *   Any include value from an included file is ignored.
   *
   * @param {string|File|null} [outputJson='']
   *   A string name of a file or an opened file that is written to with a
   *   JSON specification of the tabulation results.
   *   If the value is an empty string, results are written to standard
   *   output.
   *   If the value is null, nothing is written.
   *   The JSON specification of the tabulation result is a JSON object
   *   with the following names:
   *
   * - 'elected'
   *
   *     An array of winners, corresponding to the first value returned by
   *     Meek.Tabulation().tabulate().
   *
   * - 'status'
   *
   *     An array of status values, each expressed as an array,
   *     corresponding to the values of the second value returned by
   *     `Meek.Tabulation().tabulate()`.
   *     The status values are listed in the following order:  candidate,
   *     status, nbrRound, votes, keepValue, and destiny.
   *     The destiny value is omitted if it is 'normal'.
   *     Votes and keepValues are expressed as JSON numbers.
   *
   * - 'tally'
   *
   *     An object of tally values, corresponding to the third value
   *     returned by `Meek.Tabulation().tabulate()`.
   *
   * - 'description'
   *
   *     A string value of the input 'description' value, if a non-empty
   *     description value string was provided.
   *     Otherwise, this name is not included in the JSON output.
   *
   * @param {string|File|null} [defaultJson=null]
   *   A str name of a file or an opened file that is read to provide
   *   default values for inputJson specification before that file is
   *   read.
   *   If the value is an empty string, standard input is read.
   *   If the value is null, no attempt to read defaults is made.
   *   If both this value and the inputJson value are empty strings,
   *   this value is treated as if it were null.
   *
   *   The JSON in the file should be a JSON object with any of the same
   *   names and values that could be used by the inputJSON file.
   *   The values in this file are overridden by corresponding values
   *   in the inputJSON file and its include files.
   *
   *   The include name is recognized from this file,
   *   but its value may be overridden by an include value
   *   specified in the inputJson file.
   *
   * @return {array}
   *
   * A two-element array consisting of the results object returned by the
   * `Meek.Tabulation().tabulate()` function,
   * and a data object with the input values built from inputJson and
   * defaultJson files and their include files.
   *
   * @throws {Error}
   *
   * The same as the `Meek.Tabulation().tabulate()` method,
   * plus other exceptions that might be related to accessing files to
   * build the tabulation specification or to store its results.
   *
   */
  static async tabulate(inputJson='', outputJson='', defaultJson=null) {
    const [tabulateArgs, tabulationSpec] = await WithJson.buildTabulateArgs(
          inputJson, defaultJson);
    let description = null;
    if ('description' in tabulationSpec) {
      description = tabulationSpec.description;
    }
    const results = new Meek.Tabulation(...tabulateArgs)
          .tabulate();
    const jsonStr = WithJson.resultsToJsonString(
          results, description);
    await WithJson.writeFile(outputJson, jsonStr);
    return [results, tabulationSpec];
  }

  /**
   * Convert tabulation results to a JSON string.
   *
   * @param {Results} results
   *   The results returned by the `Meek.Tabulation.tabulate()` function.
   *
   * @param {string|null|boolean} description
   *   A string that is that describes the tabulation.
   *   This is typically supplied from the tabulation's input
   *   specification or from the value returned by this module's
   *   `tabulate()` function.
   *   Values of null and false may be supplied to indicate the lack
   *   of a description.
   *
   * @return {string}
   * A JSON string which represents the function arguments.
   *
   * @throws {Error}
   * This can raise various exceptions if the function arguments are not
   * of the anticipated structure.
   */
  static resultsToJsonString(results, description) {
    let descriptionStr = '';
    if (description !== null) {
      descriptionStr = '  "description": ' + JSON.stringify(description);
      descriptionStr += '\n';
    }

    const electedStr = results.getElectedAsString(description ? ',' : '') +
          '\n';
    const statusStr = results.getStatusesAsString(',') +
          '\n';
    const tallyStr = results.getTallyAsString(',') + '\n';
    const jsonStr = '{\n' +
          descriptionStr + electedStr + statusStr + tallyStr + '}\n'
    return jsonStr;
  }

  /**
   * From JSON files, build tabulation args and specification.
   *
   * @param {string|File|null} inputJson
   * The same as for the inputJson parameter for this module's
   * `tabulate()` function.
   *
   * @param {string|File|null} defaultJson
   * The same as for the defaultJson parameter for this module's
   * `tabulate()` function.
   *
   * @return {array}
   * An array with tw values:
   *
   * + An array of tabulation args that can be passed to
   *     `Meek.Tabulation().tabulate()`
   *
   * + A data object with the aggregated input for a Meek tabulation.
   *   Additional keys and values may be ignored or used only for testing.
   *
   * @throws {Error}
   * Various exceptions may be thrown which are related to reading JSON
   * files.
   */
  static async buildTabulateArgs(inputJson, defaultJson) {

    const tabulationSpec = await WithJson.readTabulationSpec(
          inputJson, defaultJson);
    let argBallots = tabulationSpec['ballots'];
    if ('ballotsMore' in tabulationSpec) {
      argBallots = Array.from(argBallots);
      argBallots = argBallots.concat(
            Array.from(tabulationSpec['ballotsMore']));
    }
    const tabulateArgs = [
          tabulationSpec['nbrSeatsToFill'],
          tabulationSpec['candidates'],
          argBallots,
          tabulationSpec['maxRankingLevels'],
          tabulationSpec['tieBreaker'],
          tabulationSpec['excluded'],
          tabulationSpec['protected'],
          tabulationSpec['options']
          ];
    return [tabulateArgs, tabulationSpec];
  }

  /**
   * Write text to a file.
   *
   * @param {string|File|null} fileName
   * The name of the file to write to.
   *
   * Write to stdout if this is the empty string.
   *
   * @param {string} text
   * The text to be written.
   *
   * @throws {Error}
   * Various exceptions related to writing to a file.
   */
  static async writeFile(fileName, text) {
    if (fileName == '') {
      process.stdout.write(text);
    } else if (fileName === null) {
    } else {
      await new Promise((resolve, reject) => {
        fs.writeFile(fileName, text, 'utf8', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      }).then((data) => {
        return data;
      });
    }
  }

  /**
   * Read text from a file.
   *
   * @param {string|File|null} fileName
   * The name of the file to read from.
   *
   * Read from stdin if this is the empty string.
   *
   * @return {string}
   * The text that was read.
   *
   * @throws {Error}
   * Various exceptions related to reading from a file.
   */
  static async readFile(fileName) {
    let text = '';
    //console.debug(fs);
    if (fileName == '') {
      text = fs.readFileSync(0, 'utf8');
    } else if (fileName === null) {
    } else {
      let readPromise = new Promise(async (resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
      text = await readPromise;
      //await console.debug('readFile text set with await');
      /*
      .then(data => {
        text = data;
        console.debug('setting readFile text with then');
        //console.debug('readFile text="'+text+'"<<<');
      });
      */
    }
    //await console.debug('returning readFile text');
    return text;
  }

  /**
   * Read text from a file and parse it as JSON data.
   *
   * @param {string|File|null} fileName
   * The name of the file to read from.
   *
   * Read from stdin if this is the empty string.
   *
   * @return {*}
   * The data value parsed from JSON text that was read.
   *
   * @throws {Error}
   * Various exceptions related to reading from a file and parsing it
   * as JSON data.
   */
  static async readJson(fileName) {
    const text = await WithJson.readFile(fileName);
    //console.debug('readJson text='+Meek._show(text));
    if (text == '') {
      return {};
    }
    const jsonResult = JSON.parse(text);
    return jsonResult;
  }

  /**
   * Optionally read text from a file and parse it as JSON data.
   *
   * If the file does not exist return an empty JSON object.
   *
   * @param {string} fileName
   * The name of the file to read from, if it exists
   *
   * @return {*}
   * The data value parsed from JSON text that was read,
   * or an empty data object if the file does not exist.
   *
   * @throws {Error}
   * Various exceptions related to reading from a file and parsing it
   * as JSON data.
   */
  static async readOptionalJson(fileName) {
    const result = {};
    if (typeof fileName == 'string' && fileName != '' &&
          fs.existsSync(fileName)) {
      const fileResult = await WithJson.readJson(fileName);
      Object.assign(result, fileResult);
    }
    return result;
  }

  /**
   * From JSON files, read the tabulation specification.
   *
   * The order of building test specs, with later values overriding earlier
   * values:
   *
   * - hard-coded default values
   * - values in the defaultJson file
   * - values from the included files in the order listed
   * - values from the inputJson file
   *
   * However, a list of include files is only taken from the primary JSON
   * file.
   *
   * @param {string|File|null} inputJson
   * The same as for the inputJson parameter for this module's
   * `tabulate()` function.
   *
   * @param {string|File|null} defaultJson
   * The same as for the defaultJson parameter for this module's
   * `tabulate()` function.
   *
   * @return {Object}
   * A data object with the merged tabulation specification.
   *
   * @throws {Error}
   * Various exceptions may be thrown which are related to reading JSON
   * files.
   */
  static async readTabulationSpec(inputJson, defaultJson) {
    const tabulationSpec = {
          'description': 'Test description not provided.',
          'nbrSeatsToFill': 0,
          'candidates': '',
          'ballots': [],
          'maxRankingLevels': 0,
          'tieBreaker': '',
          'options': {},
          'elected': '',
          'statusCodes': [],
          'tally': {},
          'excluded': [],
          'protected': [],
          };
    if (defaultJson !== null && defaultJson !== undefined &&
          !(defaultJson == '' && inputJson == '')) {
      const defaultSpec = await WithJson.readOptionalJson(defaultJson);
      Object.assign(tabulationSpec, defaultSpec);
    }
    /*
    */
    const primarySpec = await WithJson.readJson(inputJson);
    //console.debug('primarySpec='+Meek._show(primarySpec));
    let includeList = [];
    if ('include' in primarySpec) {
      includeList = primarySpec['include'];
    }
    //console.debug('includeList='+Meek._show(includeList));
    //await includeList.forEach(async (includeInputJson) => {
    for (let iix in includeList) {
      const includeInputJson = includeList[iix];
      //console.debug('iix='+iix+' includeInputJson='+includeInputJson);
      const includeSpec = await WithJson.readJson(includeInputJson);
      Object.assign(tabulationSpec, includeSpec);
    }  //);
    /*
    */
    Object.assign(tabulationSpec, primarySpec);
    return tabulationSpec;
  }

  /**
   * Tabulate using command-line argument JSON file names
   *
   * First check whether the module appears to be running under Node,
   * so that Node's `process.argv` array can be used to retrieve
   * the command line arguments.
   */
  static cliTabulate() {
    if (process && process.argv &&
          Array.isArray(process.argv) &&
      process.argv.length >= 2) {
      if (process.argv.length > 3) {
        WithJson.tabulate(process.argv[2], process.argv[3]);
      } else if (process.argv.length > 2) {
        if (process.argv[2] === '--version') {
          process.stdout.write('Version ' + K.VERSION_STRING + '\n');
        } else {
          WithJson.tabulate(process.argv[2], '');
        }
      }
    }
  }

}

export default WithJson;

/* Check whether this module is the top level module running in Node,
 * and if so, do a JSON file-based tabulation
 * using the command-line arguments.
 */
if (require && require.main && module &&
      require.main === module &&
      process && process.argv &&
      Array.isArray(process.argv) && process.argv.length >= 2) {
  WithJson.cliTabulate();
}

