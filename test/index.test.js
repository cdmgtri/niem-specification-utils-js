
let fs = require("fs-extra");
let Ajv = require("ajv");
let NIEMSpecs = require("../index");

let ajv = new Ajv();

describe("NDR 4.0 rules", () => {
  let ndrRules = NIEMSpecs.NDR.generateRules("4.0");

  test("rule count", () => {
    expect(ndrRules.length).toEqual(255);
  });

  test("NIEM releases", () => {
    expect(ndrRules[0].specification.niem.includes("4.0")).toBeTruthy();
    expect(ndrRules[0].specification.niem.includes("3.0")).toBeFalsy();
  });

  describe("style", () => {
    test("text rules", () => {
      expect(ndrRules.filter( rule => rule.style === "text" ).length).toEqual(68);
    });

    test("schematron rules", () => {
      expect(ndrRules.filter( rule => rule.style === "schematron" ).length).toEqual(187);
    });
  });

  describe("applicability", () => {
    test("REF rules", () => {
      expect(ndrRules.filter( rule => rule.applicability.includes("REF") ).length).toEqual(218);
    });

    test("EXT rules", () => {
      expect(ndrRules.filter( rule => rule.applicability.includes("EXT") ).length).toEqual(203);
    });

    test("SET rules", () => {
      expect(ndrRules.filter( rule => rule.applicability.includes("SET") ).length).toEqual(15);
    });

    test("INS rules", () => {
      expect(ndrRules.filter( rule => rule.applicability.includes("INS") ).length).toEqual(23);
    });
  });

  describe("classification", () => {
    test("CONSTRAINT rules", () => {
      expect(ndrRules.filter( rule => rule.classification === "Constraint").length).toEqual(236);
    });

    test("INTERPRETATION rules", () => {
      expect(ndrRules.filter( rule => rule.classification === "Interpretation").length).toEqual(19);
    });
  });

});

describe("Test rule counts", () => {

  test("All rules", () => {
    let allRules = NIEMSpecs.generateAllRules();
    fs.outputJSONSync("test/output/niem-rules.json", allRules, {spaces: 2});
    expect(allRules.length).toEqual(523);
  });

  test("NDR 3.0", () => {
    let rules = NIEMSpecs.NDR.generateRules("3.0");
    expect(rules.length).toEqual(239);
  });

  test("NDR 4.0", () => {
    let rules = NIEMSpecs.NDR.generateRules("4.0");
    expect(rules.length).toEqual(255);
  });

  test("Code Lists 4.0", () => {
    let rules = NIEMSpecs.CodeLists.generateRules("4.0");
    expect(rules.length).toEqual(29);
  });

});

describe("JSON validation", () => {

  test("test/niem-rules.json", () => {
    let valid = validate("schemas/niem-rule.schema.json", "test/niem-rules.json");
    let errs = ajv.errors;

    if (errs) {
      console.log(errs.toString());
    }
    expect(valid).toBeTruthy();
  });

});

/**
 * Validates the given JSON instance against the given schema.
 *
 * @param {string} schemaPath
 * @param {string} instancePath
 */
async function validate(schemaPath, instancePath) {

  let schema = fs.readJSONSync(schemaPath);
  let instance = fs.readJsonSync(instancePath);

  let validate = ajv.compile(schema);
  let valid = validate(instance);

  return valid;
}