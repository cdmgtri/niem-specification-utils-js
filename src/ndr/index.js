
let NIEMSpec = require("../index");
let { NIEMSpecification } = require("../assets/typedefs/index");

class NDR extends NIEMSpec {

  /**
   * Returns the URL for the rendered-HTML version of the NDR specification.
   * @readonly
   */
  get url() {
    return `https://reference.niem.gov/niem/specification/naming-and-design-rules/${this.version}/niem-ndr-${this.version}.html`;
  }

  /**
   * Returns true for NDR 4.0.
   * @readonly
   */
  get current() {
    return this.version === "4.0" ? true : false;
  }

  /**
   * Returns an array of applicable NIEM releases based on the NDR version
   * @readonly
   */
  get niem() {
    switch (this.version) {
      case "1.0":
        return ["1.0"];
      case "1.3":
        return ["2.0", "2.1"];
      case "3.0":
        return ["3.0", "3.1", "3.2"];
      case "4.0":
        return ["4.0", "4.1", "4.2"];
    }
  }

  /**
   * @type {NIEMSpecification}
   */
  get specificationData() {

    /** @type {NIEMSpecification} */
    let specification = {
      id: "NDR",
      name: "Naming and Design Rules",
      version: "NDR-" + this.version,
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
    html = convertRuleApplicability(html);
    return html;
  }

  /**
   * Cleans up the XML for processing
   *
   * @param {string} xml
   * @returns {string}
   */
  cleanUp(xml) {

    xml = super.cleanUp(xml);

    // Close tags or remove brackets
    xml = xml.replace("[Definition: <term>]", "[Definition: <term/>]");
    xml = xml.replace("[Principle <number>]", "[Principle <number/>]");
    xml = xml.replace("[Rule <section>-<number>] (<applicability>) (<classification>)", "[Rule <section/>-<number/>] (<applicability/>) (<classification/>)");
    xml = xml.replace(/<absolute-URI>/g, "<absolute-URI/>");
    xml = xml.replace(/<schema>/g, "<schema/>");
    xml = xml.replace("<webb.roberts@gtri.gatech.edu>", "webb.roberts@gtri.gatech.edu");

    return xml;
  }

}

NDR.versions = ["3.0", "4.0"];
NDR.fileNameRoot = "niem-ndr-doc";

module.exports = NDR;


/**
 * Replaces hyperlinks to conformance targets in rule applicabilities to
 * simple strings.
 *
 * @param {string} xml
 * @returns {string}
 */
function convertRuleApplicability(xml) {

  // Convert REF
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_REF">REF<\/a>/g, "REF");

  // Convert EXT
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_EXT">EXT<\/a>/g, "EXT");

  // Convert SET
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_SET">SET<\/a>/g, "SET");

  // Convert INS
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_INS">INS<\/a>/g, "INS");

  return xml;

}
