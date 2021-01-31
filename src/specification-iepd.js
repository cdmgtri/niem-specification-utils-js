
let Specification = require("./specification");

/**
 * Information about the NIEM Information Exchange Package Description (IEPD) specification.
 * Formerly named the Model Package Documentation (MPD) specification.
 */
class IEPD extends Specification {

  /**
   * Handles inconsistencies in IEPD specification rules.
   */
  postProcessData() {
    if (this.version === "3.0.1") {
      let rule = this.rules.find( rule => rule.number === "5-31");
      rule.title = "(none)";

      rule = this.rules.find( rule => rule.number === "5-41");
      rule.title = "(none)";
    }
  }

}

module.exports = IEPD;
