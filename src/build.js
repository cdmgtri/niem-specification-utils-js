
let NIEMSpecs = require("../index");

function rules() {

  let rules = NIEMSpecs.generateAllRules();

}

function defs() {

  let defs = NIEMSpecs.generateAllDefinitions();

}

module.exports = {
  rules,
  defs
};
