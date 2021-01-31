
let utils = require("./utils");

let Specification = require("./specification");
let SpecificationClass = require("./specification-class");

let NDR = require("./specification-ndr");
let IEPD = require("./specification-iepd");
let CodeLists = require("./specification-code-lists");
let CTAS = require("./specification-ctas");

let specificationData = require("../specificationData");

/**
 * Information about the set of NIEM specifications.
 */
class NIEMSpecifications {

  constructor() {

    this.NDR = new SpecificationClass("NDR", "Naming and Design Rules");
    this.IEPD = new SpecificationClass("IEPD", "Information Exchange Package Description");
    this.CodeLists = new SpecificationClass("CodeLists", "Code Lists");
    this.CTAS = new SpecificationClass("CTAS", "Conformance Targets Attribute Specification");

    this.specificationClasses = [this.NDR, this.IEPD, this.CodeLists, this.CTAS];

  }

  /**
   * Load specification objects from a set of data fields
   */
  load() {

    let specificationClasses = {NDR, IEPD, CodeLists, CTAS};

    // Process each entry in the /specificationData.js file
    specificationData.forEach( entry => {

      let html = utils.readSpecificationHTMLText(entry.tag || entry.classID, entry.version);

      /** @type {SpecificationClass} */
      let specificationClass = this[entry.classID];

      /** @type {Specification} */
      let SpecificationClass = specificationClasses[entry.classID];

      let specification = new SpecificationClass(specificationClass, entry.tag, entry.name, entry.version, entry.current, entry.url, html);

      specificationClass.specifications.push(specification);

    });

  }

  get rules() {
    return utils.flatten(this.specificationClasses.map( specClass => specClass.rules ));
  }

  get definitions() {
    return utils.flatten(this.specificationClasses.map( specClass => specClass.defs ));
  }

  /**
   * Saves rules and definitions for all NIEM specifications together (e.g,. `niem-rules.json`).
   * Also calls each specification class individually to save its rules and defs.
   *
   * @param {String} [folder='./output/'] - Folder to save output files.  Defaults to /output.
   */
  save(folder="./output/") {
    // Save all NIEM rules and definitions
    utils.save( NIEMSpecifications.fileName("all", "rules"), this.rules, folder);
    utils.save(NIEMSpecifications.fileName("all", "defs"), this.definitions, folder);

    // Save each set of rules and definitions
    this.specificationClasses.forEach( specClass => specClass.save(folder) );
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

    // Adjust the specification class for MPDs.
    let specClassID = tag.replace("MPD", "IEPD");

    /** @type {SpecificationClass} */
    let specClass = this[specClassID];

    if (specClass) {
      return specClass.version(version);
    }

  }

  /**
   * Returns all specifications
   */
  get specifications() {
    return utils.flatten( this.specificationClasses.map( specClass => specClass.specifications ) );
  }

  /**
   * @param {"all"|"class"|"spec"} scope
   * @param {"rules"|"defs"} style
   * @param {"NDR"|"IEPD"|"MPD"|"CodeLists"|"CTAS"} label - Specification class ID or tag
   * @param {String} version
   */
  static fileName(scope, style, label, version) {
    switch (scope) {
      case "all":
        return `niem-${style}`.toLowerCase();
      case "class":
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

module.exports = NIEMSpecifications;
