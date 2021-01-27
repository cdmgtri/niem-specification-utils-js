
let debug = require("debug")("niem");

let NDR = require("./src/ndr/index");
let MPD = require("./src/mpd/index");
let CodeLists = require("./src/code-lists/index");

let TypeDefs = require("./src/assets/typedefs/index");

let { RuleType, DefinitionType } = TypeDefs;

let specs = [NDR, MPD, CodeLists];

class NIEMSpecs {

  static generateAllRules() {

    /** @type {RuleType[]} */
    let allRules = [];

    debug("\nCompiling specification rules into single rules file.");

    specs.forEach( spec => {
      let rules = spec.generateAllRules();
      allRules.push(...rules);
    });

    return allRules;
  }

  static generateAllDefinitions() {

    /** @type {DefinitionType[]} */
    let allDefs = [];

    debug("\nCompiling specification defs into single defs file.");

    specs.forEach( spec => {
      let defs = spec.generateAllDefinitions();
      allDefs.push(...defs);
    });

    return allDefs;
  }

  /**
   * Creates a new specification object with the given spec ID and version.
   *
   * @param {"NDR"|"MPD"|"CodeLists"|"CL"} specID
   * @param {String} version
   */
  static create(specID, version) {
    let Spec = getSpecificationClass(specID);
    return new Spec(version, "");
  }

  /**
   * Returns a URL to the specification rule
   *
   * @param {"NDR"|"MPD"|"CodeLists"|"CL"} specID
   * @param {String} version
   * @param {String} number - Rule number
   */
  static ruleURL(specID, version, number) {
    let Spec = getSpecificationClass(specID);
    return Spec ? Spec.ruleURL(version, number) : undefined;
  }

  /**
   * Returns a URL to the specification definition
   *
   * @param {"NDR"|"MPD"|"CodeLists"|"CL"} specID
   * @param {String} version
   * @param {String} term - Definition term
   */
  static defURL(specID, version, term) {
    let Spec = getSpecificationClass(specID);
    return Spec.defURL(version, term);
  }

}

function getSpecificationClass(specID) {
  switch (specID) {
    case "NDR":
      return NDR;
    case "MPD":
      return MPD;
    case "CL":
    case "CodeLists":
      return CodeLists;
  }
}

NIEMSpecs.NDR = NDR;
NIEMSpecs.MPD = MPD;
NIEMSpecs.CodeLists = CodeLists;

NIEMSpecs.TypeDefs = TypeDefs;

module.exports = NIEMSpecs;
