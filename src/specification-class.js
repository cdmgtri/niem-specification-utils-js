
let utils = require("./utils");

/**
 * Information about a versioned series of related NIEM specifications.
 */
class SpecificationClass {

  /**
   *
   *
   * @param {"NDR"|"IEPD"|"CodeLists"|"CTAS"} classID - The id of the specification, e.g., "NDR"
   * @param {string} className - The name of the specification, e.g., "Naming and Design Rules"
   */
  constructor(classID, className) {

    this.classID = classID;
    this.className = className;

    /** @type {Specification[]} */
    this.specifications = [];

  }

  get rules() {
    return utils.flatten( this.specifications.map( spec => spec.rules ) );
  }

  get defs() {
    return utils.flatten( this.specifications.map( spec => spec.defs ) );
  }

  /**
   * Saves rules and definitions for all versions of the specification together (e.g., `ndr-rules.json`).
   *
   * @param {String} [folder='./output/'] - Folder to save output files.  Defaults to /output.
   * @param {Boolean} [saveVersions=false] - True to also save info about each version of the spec separately
   */
  save(folder="./output/", saveVersions=false) {
    let NIEMSpecs = require("./index");

    // Save all versions of the specification rules and definitions together
    utils.save( NIEMSpecs.fileName("class", "rules", this.classID), this.rules, folder );
    utils.save( NIEMSpecs.fileName("class", "defs", this.classID), this.defs, folder );

    // Save each specification's rules and definitions separately
    if (saveVersions) {
      this.specifications.forEach( spec => spec.save(folder) );
    }
  }

  /**
   * Returns the specification with the given version.
   * @param {String} version
   */
  version(version) {
    return this.specifications.find( spec => spec.version == version );
  }

}

let Specification = require("./specification");

module.exports = SpecificationClass;
