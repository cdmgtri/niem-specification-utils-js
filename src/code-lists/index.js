
let NIEMSpec = require("../index");
let { NIEMSpecification } = require("../assets/typedefs/index");

class CodeLists extends NIEMSpec {

  static url (version) {
    return `https://reference.niem.gov/niem/specification/code-lists/${version}/niem-code-lists-${version}.html`;
  }

  /**
   * @param {String} version - Specification version
   * @param {String} number - Rule number ("4-1")
   */
  static ruleURL(version, number) {
    return CodeLists.url(version) + "#rule_" + number;
  }

  /**
   * @param {String} version - Specification version
   * @param {String} term - Definition term ("application information")
   */
  static defURL(version, term) {
    return CodeLists.url(version) + "#definition_" + term.replace(/ /g, "_");
  }

  /**
   * Returns true for CodeLists 4.0.
   * @readonly
   */
  get current() {
    return this.version === "4.0" ? true : false;
  }

  /**
   * Returns an array of applicable NIEM releases based on the CodeLists version
   * @readonly
   */
  get niem() {
    switch (this.version) {
      case "4.0":
        return ["3.0", "3.1", "3.2", "4.0", "4.1", "4.2"];
    }
  }

  /**
   * @type {NIEMSpecification}
   */
  get specificationData() {

    /** @type {NIEMSpecification} */
    let specification = {
      id: "CodeLists",
      name: "Code Lists Specification",
      version: "CodeLists-" + this.version,
      versionLabel: this.version,
      current: this.current,
      niem: this.niem,
      link: this.url
    };
    return specification;
  }

  /**
   * Clean up unclosed tags, simplify rule applicability values, and otherwise
   * prepare the file for rule processing.
   *
   * @param {string} html
   */
  format(html) {

    html = this.cleanUp(html);
    return html;
  }

}

CodeLists.versions = ["4.0"];
CodeLists.fileNameRoot = "niem-code-lists";

module.exports = CodeLists;
