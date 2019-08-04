
let debug = require("debug")("niem");

let NIEMSpec = require("./src/index");
let NDR = require("./src/ndr/index");
let MPD = require("./src/mpd/index");
let CodeLists = require("./src/code-lists/index");

let TypeDefs = require("./src/assets/typedefs/index");

let { NIEMRule, NIEMDefinition } = TypeDefs;

let specs = [NDR, MPD, CodeLists];

class NIEMSpecs {

  static generateAllRules() {

    /** @type {NIEMRule[]} */
    let allRules = [];

    debug("\nCompiling specification rules into single rules file.");

    specs.forEach( spec => {
      let rules = spec.generateAllRules();
      allRules.push(...rules);
    });

    return allRules;
  }

  static generateAllDefinitions() {

    /** @type {NIEMDefinition[]} */
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
    switch (specID) {
      case "NDR":
        return new NDR(version, "");
      case "MPD":
        return new MPD(version, "");
      case "CL":
      case "CodeLists":
        return new CodeLists(version, "");
    }
  }

}

NIEMSpecs.NDR = NDR;
NIEMSpecs.MPD = MPD;
NIEMSpecs.CodeLists = CodeLists;

NIEMSpecs.TypeDefs = TypeDefs;

module.exports = NIEMSpecs;
