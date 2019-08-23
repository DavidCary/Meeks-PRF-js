/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module VolJson001Test
 * @summary JSON specified tests of multi-winner STV contests
 */

import * as _TestFromFile from '../_test_from_file.js';

describe.only('vol-001', () => {
  test('vol_001', async () => {
    await _TestFromFile.runTestSpec('tests/test_volume/vol-001.json')
  });
});

/** /
describe.only('vol-001B', () => {
  test('vol_001B', async () => {
    await _TestFromFile.runTestSpec('tests/test_volume/vol-001B.json')
  });
});
/**/
/** /
describe.only('vol-001C', () => {
  test('vol_001C', async () => {
    await _TestFromFile.runTestSpec('tests/test_volume/vol-001C.json')
  });
});
/**/
