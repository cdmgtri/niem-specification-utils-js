
let fs = require("fs-extra");
let NIEMSpecs = require("../src/index");

/** @type {NIEMSpecs} */
let specs;

/**
 * Test that the newly-generated rule and definition files match the expected ones in the output directory
 */
describe("Specification checks", () => {

  beforeAll( () => {
    specs = NIEMSpecs.parse("./test/output");
  });

  test("#compare files", () => {
    checkSpecificationFiles("NDR", ["3.0", "4.0", "5.0"]);
    checkSpecificationFiles("MPD", ["3.0.1"]);
    checkSpecificationFiles("CodeLists", ["4.0"]);
    checkOutput("niem-rules");
    checkOutput("niem-defs");
  });

  /**
   * Checks for expected specifications, rule counts, and definition counts.
   */
  test("#check counts", () => {
    checkCounts("NDR-3.0", 239, 54);
    checkCounts("NDR-4.0", 255, 52);
    checkCounts("NDR-5.0", 260, 52);
    checkCounts("MPD-3.0.1", 60, 44);
    checkCounts("CodeLists-4.0", 29, 56);
  });

  /**
   * Checks for truncated rule and definition texts.
   * - strings ending with ":"
   */
  test("#check truncated", () => {

    let ruleErrors = specs.rules.filter( rule => rule.text.endsWith(":") );
    // expect(ruleErrors.length).toBe(0);

    let defErrors = specs.definitions.filter( def => def.text.endsWith(":") );
    expect(defErrors.length).toBe(0);

  });

});

/**
 * Compares the generated specification and specification set rule and definitions files with
 * those in the output directory.
 *
 * @param {String} tag
 * @param {String[]} versions
 */
function checkSpecificationFiles(tag, versions) {
  checkOutput( NIEMSpecs.fileName("set", "rules", tag) );
  checkOutput( NIEMSpecs.fileName("set", "defs", tag) );
}

/**
 * Finds the specification with the given ID.
 * Compares the actual rule and definition counts with the expected counts.
 *
 * @param {String} specificationID
 * @param {Number} expectedRuleCount
 * @param {Number} expectedDefinitionCount
 */
function checkCounts(specificationID, expectedRuleCount, expectedDefinitionCount) {
  let spec = specs.specification(specificationID);
  expect(spec.rules.length).toBe(expectedRuleCount);
  expect(spec.defs.length).toBe(expectedDefinitionCount);
}

/**
 * Does a simple string comparison of the export files from the tests vs the files in the /output directory
 */
function checkOutput(fileName) {

  let testJSON = fs.readFileSync(`./test/output/${fileName}.json`, "utf8");
  let expectedJSON = fs.readFileSync(`./output/${fileName}.json`, "utf8");
  expect(testJSON).toEqual(expectedJSON);

  let testYAML = fs.readFileSync(`./test/output/${fileName}.yaml`, "utf8");
  let expectedYAML = fs.readFileSync(`./output/${fileName}.yaml`, "utf8");
  expect(testYAML).toEqual(expectedYAML);

}