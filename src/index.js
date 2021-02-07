
let utils = require("./utils");

let SpecificationClass = require("./specification-class");
let Specification = require("./specification");
let Target = require("./target");

let NDR = require("./specification-ndr");
let IEPD = require("./specification-iepd");
let CodeLists = require("./specification-code-lists");
let CTAS = require("./specification-ctas");
let JSON = require("./specification-json");

/**
 * Information about the set of NIEM specifications.
 */
class NIEMSpecifications {

  constructor() {

    /** @type {SpecificationClass} */
    this.NDR;

    /** @type {SpecificationClass} */
    this.IEPD;

    /** @type {SpecificationClass} */
    this.CodeLists;

    /** @type {SpecificationClass} */
    this.CTAS;

    /** @type {SpecificationClass} */
    this.JSON;

  }

  /**
   * Loads metadata about specification classes and individual specifications
   * from the information in the `/data` directory.
   */
  load() {
    this.loadSpecificationClassMetadata();
    this.loadSpecificationMetadata();
    this.loadTargets();
  }

  /**
   * Loads metadata about specification classes from `/data/classes.yaml`.
   */
  loadSpecificationClassMetadata() {

    let metadata = utils.readYAML("../data/classes.yaml");

    metadata.forEach( entry => {

      this[entry.id] = new SpecificationClass(entry.id, entry.name, entry.repo, entry.landingPage, entry.issueTracker, entry.tutorial, entry.changeHistory, entry.description);

    });

  }

  /**
   * Loads metadata about specifications from `/data/specifications.yaml`.
   */
  loadSpecificationMetadata() {

    let SpecificationConstructors = {NDR, IEPD, CodeLists, CTAS, JSON};

    let metadata = utils.readYAML("../data/specifications.yaml");

    metadata.forEach( entry => {

      // Get the text from the HTML specification
      let html = utils.readSpecificationHTMLText(entry.classID, entry.version);

      // Find the corresponding specification class for this specification
      let specificationClass = this.specificationClass(entry.classID);

      // Create the new specification from the metadata
      let SpecializedSpecificationConstructor = SpecificationConstructors[entry.classID];
      let specification = new SpecializedSpecificationConstructor(specificationClass, entry.version, entry.url, entry.year, entry.applicableReleases, entry.resources, entry.examples, entry.status, html);

      // Add the specification object to its specification class
      specificationClass.specifications.push(specification);

    });

  }

  /**
   * Loads metadata about targets from `/data/targets.yaml`.
   *
   * Default targets are defined for a specification class but can be overridden by a specific
   * version of a specification when it differs from the default.
   */
  loadTargets() {

    /** @type {Object[]} */
    let metadata = utils.readYAML("../data/targets.yaml");


    metadata.forEach( entry => {

      let target = new Target( null, entry.code, entry.target, entry.definitionFragment, entry.description, entry.tutorial);

      if (entry.classID) {
        // Add class-default targets to specifications that do not override the defaults
        let specs = this.specificationClass(entry.classID).specifications;
        specs.forEach( spec => {
          // Add target to spec if that spec does not override the class defaults
          if (!metadata.some( entry => entry.specID == spec.id )) {
            // Make sure to create a separate target object per spec
            let specTarget = Object.assign(new Target(), target);
            specTarget.specification = spec;
            spec.targets.push(specTarget);
          }
        });
      }
      else {
        // Add specification-specific target
        let spec = this.specification(entry.specID);
        target.specification = spec;
        spec.targets.push(target);
      }

    });

  }

  get rules() {
    return utils.flatten(this.specificationClasses.map( specClass => specClass.rules ));
  }

  get definitions() {
    return utils.flatten(this.specificationClasses.map( specClass => specClass.defs ));
  }

  get targets() {
    return utils.flatten(this.specificationClasses.map( specClass => specClass.targets ));
  }

  /**
   * Saves rules and definitions for all NIEM specifications together (e.g,. `niem-rules.json`).
   * Also calls each specification class individually to save its rules and defs.
   *
   * @param {String} [folder] - Saves to the given or default folder.
   */
  save(folder) {
    // Save all metadata about specifications and specification classes
    utils.nameFileAndSave("all", "classes", null, null, this.specificationClasses, folder);
    utils.nameFileAndSave("all", "specs", null, null, this.specifications, folder);

    // Save all NIEM rules, definitions, and targets
    utils.nameFileAndSave("all", "rules", null, null, this.rules, folder);
    utils.nameFileAndSave("all", "defs", null, null, this.definitions, folder);
    utils.nameFileAndSave("all", "targets", null, null, this.targets, folder);

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
   * Returns the specification class object for the given ID
   * @param {"NDR"|"IEPD"|"CodeLists"|"CTAS"|"JSON"} classID
   * @returns {SpecificationClass}
   */
  specificationClass(classID) {
    return this[classID];
  }

  get specificationClasses() {
    return [this.NDR, this.IEPD, this.CodeLists, this.CTAS, this.JSON];
  }

  /**
   * Returns all specifications
   */
  get specifications() {
    return utils.flatten( this.specificationClasses.map( specClass => specClass.specifications ) );
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
