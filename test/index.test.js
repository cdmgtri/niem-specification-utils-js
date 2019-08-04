
let fs = require("fs-extra");
let Ajv = require("ajv");
let NIEMSpecs = require("../index");

let ajv = new Ajv();

let allRules = NIEMSpecs.generateAllRules();
let allDefs = NIEMSpecs.generateAllDefinitions();

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
    expect(allRules.length).toEqual(583);
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

  test("MPD 3.0.1", () => {
    let rules = NIEMSpecs.MPD.generateRules("3.0.1");
    expect(rules.length).toEqual(60);
  });

});

describe("Test def counts", () => {

  test("All defs", () => {
    expect(allDefs.length).toEqual(206);
  });

  test("NDR 3.0", () => {
    let defs = NIEMSpecs.NDR.generateDefinitions("3.0");
    expect(defs.length).toEqual(54);
  });

  test("NDR 4.0", () => {
    let defs = NIEMSpecs.NDR.generateDefinitions("4.0");
    expect(defs.length).toEqual(52);
  });

  test("Code Lists 4.0", () => {
    let defs = NIEMSpecs.CodeLists.generateDefinitions("4.0");
    expect(defs.length).toEqual(56);
  });

  test("MPD 3.0.1", () => {
    let defs = NIEMSpecs.MPD.generateDefinitions("3.0.1");
    expect(defs.length).toEqual(44);
  });

});

describe("Rule fields", () => {

  test("id required", () => {
    expect( emptyFields(allRules, "id") ).toEqual(0);
  });

  test("number required", () => {
    expect( emptyFields(allRules, "number") ).toEqual(0);
  });

  test("title required", () => {
    expect( emptyFields(allRules, "title") ).toEqual(0);
  });

  test("text required", () => {
    expect( emptyFields(allRules, "text") ).toEqual(0);
  });

  test("section id required", () => {
    expect( emptyFields(allRules, "section", "id") ).toEqual(0);
  });

});

describe("Def fields", () => {

  test("id required", () => {
    expect( emptyFields(allDefs, "id") ).toEqual(0);
  });

  test("term required", () => {
    expect( emptyFields(allDefs, "term") ).toEqual(0);
  });

  test("text required", () => {
    expect( emptyFields(allDefs, "text") ).toEqual(0);
  });

  test("section id required", () => {
    expect( emptyFields(allDefs, "section", "id") ).toEqual(0);
  });

});

describe("Specification URLs", () => {

  let ndr = NIEMSpecs.create("NDR", "4.0");

  test("version", () => {
    expect(ndr.version).toBe("4.0");
  });

  test("document url", () => {
    expect(ndr.url).toBe("https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html");
  });

  test("rule url", () => {
    expect(ndr.ruleURL("9-1")).toBe("https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html#rule_9-1");
  });

  test("document url", () => {
    expect(ndr.defURL("application information")).toBe("https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html#definition_application_information");
  });

});


/**
 * Check to see that the given array does not contain any fields with a "" value.
 *
 * @param {Object[]} items
 * @param {string} field
 */
function emptyFields(items, field, subField) {

  let label = field;
  let results = items.filter( elt => ! elt[field] || elt[field] === "");

  if (subField) {
    label += "." + subField;
    results = items.filter( elt => elt[field][subField] === "");
  }

  if (results.length > 0) {
    console.log(
      results
        .map( result => result.specification.version + " " + label + " " + result.id || result.number)
        .sort()
        .join("\n"),
      "\n", results.length
    );
  }

  return results.length;
}

describe("JSON validation", () => {

  test("test/niem-rules.json", () => {
    let valid = validate("schemas/niem-rule.schema.json", allRules);
    expect(valid).toBeTruthy();
  });

  test("test/niem-defs.json", () => {
    let valid = validate("schemas/niem-def.schema.json", allDefs);
    expect(valid).toBeTruthy();
  });

});

/**
 * Validates the given JSON instance against the specified schema.
 *
 * @param {string} schemaPath
 * @param {Object} instance
 */
async function validate(schemaPath, instance) {

  let schema = fs.readJSONSync(schemaPath);

  let validate = ajv.compile(schema);
  let valid = validate(instance);

  let errs = ajv.errors;
  if (errs) {
    console.log(errs.toString());
  }

  return valid;
}