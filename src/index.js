
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
}

module.exports = NIEMSpec;
