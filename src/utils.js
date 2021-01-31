
let fs = require("fs-extra");
let path = require("path");
let trash = require("trash");
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
   * Saves given data as JSON and YAML to the default or given output directory.
   * Also constructs the file name from the given fields.
   *
   * @param {"all"|"class"|"spec"} scope
   * @param {"rules"|"defs"|"classes"|"specs"} style
   * @param {"NDR"|"IEPD"|"MPD"|"CodeLists"|"CTAS"} label - Specification class ID or tag
   * @param {String} version
   */
  static nameFile(scope, style, label, version) {

    if (scope == "all") {
      return `niem-${style}`.toLowerCase();
    }
    else if (scope == "class") {
      return `${label.replace("MPD", "IEPD")}-${style}`.toLowerCase();
    }
    else if (scope == "spec") {
      return `${label}-${style}-${version}`.toLowerCase();
    }

    console.log("Given scope not supported:", scope);
    return;

  }

  /**
   * Saves given data as JSON and YAML to the default or given output directory.
   * Also constructs the file name from the given fields.
   *
   * @param {"all"|"class"|"spec"} scope
   * @param {"rules"|"defs"|"classes"|"specs"} style
   * @param {"NDR"|"IEPD"|"MPD"|"CodeLists"|"CTAS"} label - Specification class ID or tag
   * @param {String} version
   */
  static nameFileAndSave(scope, style, label, version, data, folder="./output/") {
    let fileName = Utils.nameFile(scope, style, label, version);
    return Utils.save(fileName, data, folder);
  }

  /**
   * Saves given data as JSON and YAML to the default or given output directory.
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

  /**
   * Reads in a YAML file at the given path and returns the data as an object.
   *
   * @param {String} filePath
   * @returns {Object}
   */
  static readYAML(filePath) {
    let normalizedPath = path.join(__dirname, filePath);
    let text = fs.readFileSync(normalizedPath, "utf-8");
    return yaml.parse(text);
  }

  /**
   * Sends files in the given folder to the OS-specific recycle bin.
   */
  static async trash(folder) {
    let normalizedPath = path.resolve(__dirname, folder);
    return trash(normalizedPath);
  }

}

module.exports = Utils;
