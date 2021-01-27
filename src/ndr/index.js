
let NIEMSpec = require("../index");
let { SpecificationType } = require("../assets/typedefs/index");

class NDR extends NIEMSpec {

  static url(version) {
    return `https://reference.niem.gov/niem/specification/naming-and-design-rules/${version}/niem-ndr-${version}.html`;
  }

  /**
   * @param {String} version - Specification version
   * @param {String} number - Rule number ("4-1")
   */
  static ruleURL(version, number) {
    return NDR.url(version) + "#rule_" + number;
  }

  /**
   * @param {String} version - Specification version
   * @param {String} term - Definition term ("application information")
   */
  static defURL(version, term) {
    return NDR.url(version) + "#definition_" + term.replace(/ /g, "_");
  }

  /**
   * Returns true for NDR 4.0.
   * @readonly
   */
  get current() {
    return this.version === "5.0" ? true : false;
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
      case "5.0":
        return ["5.0"];
    }
  }

  /**
   * @type {SpecificationType}
   */
  get specificationData() {
    return {
      id: "NDR",
      name: "Naming and Design Rules",
      version: "NDR-" + this.version,
      versionLabel: this.version,
      current: this.current,
      niem: this.niem,
      link: this.url
    };
  }

  /**
   * Clean up unclosed tags, simplify rule applicability values, and otherwise
   * prepare the file for rule processing.
   *
   * @param {string} html
   */
  format(html) {
    html = super.format(html);
    html = convertRuleApplicability(html);
    return html;
  }

  handleExceptions() {
    if (this.version === "3.0") {
      let rule = this.rules.find( rule => rule.number === "9-83" );
      rule.text = "The value of the attribute targetNamespace MUST match the production <absolute-URI> as defined by RFC 3986.";
    }
  }

}

NDR.versions = ["3.0", "4.0", "5.0"];
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
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/5.0\/niem-ndr-5.0.html#conformance_target_REF">REF<\/a>/g, "REF");

  // Convert EXT
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_EXT">EXT<\/a>/g, "EXT");
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/5.0\/niem-ndr-5.0.html#conformance_target_EXT">EXT<\/a>/g, "EXT");

  // Convert SET
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_SET">SET<\/a>/g, "SET");
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/5.0\/niem-ndr-5.0.html#conformance_target_SET">SET<\/a>/g, "SET");

  // Convert INS
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/4.0\/niem-ndr-4.0.html#conformance_target_INS">INS<\/a>/g, "INS");
  xml = xml.replace(/<a href="https:\/\/reference.niem.gov\/niem\/specification\/naming-and-design-rules\/5.0\/niem-ndr-5.0.html#conformance_target_INS">INS<\/a>/g, "INS");

  return xml;

}
