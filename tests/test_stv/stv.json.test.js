/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module StvJsonTest
 * @summary JSON specified tests of multi-winner STV contests
 */

import * as _TestFromFile from '../_test_from_file.js';

describe('stv-001', () => {
  test('stv_001', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-001.json')
  });
});

describe('stv-002', () => {
  test('stv_002_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-002-1.json')
  });

  test('stv_002_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-002-2.json')
  });

  test('stv_002_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-002-3.json')
  });
});

describe('stv-004', () => {
  test('stv_004', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-004.json')
  });
});

describe('stv-005', () => {
  test('stv_005', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-005.json')
  });

  test('stv_005_aa', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-005-aa.json')
  });

  test('stv_005_oo', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-005-oo.json')
  });

  test('stv_005_t1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-005-t1.json')
  });

  test('stv_005_ta', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-005-ta.json')
  });

  test('stv_005_to', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-005-to.json')
  });
});

describe('stv-006', () => {
  test('stv_006_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-006-1.json')
  });

  test('stv_006_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-006-2.json')
  });
});

describe('stv-007', () => {
  test('stv_007_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-007-1.json')
  });

  test('stv_007_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-007-2.json')
  });

  test('stv_007_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-007-3.json')
  });

  test('stv_007_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-007-4.json')
  });
});

describe('stv-008', () => {
  test('stv_008_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-008-1.json')
  });

  test('stv_008_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-008-2.json')
  });

  test('stv_008_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-008-3.json')
  });

  test('stv_008_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-008-4.json')
  });

  test('stv_008_5', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-008-5.json')
  });
});

describe('stv-020', () => {
  test('stv_020_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-020-1.json')
  });

  test('stv_020_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-020-2.json')
  });

  test('stv_020_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-020-3.json')
  });

  test('stv_020_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-020-4.json')
  });

  test('stv_020_5', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-020-5.json')
  });

  test('stv_020_6', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-020-6.json')
  });
});

describe('stv-021', () => {
  test('stv_021_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-021-1.json')
  });

  test('stv_021_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-021-2.json')
  });

  test('stv_021_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-021-3.json')
  });

  test('stv_021_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-021-4.json')
  });

  test('stv_021_5', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-021-5.json')
  });

  test('stv_101_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-101-1.json')
  });
});

describe('stv-022', () => {
  test('stv_022_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-022-1.json')
  });

  test('stv_022_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-022-2.json')
  });

  test('stv_022_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-022-3.json')
  });

  test('stv_022_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-022-4.json')
  });
});

describe('stv-023', () => {
  test('stv_023_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-023-1.json')
  });

  test('stv_023_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-023-2.json')
  });

  test('stv_023_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-023-3.json')
  });
});

describe('stv-024', () => {
  test('stv_024_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-024-1.json')
  });

  test('stv_024_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-024-2.json')
  });

  test('stv_024_3', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-024-3.json')
  });

  test('stv_024_4', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-024-4.json')
  });

  test('stv_024_5', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-024-5.json')
  });

  test('stv_024_6', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-024-6.json')
  });
});

