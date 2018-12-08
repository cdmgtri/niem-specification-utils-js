
/**
  * 
  * @typedef {Object} NIEMSpecificationType - Basic metadata about a NIEM specification.
  *
  * @property {string} [name] - Example: Naming and Design Rules 
  * @property {string} [id] - Example: NDR 
  * @property {string} [version] - Example: NDR-4.0 
  * @property {string} [versionLabel] - Example: 4.0 
  * @property {boolean} [current] -  
  * @property {array} [niem] - Example: 4.0,4.1,4.2 
  * @property {string} [link] - Example: https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html 
  */


/** @type {NIEMSpecificationType} */ 
let NIEMSpecification = {}; 

/**
  * 
  * @typedef {Object} NIEMSectionType - Basic metadata about a section in a NIEM specification.
  *
  * @property {string} [id] - Example: section_9.1.1.1 
  * @property {string} [name] - Example: 9.1.1.1 
  * @property {string} [link] - Example: https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html#section_9.1.1.1 
  */


/** @type {NIEMSectionType} */ 
let NIEMSection = {}; 

/**
  * 
  * @typedef {Object} NIEMRuleType - Information about a rule in a NIEM specification.
  *
  * @property {object} [specification] -  
  * @property {string} [specification.name] - Example: Naming and Design Rules 
  * @property {string} [specification.id] - Example: NDR 
  * @property {string} [specification.version] - Example: NDR-4.0 
  * @property {string} [specification.versionLabel] - Example: 4.0 
  * @property {boolean} [specification.current] -  
  * @property {array} [specification.niem] - Example: 4.0,4.1,4.2 
  * @property {string} [specification.link] - Example: https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html 
  * @property {object} [section] -  
  * @property {string} [section.id] - Example: section_9.1.1.1 
  * @property {string} [section.name] - Example: 9.1.1.1 
  * @property {string} [section.link] - Example: https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html#section_9.1.1.1 
  * @property {string} [id] - Example: rule_9-1 
  * @property {string} [name] - Example: rule-base-type-not-xml-ns 
  * @property {string} [number] - Example: 9-1 
  * @property {string} [title] - Example: No base type in the XML namespace 
  * @property {string} [link] - Example: https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html#rule_9-1 
  * @property {array} [applicability] - Example: REF,EXT 
  * @property {"Constraint"|"Interpretation"} [classification] - Example: Constraint 
  * @property {"text"|"schematron"} [style] - Example: text 
  * @property {"all"|"xml"|"json"} [language] -  
  * @property {string} [pre] - Descriptive text that precedes a rule 
  * @property {string} [text] - The descriptive text portion of a rule 
  * @property {string} [post] - Descriptive text that follows a rule 
  * @property {string} [schematron] -  
  */


/** @type {NIEMRuleType} */ 
let NIEMRule = {}; 

/** @typedef {"REF"|"EXT"|"SET"|"INS"} NIEMRuleApplicabilityType - A conformance target to which this rule applies. */

/** @type {NIEMRuleApplicabilityType} */ 
let NIEMRuleApplicability = {}; 

/** @typedef {"REF"|"EXT"|"SET"|"INS"} NIEMRuleApplicabilityNDRType - A NDR conformance target to which this rule applies. */

/** @type {NIEMRuleApplicabilityNDRType} */ 
let NIEMRuleApplicabilityNDR = {}; 

/** @typedef {"Constraint"|"Interpretation"} NIEMRuleClassificationType - Specifies if the rule is a requirement or principle. */

/** @type {NIEMRuleClassificationType} */ 
let NIEMRuleClassification = {}; 

/** @typedef {"text"|"schematron"} NIEMRuleStyleType - Indicates if and how the rule may be automated. */

/** @type {NIEMRuleStyleType} */ 
let NIEMRuleStyle = {}; 

/** @typedef {"all"|"xml"|"json"} NIEMRuleLanguageType - Specifies the NIEM document language to which this rule applies. */

/** @type {NIEMRuleLanguageType} */ 
let NIEMRuleLanguage = {}; 

module.exports = { NIEMSpecification, NIEMSection, NIEMRule, NIEMRuleApplicability, NIEMRuleApplicabilityNDR, NIEMRuleClassification, NIEMRuleStyle, NIEMRuleLanguage }