/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module StvAltDefJsonTest
 * @summary JSON specified tests of multi-winner STV contests
 */

import * as _TestFromFile from '../_test_from_file.js';

/** /
describe('stv-001', () => {
  test('stv_001', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv/stv-001.json')
  });
});

/**/
describe('stv-000', () => {
  test('stv_altdef_000_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-000-1.json')
  });

  test('stv_altdef_000_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-000-2.json')
  });

  test('stv_altdef_000_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-000-prr.json')
  });

  test('stv_altdef_000_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-000-bsd.json')
  });

  test('stv_altdef_000_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-000-inne.json')
  });
});

describe('stv-001', () => {
  test('stv_altdef_001_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-001-1.json')
  });

  test('stv_altdef_001_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-001-2.json')
  });

  test('stv_altdef_001_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-001-prr.json')
  });

  test('stv_altdef_001_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-001-bsd.json')
  });

  test('stv_altdef_001_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-001-inne.json')
  });
});

describe('stv-002', () => {
  test('stv_altdef_002_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-002-1.json')
  });

  test('stv_altdef_002_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-002-2.json')
  });

  test('stv_altdef_002_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-002-prr.json')
  });

  test('stv_altdef_002_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-002-bsd.json')
  });

  test('stv_altdef_002_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-002-inne.json')
  });
});

describe('stv-003', () => {
  test('stv_altdef_003_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-003-1.json')
  });

  test('stv_altdef_003_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-003-2.json')
  });

  test('stv_altdef_003_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-003-prr.json')
  });

  test('stv_altdef_003_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-003-bsd.json')
  });

  test('stv_altdef_003_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-003-inne.json')
  });
});

describe('stv-004', () => {
  test('stv_altdef_004_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-004-1.json')
  });

  test('stv_altdef_004_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-004-2.json')
  });

  test('stv_altdef_004_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-004-prr.json')
  });

  test('stv_altdef_004_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-004-bsd.json')
  });

  test('stv_altdef_004_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-004-inne.json')
  });
});

describe('stv-005', () => {
  test('stv_altdef_005_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-005-1.json')
  });

  test('stv_altdef_005_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-005-2.json')
  });

  test('stv_altdef_005_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-005-prr.json')
  });

  test('stv_altdef_005_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-005-bsd.json')
  });

  test('stv_altdef_005_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-005-inne.json')
  });
});

describe('stv-011', () => {
  test('stv_altdef_011_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-011-1.json')
  });

  test('stv_altdef_011_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-011-2.json')
  });
});

describe('stv-012', () => {
  test('stv_altdef_012_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-012-1.json')
  });

  test('stv_altdef_012_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-012-2.json')
  });
});

describe('stv-013', () => {
  test('stv_altdef_013_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-013-1.json')
  });

  test('stv_altdef_013_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-013-2.json')
  });

  test('stv_altdef_013_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-013-prr.json')
  });

  test('stv_altdef_013_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-013-bsd.json')
  });

  test('stv_altdef_013_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-013-inne.json')
  });
});

describe('stv-014', () => {
  test('stv_altdef_014_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-014-1.json')
  });

  test('stv_altdef_014_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-014-2.json')
  });

  test('stv_altdef_014_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-014-prr.json')
  });

  test('stv_altdef_014_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-014-bsd.json')
  });

  test('stv_altdef_014_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-014-inne.json')
  });
});

describe('stv-015', () => {
  test('stv_altdef_015_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-015-1.json')
  });

  test('stv_altdef_015_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-015-2.json')
  });

  test('stv_altdef_015_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-015-prr.json')
  });

  test('stv_altdef_015_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-015-bsd.json')
  });

  test('stv_altdef_015_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-015-inne.json')
  });
});

describe('stv-016', () => {
  test('stv_altdef_016_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-016-1.json')
  });

  test('stv_altdef_016_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-016-2.json')
  });

  test('stv_altdef_016_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-016-prr.json')
  });

  test('stv_altdef_016_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-016-bsd.json')
  });

  test('stv_altdef_016_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-016-inne.json')
  });
});

describe('stv-017', () => {
  test('stv_altdef_017_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-017-1.json')
  });

  test('stv_altdef_017_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-017-2.json')
  });

  test('stv_altdef_017_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-017-prr.json')
  });

  test('stv_altdef_017_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-017-bsd.json')
  });

  test('stv_altdef_017_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-017-inne.json')
  });
});

  //# for test conditions for test_altdef_018*, see altdef test 13

describe('stv-019', () => {
  test('stv_altdef_019_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-019-1.json')
  });

  test('stv_altdef_019_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-019-2.json')
  });

  test('stv_altdef_019_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-019-prr.json')
  });

  test('stv_altdef_019_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-019-bsd.json')
  });

  test('stv_altdef_019_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-019-inne.json')
  });
});

describe('stv-020', () => {
  test('stv_altdef_020_1', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-020-1.json')
  });

  test('stv_altdef_020_2', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-020-2.json')
  });

  test('stv_altdef_020_prr', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-020-prr.json')
  });

  test('stv_altdef_020_bsd', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-020-bsd.json')
  });

  test('stv_altdef_020_inne', async () => {
    await _TestFromFile.runTestSpec('tests/test_stv_altdef/altdef-020-inne.json')
  });
});

