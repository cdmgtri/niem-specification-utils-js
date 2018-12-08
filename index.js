
let debug = require("debug")("niem");

let NDR = require("./src/ndr/index");

let { NIEMRule } = require("./jsdocs/index");

class NIEMSpecifications {

  static generateAllRules() {

    /** @type {NIEMRule[]} */
    let allRules = [];

    debug("\nCompiling specification rules into single rules file.");

    allRules.push( ...NDR.generateAllRules() );

    return allRules;
  }
}

NIEMSpecifications.NDR = NDR;

module.exports = NIEMSpecifications;
