
let utils = require("./utils");
let { parseSpecification } = require("./parser");

class Specification {

  /**
   * @param {SpecificationClass} specClass - The specification group to which this individual version of a spec belongs
   * @param {"NDR"|"MPD"|"IEPD"|"CodeLists"|"CTAS"} tag - The tag of the specification, e.g., "NDR"
   * @param {string} name - The name of the specification, e.g., "Naming and Design Rules"
   * @param {string} version - The version of the specification, e.g., "3.0"
   * @param {Boolean} current - True if this specification is the most current of the spec class
   * @param {string} html - The HTML text of the specification.
   */
  constructor(specClass, tag="", name="", version="", current=false, url="", html="") {

    /** @private */
    this.specificationClass = specClass;

    // Default to class values if not given
    this.tag = tag || specClass.classID;
    this.name = name || specClass.className;

    this.version = version;
    this.current = current;
    this.url = url;
    this.html = html;

    /** @type {Rule[]} */
    this.rules = [];

    /** @type {Definition[]} */
    this.defs = [];

    // Apply any needed specification-specific adjustments to the HTML text and parse
    parseSpecification(this);

  }

  /**
   * Specification tag and version
   * @example "NDR-4.0"
   */
  get id() {
    return this.tag + "-" + this.version;
  }

  /**
   * Cleans up and reformats the specification HTML as needed for processing.
   * Specification-specific.
   *
   * @abstract
   * @param {string} html
   * @returns {string} - Reformatted HTML
   */
  preProcessHTML(html) {
    return html;
  }

  /**
   * Handles inconsistencies in rules or definitions.  Specification-specific.
   * @abstract
   */
  postProcessData() {
  }


  /**
   * Saves all rules and definitions for the specification (e.g., `ndr-rules-3.0.json`).
   *
   * @param {String} [folder='./output/'] - Folder to save output files.  Defaults to /output.
   */
  save(folder="./output/") {
    let NIEMSpecs = require("./index");

    utils.save( NIEMSpecs.fileName("spec", "rules", this.tag, this.version), this.rules, folder );
    utils.save( NIEMSpecs.fileName("spec", "defs", this.tag, this.version), this.defs, folder );
  }

}

let Rule = require("./rule");
let Definition = require("./definition");
let SpecificationClass = require("./specification-class");

module.exports = Specification;
