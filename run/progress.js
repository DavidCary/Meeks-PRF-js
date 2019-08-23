"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Progress = void 0;

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module Meek
 *
 * @summary Provide progress updates via a callback function.
 */
const FORCE_DELAY = 0; //const FORCE_DELAY = 10 * 1000 * 1000;

/** A class for handling progress reports from a `Tabulation` initialization
 * and its `tabulate()` function.
 */

class Progress {
  /**
   * @param {function} callback - The callback function that forwards
   *    progress reports from the tabulation functions.
   *
   *    The callback function is called with one parameter, a plain old data
   *    object with properties:
   *
   *    - `progressFraction` = A number between 0 and 100 inclusive, indicating
   *         the current percentage of work completed
   *    - `description` = A string that gives a description of the progress
   *         that is being made.
   */
  constructor(callback) {
    this.setCallback(callback);
    /** The minimum amount of delay in milliseconds until the first progress
     *    report can be sent.
     * @type {number} */

    this.firstDelay = 1; // all delays in ms

    /** The minimum amount of delay in milliseconds between sending successive
     *    progress reports, except when reporting completion of a major
     *    activity.
     * @type {number} */

    this.updateDelay = 100;
    /** Indicates whether a ballot tree is used.
     * @type {boolean} */

    this.isBallotTreeUsed = false;
    /** Indicates whether a dynamic ballot tree is used.
     * @type {boolean} */

    this.isDynamicTreeUsed = false;
    this.setNbrBallotGroups();
    this.setNbrOriginalHopefuls();
    this.startTimers();
    /** The amount of weight given to other activities.
     * @type {number} */

    this.otherBase = 1;
    /** The amount of other activities that are completed, using the same
     *    scale as `otherBase`.
     * @type {number} */

    this.otherCompleted = 0;
    /** A number indicating the fraction of progress on the current major
     *    activity.
     * @type {number}*/

    this.inProgress = 0;
    /** The number of original hopeful candidates that have been elected or
     * defeated.
     * @type {number} */

    this.nbrResolvedHopefuls = 0;
    /** The descriptive message that is sent with a progress report.
     * @type {string} */

    this.description = 'Tabulation started.';
    /** The amount of progress completed on the current major activity.
     * @type {number} */

    this.progress = 0;
    /** The number of ballot groups that Tabulation() should validate
     * between checking whether a progress report can be sent.
     * @type {number} */

    this.validationPeriod = 1001;
    /** The number of ballot groups that tabulate() should queue for
     *    building a tree between checking whether a progress report can be
     *    sent.
     * @type {number} */

    this.treeInitPeriod = 1001;
    /** The number of ballot groups that tabulate() should process while
     *    building a ballot tree  between checking whether a progress report
     *    can be sent.
     * @type {number} */

    this.treeBuildPeriod = 1001;
    /** A special value indicating that a segment of activity has completed.
     * @type {string} */

    this.completedLabel = 'COMPLETE';
    /** An indication of whether validation of ballot groups is complete.
     * @type {boolean} */

    this.validationComplete = false;
    /** An indication of whether the build of a ballot tree is complete.
     * @type {boolean} */

    this.buildComplete = false;
    /** An indication of whether the initialization for building a ballot tree
     *    is complete.
     * @type {boolean} */

    this.initComplete = false;
    /** A count of the maximum number of iterations in a round that has been
     *    experienced so far in the tabulation.
     * @type {number} */

    this.maxNbrIterations = 1;
  }
  /** Set the callback function.
   * @param {function} callback - The new callback function. */


  setCallback(callback) {
    /** The callback function that is used to send progress reports
     *    back to the requester.
     * @type {function} */
    this.callback = typeof callback == 'function' ? callback : null;
  }
  /** Start timers and the times at which the next status reports can be sent.
   * @parameter {Date} [now=Date.now()] - A time when the timer is deemed to
   * have started; not normally not provided, but useful for unit testing. */


  startTimers(now) {
    /** The time at which progress timing began.
     * @type {Date} */
    this.startTime = this.now = now || Date.now();
    this.updateTimers(this.now);
  }
  /** Update the times at which the next progress reports can be sent.
   * @parameter {Date} [now=Date.now()] - A time deemed to be the curent time;
   * not normally not provided, but useful for unit testing. */


