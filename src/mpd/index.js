
let NIEMSpec = require("../index");
let { NIEMSpecification } = require("../assets/typedefs/index");

class MPD extends NIEMSpec {

  /**
   * Returns the URL for the rendered-HTML version of the MPD specification.
   * @readonly
   */
  get url() {
    return `https://reference.niem.gov/niem/specification/model-package-description/${this.version}/model-package-description-${this.version}.html`;
  }

  /**
   * Returns true for MPD 3.0.1.
   * @readonly
   */
  get current() {
    return this.version === "3.0.1" ? true : false;
  }

  /**
   * Returns an array of applicable NIEM releases based on the MPD version
   * @readonly
   */
  get niem() {
    switch (this.version) {
      case "3.0.1":
        return ["3.0", "3.1", "3.2", "4.0", "4.1", "4.2"];
    }
  }

  /**
   * @type {NIEMSpecification}
   */
  get specificationData() {

    /** @type {NIEMSpecification} */
    let specification = {
      id: "MPD",
      name: "Model Package Description Specification",
      version: "MPD-" + this.version,
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

  handleExceptions() {
    if (this.version === "3.0.1") {
      let rule = this.rules.find( rule => rule.number === "5-31");
      rule.title = "(none)";

      rule = this.rules.find( rule => rule.number === "5-41");
      rule.title = "(none)";
    }
  }

}

MPD.versions = ["3.0.1"];
MPD.fileNameRoot = "model-package-description";

module.exports = MPD;
