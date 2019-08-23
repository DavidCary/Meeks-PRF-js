/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module StatusUnitTest
 * @summary Unit tests Status class
 */

import K from '../../src/constants.js';
import {Status} from '../../src/status.js';
const D9 = K.Decimal;

describe('Status creation', () => {
  test('create a Status with default values', () => {
    let status1 = new Status('A');
    expect(status1).not.toBeNull();
    expect(status1.candidate).toBe('A');
    expect(status1.votes).toMatchObject(K.ZERO);
    expect(status1.nbrRound).toBe(0);
    expect(status1.status).toBe(K.STATUS.hopeful);
    expect(status1.keepFactor).toBe(K.ONE);
    expect(status1.destiny).toBe(K.DESTINY.normal);
  });
  test('create a Status with non-default values', () => {
    let status1 = new Status('B', K.ONE.times(5), 3, 'elected',
      K.ONE.times(0.123456789), 'protected');
    expect(status1).not.toBeNull();
    expect(status1).toMatchObject({
      candidate: 'B',
      votes: new D9(5),
      nbrRound: 3,
      status: K.STATUS.elected,
      keepFactor: new D9(123456789, -9),
      destiny: K.DESTINY.protected,
    });
  });
  test('duplicate a Status', () => {
    let status1 = new Status('C', K.ONE.times(6), 2, 'defeated',
      K.ONE, 'normal');
    let status2 = new Status(status1);
    status1.nbrRound = 5;
    expect(status1).not.toBeNull();
    expect(status1.nbrRound).toBe(5);
    expect(status2).not.toBeNull();
    expect(status2).toMatchObject({
      candidate: 'C',
      votes: new D9(6),
      nbrRound: 2,
      status: K.STATUS.defeated,
      keepFactor: new D9(1),
      destiny: K.DESTINY.normal,
    });
  });
  test('create a Status with all default values', () => {
    let status1 = new Status();
    expect(status1).not.toBeNull();
    expect(status1.candidate).toBe(':???');
    expect(status1.votes).toMatchObject(K.ZERO);
    expect(status1.nbrRound).toBe(0);
    expect(status1.status).toBe(K.STATUS.hopeful);
    expect(status1.keepFactor).toBe(K.ONE);
    expect(status1.destiny).toBe(K.DESTINY.normal);
  });
});

describe('Status conversions', () => {
  test('convert to a simple object', () => {
    let status1 = new Status('D', K.ONE.times(8), 7, 'elected',
          K.ONE.times(0.54321),
          'normal');
    let statusSimple = status1.asSimpleObject();
    expect(statusSimple).not.toBeNull();
    expect(statusSimple).toMatchObject({
      candidate: 'D',
      votes: new D9(8),
      nbrRound: 7,
      status: K.STATUS.elected,
      keepFactor: new D9(54321, -5),
      destiny: K.DESTINY.normal,
    });
  });
  test('convert to an array', () => {
    let status1 = new Status('E', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let statusAsArray = status1.asArray();
    expect(statusAsArray).not.toBeNull();
    expect(statusAsArray).toMatchObject(
          ['E', K.STATUS.defeated, 6, new D9(11), new D9(1)]);
  });
  test('convert a non-normal status to an array', () => {
    let status1 = new Status('F', K.ONE.times(15.77), 4, 'hopeful', K.ONE,
          'protected');
    let statusAsArray = status1.asArray();
    expect(statusAsArray).not.toBeNull();
    expect(statusAsArray).toMatchObject(
          ['F', K.STATUS.hopeful, 4, new D9(15.77), new D9(1),
          K.DESTINY.protected]);
  });
  test('convert to a string', () => {
    let status1 = new Status('G', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let statusAsString = status1.toString();
    expect(statusAsString).not.toBeNull();
    expect(statusAsString).toBe('{candidate: "G", status: "defeated", ' +
          'nbrRound: 6, votes: 11.0, keepFactor: 1.0}');
  });
  test('convert a non-normal status to a string', () => {
    let status1 = new Status('H', K.ONE.times(15.77), 4, 'hopeful', K.ONE,
          'protected');
    let statusAsString = status1.toString();
    expect(statusAsString).not.toBeNull();
    expect(statusAsString).toBe('{candidate: "H", status: "hopeful", ' +
          'nbrRound: 4, votes: 15.77, keepFactor: 1.0, ' +
          'destiny: "protected"}');
  });
});

describe('Equality and inequality', () => {
  test('equality of default objects', () => {
    let status1 = new Status('I');
    let status2 = new Status('I');
    expect(status1.isEqual(status1)).toBe(true);
    expect(status1.isNotEqual(status1)).toBe(false);
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
  });
  test('equality of non-default Statuses', () => {
    let status1 = new Status('J', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let status2 = new Status('J', K.ONE.times(11), 6, 'defeated', new D9(1),
          'normal');
    expect(status1.isEqual(status1)).toBe(true);
    expect(status1.isNotEqual(status1)).toBe(false);
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
  });
  test('inequality of default Status', () => {
    let status1 = new Status('K');
    let status2 = new Status('L');
    expect(status1.isEqual(status2)).toBe(false);
    expect(status1.isNotEqual(status2)).toBe(true);
  });
  test('not equal due to votes', () => {
    let status1 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let status2 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.votes = K.ONE.times(11);
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.votes = K.ONE.times(17);
    expect(status1.isEqual(status2)).toBe(false);
    expect(status1.isNotEqual(status2)).toBe(true);
  });
  test('not equal due to nbrRound', () => {
    let status1 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let status2 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.nbrRound = 2 + 4;
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.nbrRound = 5 + 7;
    expect(status1.isEqual(status2)).toBe(false);
    expect(status1.isNotEqual(status2)).toBe(true);
  });
  test('not equal due to status', () => {
    let status1 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let status2 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.status = 'def' + 'eated';
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.status = 'hopeful';
    expect(status1.isEqual(status2)).toBe(false);
    expect(status1.isNotEqual(status2)).toBe(true);
  });
  test('not equal due to keepFactor', () => {
    let status1 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let status2 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.keepFactor = new D9(10, -1);
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.keepFactor = new D9(10, -2);
    expect(status1.isEqual(status2)).toBe(false);
    expect(status1.isNotEqual(status2)).toBe(true);
  });
  test('not equal due to destiny', () => {
    let status1 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    let status2 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.destiny = 'norm' + 'al';
    expect(status1.isEqual(status2)).toBe(true);
    expect(status1.isNotEqual(status2)).toBe(false);
    status2.destiny = 'Normal';
    expect(status1.isEqual(status2)).toBe(false);
    expect(status1.isNotEqual(status2)).toBe(true);
  });
  test('not equal due to being null', () => {
    let status1 = new Status('M', K.ONE.times(11), 6, 'defeated', K.ONE,
          'normal');
    expect(status1.isEqual(null)).toBe(false);

    expect(status1.isNotEqual(null)).toBe(true);
  });
});