  updateTimers(now) {
    now = this.now = now || Date.now();
    /** The earliest time that the first progress report can be sent.
     * @type {Date} */

    this.earliestFirstTime = now + this.firstDelay;
    this.setEarliestUpdateTime(now);
  }
  /** Update the times at which the next update progress report can be sent.
   * @parameter {Date} [now=Date.now()] - A time deemed to be the curent time;
   * not normally not provided, but useful for unit testing. */


  setEarliestUpdateTime(now) {
    now = this.now = now || Date.now();
    /** The earliest time at which the next update to a progress report can
     *    be sent.
     * @type {Date} */

    this.earliestUpdateTime = now + this.updateDelay;
  }
  /** Indicate that the tabulation will use a ballot tree and whether
   * the ballot tree is static or dynamic
   * @parameter {boolean} [isDynamic=false] - If true indicates that a
   *   dynamic ballot tree will be used, otherwise that a static ballot tree
   *   will be used. */


  useBallotTree(isDynamic = false) {
    this.isBallotTreeUsed = true;
    this.isDynamicTreeUsed = isDynamic;
    this.otherBase = 2;
  }
  /** Set the number of ballot groups that will be processed by the
   *    tabulation.
   * @parameter {number|falsey} [nbrBallotGroups=1] The number of ballot
   *   groups that will be processed by the tabulation. */


  setNbrBallotGroups(nbrBallotGroups = 1) {
    /** The number of ballot groups used in the tabulation
     * @type {number} */
    this.nbrBallotGroups = nbrBallotGroups || 1;
  }
  /** Set the original number of hopeful candidates for the tabulation
   * @parameter {number|falsey} [number=1] the original number of hopeful
   * candidates for the tabulation. */


  setNbrOriginalHopefuls(nbrOriginalHopefuls = 1) {
    /** The number of original hopeful candidates for the tabulation;
     *    The number of candidates that must be defeated or elected,
     *    possibly just one candidate per round, except for the last round.
     * @type {number} */
    this.nbrOriginalHopefuls = nbrOriginalHopefuls || 1;
  }
  /** Check whether enough time has elapsed that a next progress report can
   *    be sent.
   *    Optionally, and only for testing, force a busy-loop delay to slow down
   *    the activities.
   * @parameter {Date} [now=Date.now()] - A time deemed to be the curent time;
   *   not normally not provided, but useful for unit testing.
   * @return {boolean} A true/false indication of whether enough time has
   *   elapsed. */


  isTimeToUpdate(now) {
    if (FORCE_DELAY > 0) {
      let k = 537;

      for (let twix = 0; twix < FORCE_DELAY; twix++) {
        k = (k + 239) * 5317 % 293731;
      }
    }

    now = this.now = now || Date.now();
    const isTime = Boolean(this.callback) && now >= this.earliestFirstTime && now >= this.earliestUpdateTime;
    return isTime;
  }
  /** Check whether enough time has elapsed that a next progress report can
   *    be sent.
   *    If it has, send the progress report by calling the callback.
   * @parameter {Date} [now=Date.now()] - A time deemed to be the curent time;
   *   not normally not provided, but useful for unit testing.
   */


  checkToUpdate(now) {
    now = this.now = now || Date.now();

    if (!this.isTimeToUpdate(now)) {
      return;
    }

    const progressFraction = this.getProgressFraction();
    const response = {
      progressFraction: progressFraction,
      description: this.description
    };
    this.callback(response);
    this.setEarliestUpdateTime();
  }
  /** Calculate the progressFraction as a number between 0 and 100 inclusive,
   *    indicating how much total progress has been completed.
   * @return {number} The calculated progress Fraction. */


  getProgressFraction() {
    const maxNbrRounds = Math.max(1, this.nbrOriginalHopefuls - 1);
    const progressAmount = Math.min(this.otherCompleted, this.otherBase) + Math.min(this.inProgress, 1) + Math.min(this.nbrResolvedHopefuls, maxNbrRounds);
    const progressBase = Math.max(1, this.otherBase + maxNbrRounds);
    let result = progressAmount / progressBase;

    if (Number.isNaN(result)) {
      result = 0;
    }

    this.progress = Math.trunc(result * 10000) / 100;
    return result;
  }
  /** Set validation progress, subject to limits on frequency of sending
   * progress reports.
   * @param {number} progress - The number of ballot groups validated so far.
   */


