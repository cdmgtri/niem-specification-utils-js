
/**
 * Converts the definitions in api-schema.json to a file of JSDoc custom types.
 *
 * This file can be imported in other projects to get Intellisense for
 * the NIEM API objects defined by this project.
 */

const fs = require("fs-extra");
const path = require("path");
const jsdoc = require("json-schema-to-jsdoc");

let jsDocs = "\n";
let str = "";

/** @type {string[]} */
let moduleExports = [];

let schema = fs.readJSONSync( path.join(__dirname, "niem-rule-schema-deref.json") );

for (let key in schema.properties) {

  if (key === "$schema") {
    continue;
  }

  let elementName = key;
  let typeName = key + "Type";

  // Get the JSDoc representation of the schema definition
  str = jsdoc(schema.properties[key], {name: typeName});

  // Update the JSDoc to replace the empty @name parameter with @typedef
  str = str.replace("@name", `@typedef {Object} ${typeName}`) + "\n\n";

  // Create an element with the new JSDoc type
  str += `/** @type {${typeName}} */ \n`;
  str += `let ${elementName} = {}; \n\n`;

  jsDocs += str;
  moduleExports.push(elementName);
}

jsDocs += `module.exports = { ${moduleExports.join(", ")} }`;

fs.outputFileSync("jsdocs/index.js", jsDocs);
console.log(jsDocs);
