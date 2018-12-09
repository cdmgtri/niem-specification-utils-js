
let debug = require("debug")("niem");

let NDR = require("./src/ndr/index");
let CodeLists = require("./src/code-lists/index");

let TypeDefs = require("./src/assets/typedefs/index");

let { NIEMRule } = TypeDefs;

class NIEMSpecs {

  static generateAllRules() {

    /** @type {NIEMRule[]} */
    let allRules = [];

    debug("\nCompiling specification rules into single rules file.");

    allRules.push( ...NDR.generateAllRules() );
    allRules.push( ...CodeLists.generateAllRules() );

    return allRules;
  }
}

NIEMSpecs.NDR = NDR;
NIEMSpecs.CodeLists = CodeLists;
NIEMSpecs.TypeDefs = TypeDefs;

module.exports = NIEMSpecs;