  setValidationProgress(progress = 0) {
    if (progress === this.completedLabel) {
      this.inProgress = 0;
      this.description = 'Ballot validation complete.';

      if (!this.validationComplete) {
        this.validationComplete = true;
        this.otherCompleted += 1;
      }

      this.checkToUpdate();
    } else {
      if (this.isTimeToUpdate() && !this.validationComplete && Number.isInteger(progress) && progress >= 0) {
        this.inProgress = progress / this.nbrBallotGroups;
        this.description = 'Ballot validation: ' + progress + ' ballot groups, ' + (Math.trunc(this.inProgress * 1000) / 10).toFixed(1) + '%';
        this.checkToUpdate(this.now);
      }
    }
  }
  /** Set ballot tree build progress, subject to limits on frequency of sending
   * progress reports.
   * @param {number} progress - The number of ballot groups built so far.
   */


  setTreeBuildProgress(progress = 0) {
    if (progress === this.completedLabel) {
      this.inProgress = 0;
      this.description = 'Build ballot tree complete.';

      if (!this.buildComplete) {
        this.buildComplete = true;
        this.otherCompleted += this.isDynamicTreeUsed ? 0.5 : 1;
      }

      this.checkToUpdate();
    } else {
      if (this.isTimeToUpdate() && !this.buildComplete && Number.isInteger(progress) && progress >= 0) {
        this.inProgress = progress / this.nbrBallotGroups;
        this.description = 'Build ballot tree: ' + progress + ' ballot groups, ' + (Math.trunc(this.inProgress * 1000) / 10).toFixed(1) + '%';
        this.inProgress /= this.isDynamicTreeUsed ? 2 : 1;
        this.checkToUpdate(this.now);
      }
    }
  }
  /** Set ballot tree initialization progress, subject to limits on
   *   frequency of sending progress reports.
   * @param {number} progress - The number of ballot groups initialized so far.
   */


  setDynamicTreeInitProgress(progress = 0) {
    if (progress === this.completedLabel) {
      this.inProgress = 0;
      this.description = 'Init for ballot tree complete.';

      if (!this.initComplete) {
        this.initComplete = true;
        this.otherCompleted += 0.5;
      }

      this.checkToUpdate();
    } else {
      if (this.isTimeToUpdate() && !this.initComplete && Number.isInteger(progress) && progress >= 0) {
        this.inProgress = progress / this.nbrBallotGroups;
        this.description = 'Init for ballot tree: ' + progress + ' ballot groups, ' + (Math.trunc(this.inProgress * 1000) / 10).toFixed(1) + '%';
        this.inProgress /= 2;
        this.checkToUpdate(this.now);
      }
    }
  }
  /** Set progress running iterations within a round, subject to limits on
   *   frequency of sending progress reports.
   * @param {number} nbrRound - The number of the round being tabulated.
   * @param {number} nbrIteration - The number of the iteration just completed.
   * @param {number} nbrHopefuls - The number of remaining hopeful candidates.
   */


  setIterationProgress(nbrRound, nbrIteration, nbrHopefuls) {
    if (nbrIteration > this.maxNbrIterations) {
      this.maxNbrIterations = nbrIteration;
    }

    this.inProgress = (nbrIteration + (this.isDynamicTreeUsed ? 1 : 0)) / ((this.maxNbrIterations + 3 + (this.isDynamicTreeUsed ? 1 : 0)) * 1.1);
    this.description = 'Round ' + nbrRound + ' iteration ' + nbrIteration + ' : ' + nbrHopefuls + ' hopefuls remain.';
    this.checkToUpdate();
  }
  /** Set progress running rounds and
   *    reducing the number of hopeful candidates, subject to limits on
   *    the frequency of sending progress reports.
   * @param {number} nbrRound - The number of the round nearly completed.
   * @param {number} nbrIteration - The number of the iteration just completed.
   * @param {number} nbrHopefuls - The number of remaining hopeful candidates.
   */


  setRoundProgress(nbrRound, nbrIteration, nbrHopefuls) {
    if (!this.callback) {
      return;
    }

    if (nbrIteration > this.maxNbrIterations) {
      this.maxNbrIterations = nbrIteration;
    }

    this.inProgress = 0;
    this.nbrResolvedHopefuls = this.nbrOriginalHopefuls - nbrHopefuls;
    this.description = 'Round ' + nbrRound + ' complete : ' + nbrHopefuls + ' hopefuls remain.';
    this.checkToUpdate();
  }

}

exports.Progress = Progress;
var _default = Progress;
exports.default = _default;