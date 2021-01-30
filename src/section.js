
/**
 * Information about a section in a NIEM specification.
 */
class Section {

  /**
   * @param {Specification} [specification]
   * @param {string} [id=""]
   * @param {string} [label=""]
   */
  constructor(specification, id="", label="") {

    this.specification = specification;

    /** @example "section_3.4" */
    this.id = id;

    /** @example "2.5. XML Information Set" */
    this.label = label;

  }

  get url() {
    return this.specification.url + "#" + this.id;
  }

  toJSON() {
    return {
      specificationID: this.specification.id,
      sectionID: this.id,
      sectionLabel: this.label,
      sectionURL: this.url
    }
  }

}

let Specification = require("./specification");

module.exports = Section;
