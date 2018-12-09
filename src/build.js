
function build() {

  let fs = require("fs-extra");

  let NIEMSpecs = require("../index");

  let rules = NIEMSpecs.generateAllRules();
  fs.outputJSONSync("niem-rules.json", rules, {spaces: 2});

  console.log("Generated niem-rules.json");
}

module.exports = build;
