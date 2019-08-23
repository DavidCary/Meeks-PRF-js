/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module ExcludedJsonTest
 * @summary JSON specified tests of excluded candidates
 */

import * as _TestFromFile from '../_test_from_file.js';

describe('excluded-001', () => {
  test('excluded 001_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_excluded/excl-001-1.json')
  });

  test('excluded 001_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_excluded/excl-001-2.json')
  });

  test('excluded 001_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_excluded/excl-001-3.json')
  });

  test('excluded 001_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_excluded/excl-001-4.json')
  });

  test('excluded 001_5', async () => {
    await _TestFromFile.runTestSpec('tests/test_excluded/excl-001-5.json')
  });

  test('excluded 001_6', async () => {
    await _TestFromFile.runTestSpec('tests/test_excluded/excl-001-6.json')
  });
});

