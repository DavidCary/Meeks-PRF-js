"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bigInteger = _interopRequireDefault(require("big-integer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright 2016-2019 David Cary;
 * @license Apache-2.0
 *
 * @module big-integer
 * @summary A shim for npm big-integer package.
 * @description This module provides redirection to the big-integer.
 *   This module allows the location, name, and version of the big-intger
 *   module to change without impacting other modules.
 *
 *   When used with browsers, a customized version of the big-integer module
 *   may be needed in order to avoid conflicts with other development tools.
 *
 *   In that case, the custom version of big-integer is hosted in the same
 *   directory as this module, instead of in a standard npm node_modules
 *   directory.
 *   The customization removes features that support other of module types
 *   which are not needed by this implementation.
 */
var _default = _bigInteger.default;
exports.default = _default;