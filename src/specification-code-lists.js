
let Specification = require("./specification");

class CodeLists extends Specification {

  /**
   * Handles inconsistencies in Code Lists rules and definitions.
   */
  processExceptions() {
    if (this.version === "3.0") {
      let rule = this.rules.find( rule => rule.number === "9-83" );
      rule.text = "The value of the attribute targetNamespace MUST match the production <absolute-URI> as defined by RFC 3986.";
    }

    // Fix term "uniform resource identifierURI"
    let def = this.defs.find( def => def.id == "definition_URI" );
    def.term = "URI";

    // Fix term "uniform resource identifierURI"
    def = this.defs.find( def => def.id == "definition_uniform_resource_identifier");
    def.term = "uniform resource identifier";

  }

}

module.exports = CodeLists;
