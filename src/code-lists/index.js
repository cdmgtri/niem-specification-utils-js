
let NIEMSpec = require("../index");
let { NIEMSpecification } = require("../assets/typedefs/index");

class CodeLists extends NIEMSpec {

  /**
   * Returns the URL for the rendered-HTML version of the CodeLists specification.
   * @readonly
   */
  get url() {
    return `https://reference.niem.gov/niem/specification/code-lists/${this.version}/niem-code-lists-${this.version}.html`;
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
