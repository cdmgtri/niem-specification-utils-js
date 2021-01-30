
class Definition {

  /**
   * @param {Specification} [specification]
   * @param {Section} [section]
   *
   * @param {string} [term=""]
   * @param {string} [text=""]
   * @param {Boolean} [isLocal=true] - True if the definition originates from the spec; false if its a reference
   */
  constructor(specification, section, term="", text="", isLocal=true) {

    this.specification = specification;
    this.section = section;
    this.term = term;
    this.text = text;
    this.isLocal = isLocal;

  }

  get id() {
    // Truncate string parentheses and replace spaces with underscores
    return "definition_" + this.term.split("(")[0].replace(/ /g, "_");
  }

  get url() {
    return this.specification.url + "#" + this.id
  }

  toJSON() {
    return {
      specificationID: this.specification.id,
      sectionID: this.section.id,
      sectionLabel: this.section.label,
      sectionURL: this.section.url,
      definitionID: this.id,
      definitionURL: this.url,
      definitionTerm: this.term,
      definitionText: this.text,
      definitionIsLocal: this.isLocal
    }
  }

}

let Specification = require("./specification");
let Section = require("./section");

module.exports = Definition;
