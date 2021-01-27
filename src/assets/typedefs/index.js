
/**
 * Basic metadata about a NIEM specification.
 */
let SpecificationType = {
  name: "",
  id: "",
  version: "",
  versionLabel: "",
  current: false,
  niem: [],
  link: ""
};


/**
 * Basic metadata about a section in a NIEM specification.
 */
let SectionType = {
  id: "",
  name: "",
  link: "",
};


/**
 * Information about a rule in a NIEM specification.
 */
let RuleType = {
  specificationID: "",
  sectionID: "",
  sectionName: "",
  sectionLink: "",
  title: "",
  link: "",
  targets: [],
  /** @type{"Constraint"|"Interpretation"} */
  classification: "",
  /** @type{"text"|"schematron"} */
  style: "",
  text: "",
  schematron: ""
};


/**
 * Information about a definition in a NIEM specification.
 */
let DefinitionType = {
  specificationID: "",
  sectionID: "",
  sectionName: "",
  sectionLink: "",
  id: "",
  term: "",
  text: "",
  link: ""
};

module.exports = { SpecificationType, SectionType, RuleType, DefinitionType }
