
let utils = require("./utils");
let { parseSpecification } = require("./parser");

class Specification {

  /**
   * @param {SpecificationClass} specificationClass - The class object for this spec
   * @param {String} version - Version number (e.g., "3.0")
   * @param {String} url - URL for reading the spec
   * @param {String} year - Year the spec was published
   * @param {String} applicableReleases - NIEM releases for which this spec applies
   * @param {String} resources - URL to view or download additional resources for this spec
   * @param {String} examples - URL to view examples associated with this spec
   * @param {Boolean} current - True if this specification is the most current of its class
   * @param {String} html - The HTML text of the specification.
   */
  constructor(specificationClass, version="", url="", year="", applicableReleases="", resources="", examples="", current=false, html="") {

    /** @private */
    this.specificationClass = specificationClass;

    this.version = version;
    this.url = url;
    this.year = year;
    this.applicableReleases = applicableReleases;
    this.resources = resources;
    this.examples = examples;
    this.current = current;
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
    return this.customID + "-" + this.version;
  }

  /**
   * The standard name for this specific version of the specification.
   * Adds support for the legacy "MPD" name.
   */
  get name() {
    if (!this.specificationClass) return "";

    if (this.specificationClass.id == "IEPD" && this.version.startsWith("3.0")) {
      return "Model Package Description";
    }
    return this.specificationClass.name;
  }

  /**
   * The standard abbreviation for this specific version of the specification.
   * Adds support for the legacy "MPD" abbreviation.
   */
  get customID() {
    if (!this.specificationClass) return "";

    if (this.specificationClass.id == "IEPD" && this.version.startsWith("3.0")) {
      return "MPD";
    }
    return this.specificationClass.id;
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
   * @param {String} [folder] - Save to the given or default folder
   */
  save(folder) {
    utils.nameFileAndSave("spec", "rules", this.customID, this.version, this.rules, folder);
    utils.nameFileAndSave("spec", "defs", this.customID, this.version, this.defs, folder);
  }

  toJSON() {
    return {
      id: this.id,
      classID: this.specificationClass.id,
      customID: this.customID,
      name: this.name,
      version: this.version,
      url: this.url,
      year: this.year.toString(),
      applicableReleases: this.applicableReleases,
      resources: this.resources,
      examples: this.examples,
      current: this.current,
      ruleCount: this.rules.length,
      definitionCount: this.defs.length
    }
  }

}

let Rule = require("./rule");
let Definition = require("./definition");
let SpecificationClass = require("./specification-class");

module.exports = Specification;
