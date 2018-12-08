
let fs = require("fs-extra");
let NIEMSpecs = require("../index");

test("NDR 3.0 rules", () => {
  let ndrRules = NIEMSpecs.NDR.generateRules("3.0");
  expect(ndrRules.length).toEqual(239);
});

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

test("All rules", () => {
  let allRules = NIEMSpecs.generateAllRules();
  fs.writeJSONSync("test/niem-rules.json", allRules, {spaces: 2});
  expect(allRules.length).toEqual(494);
});
