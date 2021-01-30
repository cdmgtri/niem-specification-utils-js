
let Specification = require("./specification");

class IEPD extends Specification {

  /**
   * Handles inconsistencies in IEPD specification rules.
   */
  processExceptions() {
    if (this.version === "3.0.1") {
      let rule = this.rules.find( rule => rule.number === "5-31");
      rule.title = "(none)";

      rule = this.rules.find( rule => rule.number === "5-41");
      rule.title = "(none)";
    }
  }

}

module.exports = IEPD;
