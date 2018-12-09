
let debug = require("debug")("niem");

let NDR = require("./src/ndr/index");

let TypeDefs = require("./src/assets/typedefs/index");

let { NIEMRule } = TypeDefs;

class NIEMSpecs {

  static generateAllRules() {

    /** @type {NIEMRule[]} */
    let allRules = [];

    debug("\nCompiling specification rules into single rules file.");

    allRules.push( ...NDR.generateAllRules() );

    return allRules;
  }
}

NIEMSpecs.NDR = NDR;
NIEMSpecs.TypeDefs = TypeDefs;

module.exports = NIEMSpecs;
