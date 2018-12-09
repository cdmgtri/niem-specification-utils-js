
let fs = require("fs-extra");
let path = require("path");
let debug = require("debug")("niem");
let cheerio = require("cheerio");

let NIEMSpec = require("../index");
let { NIEMRule, NIEMSpecification } = require("../assets/typedefs/index");

/** @type {CheerioStatic} */
let $;

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
   * Generates the JSON rules file for the NDR.
   * @returns {NIEMRule[]}
   */
  generateRules() {

    /** @type {NIEMRule[]} */
    let rules = [];

    $ = cheerio.load(this.html, {
      normalizeWhitespace: true,
      xmlMode: false,
      decodeEntities: true,
      recognizeSelfClosing: true,
      ignoreWhitespace: true
    });

    let specification = this.specificationData;

    debug("\nLoading NDR %s rules", this.version);

    // Process each div with class="rule-section"
    $("div .rule-section").each( (index, ruleSectionNode) => {

      /** @type {NIEMRule} */
      let rule = {};

      // Define basic specification information for the rule
      rule.specification = specification;
      processRuleSection(rule, ruleSectionNode, this.url);
      processRuleHeading(rule, ruleSectionNode, this.url);
      processRuleLabel(rule, ruleSectionNode);
      processRuleDescription(rule, ruleSectionNode);
      processRuleSection(rule, ruleSectionNode);

      rules.push(rule);
      // console.log(index, rule.id, rule.name, rule.title);
      debug("%s %s %s %s %s", index, this.version, rule.id, rule.name, rule.title);
    });

    // Save the rules
    let rulesPath = path.join(__dirname, "../../rules", `ndr-rules-${this.version}.json`);
    fs.outputJSONSync(rulesPath, rules);

    return rules;
  }

  /**
   * Clean up unclosed tags, simplify rule applicability values, and otherwise
   * prepare the file for rule processing.
   *
   * @param {string} html
   */
  format(html) {
    html = cleanUp(html);
    html = convertRuleApplicability(html);
    return html;
  }

  static generateAllRules() {
    return super.generateAllRules(NDR, NDR.versions);
  }

}

NDR.versions = ["3.0", "4.0"];
NDR.fileNameRoot = "niem-ndr-doc";

module.exports = NDR;

/**
 * Sets basic rule fields.
 * Parses the rule id, name, and title, if available.
 *
 * @param {NIEMRule} rule
 * @param {CheerioElement} ruleSectionNode
 * @param {string} baseURL
 */
function processRuleHeading(rule, ruleSectionNode, baseURL) {

  // Parse the rule title
  let title = $(ruleSectionNode).find("div .heading").text();
  rule.number = title.split(". ")[0].replace("Rule ", "");
  rule.title = title.split(". ")[1];

  let ruleNameNodes = $(ruleSectionNode).find(".heading a");

  // Parse the rule id and name
  ruleNameNodes.each( (i, ruleNameNode) => {

    let val = ruleNameNode.attribs["name"];

    // Not all rules have names.  Set default value.
    rule.name = "";

    if (val.startsWith("rule_")) {
      // Example: rule_9-1
      rule.id = val;
    }
    else if (val.startsWith("rule-")) {
      // Example: rule-base-type-not-xml-ns
      rule.name = val || "";
    }
  });

  rule.link = baseURL + "#" + rule.id;
}

/**
 * Sets the rule applicability and classification fields.
 *
 * @param {NIEMRule} rule
 * @param {CheerioElement} ruleSectionNode
 */
function processRuleLabel(rule, ruleSectionNode) {

  // Example: [Rule 9-1] (REF, EXT) (Constraint)
  let label = $(ruleSectionNode).find(".normativeHead").text();

  rule.applicability = parseApplicability(label);
  rule.classification = parseClassification(label);
}

/**
 * Parses the rule label for the rule applicability array.
 *
 * @param {string} label - Example: "[Rule 4-3] (REF, EXT) (Constraint)"
 * @returns {string[]}
 */
function parseApplicability(label) {
  let re = /] \(([^)]*)\)/;
  let applicabilityString = label.match(re)[1];
  return applicabilityString.split(", ");
}

/**
 * Parses the rule label for the rule classification string.
 *
 * @param {string} label
 * @returns {string}
 */
function parseClassification(label) {
  if (label.includes("(Constraint)")) {
    return "Constraint";
  }
  else if (label.includes("(Interpretation)")) {
    return "Interpretation";
  }
  return "";
}

/**
 * Sets the rule description field from text that may precede the rule box.
 *
 * @param {NIEMRule} rule
 * @param {CheerioElement} ruleSectionNode
 */
function processRuleDescription(rule, ruleSectionNode) {

  let ruleBoxNode = $(ruleSectionNode).find(".box");

  rule.pre = $(ruleBoxNode).prev("p").text();
  rule.post = $(ruleBoxNode).next("p").text();


  let ruleTextNode = $(ruleBoxNode).find("p");

  if ( ruleTextNode.length > 0 ) {
    rule.style = "text";
    rule.text = $(ruleBoxNode).find("> p").text();
  }
  else {
    let ruleSchematronNode = $(ruleBoxNode).find("pre");
    rule.style = "schematron";
    rule.schematron = $(ruleSchematronNode).html();
    rule.text = ruleSchematronNode.find("sch\\:assert").text();
  }

}

/**
 * Sets the information about the section that the rule appears under.
 *
 * @param {NIEMRule} rule
 * @param {CheerioElement} ruleSectionNode
 * @param {String} baseURL
 */
function processRuleSection(rule, ruleSectionNode, baseURL) {

  let sectionNode = $(ruleSectionNode).closest(".section");
  let sectionHeadingNode = $(sectionNode).find("> .heading");

  // Set the section name
  rule.section = {
    name: sectionHeadingNode.text()
  }

  // Set the section ID
  $(sectionHeadingNode)
    .find("a")
    .each( (i, aNode) => {
      let name = aNode.attribs["name"];
      if (name.startsWith("section_")) {
        rule.section.id = name;
      }
    });

  // Set the section link
  rule.section.link = baseURL + "#" + rule.section.id;
}

/**
 * Cleans up the XML for processing
 *
 * @param {string} xml
 * @returns {string}
 */
function cleanUp(xml) {

  // Replace escaped characters
  xml = xml.replace(/&lt;/g, "<");
  xml = xml.replace(/&gt;/g, ">");

  // Add a newline between tags
  // xml = xml.replace(/></g, ">\n<");

  // Remove the HTML doctype header
  xml = xml.replace(/<!DOCTYPE .*>/, "");

  // Close the meta tag
  xml = xml.replace(/<meta ([^>]*)>/, "<meta $1/>");

  // Remove contents from image tags and close (unneeded)
  xml = xml.replace(/<img src=[^>]*>/g, "<img/>");

  // Close tags or remove brackets
  xml = xml.replace("[Definition: <term>]", "[Definition: <term/>]");
  xml = xml.replace("[Principle <number>]", "[Principle <number/>]");
  xml = xml.replace("[Rule <section>-<number>] (<applicability>) (<classification>)", "[Rule <section/>-<number/>] (<applicability/>) (<classification/>)");
  xml = xml.replace(/<absolute-URI>/g, "<absolute-URI/>");
  xml = xml.replace(/<schema>/g, "<schema/>");
  xml = xml.replace("<webb.roberts@gtri.gatech.edu>", "webb.roberts@gtri.gatech.edu");

  return xml;
}

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
