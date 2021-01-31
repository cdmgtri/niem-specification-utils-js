
let fs = require("fs-extra");
let path = require("path");
let yaml = require("yamljs");

/**
 * General utility functions to support the project.
 */
class Utils {

  /**
   * Flattens an array of arrays
   * @template T
   * @param {T[][]} arrays - An array of arrays
   * @returns {T[]}
   */
  static flatten(arrays) {
    return [].concat.apply([], arrays);
  }

  /**
   * Saves given data as JSON and YAML to the output directory
   *
   * @param {String} fileName - Base file name, no extension or path
   * @param {Object} data - Data to save
   * @param {String} [folder='./output/'] - Folder to save output files.  Defaults to /output.
   */
  static save(fileName, data, folder="./output/") {

    let outputPath = path.resolve(folder, fileName.toLowerCase());

    fs.outputJSONSync(outputPath + ".json", data, {spaces: 2});

    // YAML library isn't calling toJSON on stringify so run it through manually
    let yamlData = JSON.parse(JSON.stringify(data));
    fs.outputFileSync(outputPath + ".yaml", yaml.stringify(yamlData));

  }

  /**
   * Reads the specification html file in the specifications directory with the given tag and version
   */
  static readSpecificationHTMLText(tag, version) {
    let html = fs.readFileSync(`specifications/${tag}-${version}.html`, {encoding: "utf8"});
    return html;
  }

}

module.exports = Utils;
