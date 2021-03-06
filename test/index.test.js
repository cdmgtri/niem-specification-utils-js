
let fs = require("fs-extra");
let { NIEMSpecifications, Utils } = require("../index");


/** @type {NIEMSpecifications} */
let niem;

/**
 * Test that the newly-generated rule and definition files match the expected ones in the output directory
 */
describe("Specification checks", () => {

  beforeAll( () => {
    niem = NIEMSpecifications.parse("./test/output");
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
  test("#check for expected counts", () => {
    checkCounts("NDR-3.0", 239, 54);
    checkCounts("NDR-4.0", 255, 52);
    checkCounts("NDR-5.0", 260, 52);
    checkCounts("MPD-3.0.1", 60, 44);
    checkCounts("CodeLists-4.0", 29, 56);
  });

  /**
   * Checks for truncated rule and definition texts.
   * Text paragraphs may be followed by lists or blockquotes which must be parsed separately.
   *
   * - strings ending with ":"
   */
  test("#check for truncated text", () => {

    let ruleErrors = niem.rules.filter( rule => rule.text.endsWith(":") );
    expect(ruleErrors.length).toBe(0);

    let defErrors = niem.definitions.filter( def => def.text.endsWith(":") );
    expect(defErrors.length).toBe(0);

  });

  /**
   * Checks for rule and definition IDs that do not match the spec.
   */
  test("#check for invalid IDs", () => {

    niem.specifications.filter( spec => spec.html ).forEach( spec => {
      // Combine all parsed rule and definition IDs
      let parsedIDs = [...spec.rules.map( rule => rule.id ), ...spec.defs.map( def => def.id )];

      // Grab all rule and definition IDs from the specification's html
      let matches = [...spec.html.match(/a name="rule_[^"]*"/g), ...spec.html.match(/a name="definition_[^"]*"/g)];
      let htmlIDs = matches.map( match => match.split("\"")[1] );

      let unknownIDs = parsedIDs.filter( parsedID => !htmlIDs.includes(parsedID) );
      expect(unknownIDs.join("\n")).toBe("");
    });

  });

});

/**
 * Compares the generated specification and specification class rule and definitions files with
 * those in the output directory.
 *
 * @param {String} tag
 * @param {String[]} versions
 */
function checkSpecificationFiles(tag, versions) {
  checkOutput( Utils.nameFile("class", "rules", tag) );
  checkOutput( Utils.nameFile("class", "defs", tag) );
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
  let spec = niem.specification(specificationID);
  expect(spec.rules.length).toBe(expectedRuleCount);
  expect(spec.defs.length).toBe(expectedDefinitionCount);
}

/**
 * Does a simple string comparison of the export files from the tests vs the files in the /output directory
 */
function checkOutput(fileName) {

  let testJSON = fs.readFileSync(`./test/output/json/${fileName}.json`, "utf8");
  let expectedJSON = fs.readFileSync(`./output/json/${fileName}.json`, "utf8");
  expect(testJSON).toEqual(expectedJSON);

  let testYAML = fs.readFileSync(`./test/output/yaml/${fileName}.yaml`, "utf8");
  let expectedYAML = fs.readFileSync(`./output/yaml/${fileName}.yaml`, "utf8");
  expect(testYAML).toEqual(expectedYAML);

}