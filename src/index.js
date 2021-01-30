
let utils = require("./utils");

let Specification = require("./specification");
let SpecificationSet = require("./set");

let NDR = require("./specification-ndr");
let IEPD = require("./specification-iepd");
let CodeLists = require("./specification-code-lists");
let CTAS = require("./specification-ctas");

let specificationData = require("../specificationData");

class NIEMSpecifications {

  constructor() {

    this.NDR = new SpecificationSet("NDR", "Naming and Design Rules");
    this.IEPD = new SpecificationSet("IEPD", "Information Exchange Package Description");
    this.CodeLists = new SpecificationSet("CodeLists", "Code Lists");
    this.CTAS = new SpecificationSet("CTAS", "Conformance Targets Attribute Specification");

    this.sets = [this.NDR, this.IEPD, this.CodeLists, this.CTAS];

  }

  /**
   * Load specification objects from a set of data fields
   */
  load() {

    let specificationClasses = {NDR, IEPD, CodeLists, CTAS};

    // Process each entry in the /specificationData.js file
    specificationData.forEach( entry => {

      let html = utils.specificationHTML(entry.tag || entry.setID, entry.version);

      /** @type {SpecificationSet} */
      let specificationSet = this[entry.setID];

      /** @type {Specification} */
      let SpecificationClass = specificationClasses[entry.setID];

      let specification = new SpecificationClass(specificationSet, entry.tag, entry.name, entry.version, entry.current, entry.url, html);

      specificationSet.specifications.push(specification);

    });

  }

  get rules() {
    return utils.flatten(this.sets.map( set => set.rules ));
  }

  get definitions() {
    return utils.flatten(this.sets.map( set => set.defs ));
  }

  /**
   * Saves rules and definitions for all NIEM specifications together (e.g,. `niem-rules.json`).
   * Also calls each specification set individually to save its rules and defs.
   *
   * @param {String} [folder='./output/'] - Folder to save output files.  Defaults to /output.
   */
  save(folder="./output/") {
    // Save all NIEM rules and definitions
    utils.save( NIEMSpecifications.fileName("all", "rules"), this.rules, folder);
    utils.save(NIEMSpecifications.fileName("all", "defs"), this.definitions, folder);

    // Save each set of rules and definitions
    this.sets.forEach( set => set.save(folder) );
  }

  /**
   * Returns the specification with the given ID.
   * @example "NDR-3.0"
   * @param {String} specificationID
   */
  specification(specificationID) {

    if (!specificationID.includes("-")) return;

    // Parse the specification tag and version from the specification ID
    let [tag, version] = specificationID.split("-");

    // Adjust the specification set for MPDs.
    let setID = tag.replace("MPD", "IEPD");

    /** @type {SpecificationSet} */
    let set = this[setID];

    if (set) {
      return set.version(version);
    }

  }

  /**
   * @param {"all"|"set"|"spec"} scope
   * @param {"rules"|"defs"} style
   * @param {"NDR"|"IEPD"|"MPD"|"CodeLists"|"CTAS"} label - Specification set ID or specification tag
   * @param {String} version
   */
  static fileName(scope, style, label, version) {
    switch (scope) {
      case "all":
        return `niem-${style}`.toLowerCase();
      case "set":
        return `${label.replace("MPD", "IEPD")}-${style}`.toLowerCase();
      case "spec":
        return `${label}-${style}-${version}`.toLowerCase();
    }
  }

  /**
   * Loads and parses NIEM specifications, and saves rules and definitions.
   *
   * @param {String} [folder='./output/'] - Folder to save output files.  Defaults to /output.
   */
  static parse(folder="./output/") {
    let niemSpecs = new NIEMSpecifications();
    niemSpecs.load();
    niemSpecs.save(folder);
    return niemSpecs;
  }

}

NIEMSpecifications.SpecificationSet = SpecificationSet;
NIEMSpecifications.Specification = Specification;
NIEMSpecifications.Rule = require("./rule");
NIEMSpecifications.Definition = require("./definition");

NIEMSpecifications.NDR = NDR;
NIEMSpecifications.IEPD = IEPD;
NIEMSpecifications.CodeLists = CodeLists;
NIEMSpecifications.CTAS = CTAS;

module.exports = NIEMSpecifications;
