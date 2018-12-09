
let fs = require("fs-extra");
let path = require("path");
let debug = require("debug")("niem");

let { NIEMRule } = require("./assets/typedefs/index");

class NIEMSpec {

  /**
   * @param {"3.0"|"4.0"} version - The version of the specification.
   * @param {string} html - The HTML text of the specification.
   */
  constructor(version, html) {

    this.version = version;

    this.html = this.format(html);

    this.rules = this.generateRules();
  }

  /**
   * Get the URL for the rendered-HTML version of this specification.
   * @abstract
   */
  get url() {
    return "";
  }

  /**
   * Return true if this version of the specification is the latest stable version.
   * @abstract
   */
  get current() {
    return false;
  }

  /**
   * Return an array of NIEM release numbers to which this specification may apply.
   * @abstract
   */
  get niem() {
    return [];
  }

  /**
   * Cleans up and reformats the specification HTML as needed for processing.
   * @abstract
   * @param {string} html
   * @returns {string} - Reformatted HTML
   */
  format(html) {
  }

  /**
   * Parses the rules from the HTML text.
   * @abstract
   * @returns {NIEMRule[]}
   */
  generateRules() {
  }

  static generateAllRules() {

    /** @type {NIEMRule[]} */
    let allRules = [];

    debug("\nCompiling specification rules into single rules file.");

    allRules.push( ...NDR.generateAllRules() );

    return allRules;
  }

  /**
   * Generates and returns an array of rules for the given version.
   *
   * @static
   * @param {string} version
   * @returns {NIEMRule[]}
   */
  static generateRules(version) {
    // Load the specification HTML text
    let filePath = path.join(__dirname, `./assets/specifications/${this.fileNameRoot}-${version}.html`);

    let html = fs.readFileSync(filePath, {encoding: "utf8"});

    let spec = new this(version, html);
    return spec.rules;
  }

  /**
   * Generates rule files for all NDR versions that are currently handled (3.0 and 4.0).
   * @static
   * @param {NIEMSpec} spec
   * @param {string[]} versions
   * @returns {NIEMRule[]}
   */
  static generateAllRules() {

    /** @type {NIEMRule[][]} */
    let allRules = [];

    this.versions.forEach( version => {
      let rules = this.generateRules(version);
      allRules.push( ...rules );
    });

    return allRules;
  }

}

/** @type {string[]} */
NIEMSpec.versions = [];

NIEMSpec.fileNameRoot = "";

module.exports = NIEMSpec;
