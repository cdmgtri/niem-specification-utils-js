
let fs = require("fs-extra");

let NIEMSpecs = require("../index");

function rules() {

  let rules = NIEMSpecs.generateAllRules();
  fs.outputJSONSync("niem-rules.json", rules, {spaces: 2});

  console.log("Generated niem-rules.json");

}

function defs() {

  let defs = NIEMSpecs.generateAllDefinitions();
  fs.outputJSONSync("niem-defs.json", defs, {spaces: 2});

  console.log("Generated niem-defs.json");
}

module.exports = {
  rules,
  defs
};
