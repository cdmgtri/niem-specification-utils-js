
let debug = require("debug")("niem");

let NDR = require("./src/ndr/index");

let TypeDefs = require("./src/assets/typedefs/index");

let { NIEMRule } = TypeDefs;

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
NIEMSpecifications.TypeDefs = TypeDefs;

module.exports = NIEMSpecifications;
