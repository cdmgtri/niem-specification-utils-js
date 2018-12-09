
let fs = require("fs-extra");
let path = require("path");
let cheerio = require("cheerio");
let debug = require("debug")("niem");

/** @type {CheerioStatic} */
let $;

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
   * Generates the JSON rules file from the specification HTML.
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
   * Cleans up the XML for processing
   *
   * @param {string} xml
   * @returns {string}
   */
  cleanUp(xml) {

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

    return xml;
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

    debug(`\nCompiling ${this.name} rules into single rules file.`);

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
