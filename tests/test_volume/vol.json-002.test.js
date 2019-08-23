/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module VolJson002Test
 * @summary JSON specified tests of multi-winner STV contests
 */

import * as _TestFromFile from '../_test_from_file.js';

describe('vol-002', () => {
  test('vol_002', async () => {
    await _TestFromFile.runTestSpec('tests/test_volume/vol-002.json')
  });
});

