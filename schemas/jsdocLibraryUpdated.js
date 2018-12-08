
// Updated library code

const fs = require('fs');
const json = require('json-pointer');

module.exports = generate;

/**
 * Generate a JSDoc typedef for the given JSON schema property (dereferenced).
 *
 * @param {Object} schema
 * @param {Object} [options]
 * @param {string} [options.name] - The name of the typedef
 * @returns
 */
function generate(schema, options = {}) {
  let jsdoc = '';

  if (!schema || Object.keys(schema).length === 0) {
    return jsdoc;
  }

  jsdoc += '/**\n';
  jsdoc += writeDescription(schema, null, options.name);

  if (!json.has(schema, '/properties')){
    if (schema.enum) {
      let enums = generateEnums(schema.enum);
      jsdoc = `/** @typedef {${enums}} ${options.name} - ${schema.description} */`;
    }
    return jsdoc;
  }

  jsdoc += processProperties(schema, false, options);

  jsdoc += '  */\n';

  return jsdoc;
}

function processProperties(schema, nested, options = {}) {
  const props = json.get(schema, '/properties');
  const required = json.has(schema, '/required') ? json.get(schema, '/required') : [];

  let text = '';
  let prev = "";
  for (let property in props) {
    if (Array.isArray(options.ignore) && options.ignore.includes(property)) {
      continue;
    } else {
      // let prefix = nested ? prev + '.' : '';

      // CDM: New section to add object prefix
      let prefix = "";
      let newSubs = {};
      if (props[property].properties) {
        for (let subProperty in props[property].properties) {
          newSubs[property + "." + subProperty] = props[property].properties[subProperty]
        }
        props[property].properties = newSubs;
      }

      if (props[property].type === 'object' && props[property].properties) {
        prev = property;
        text += writeParam('object', prefix + property, props[property].description, true);
        text += processProperties(props[property], true);
      } else {
        let optional = !required.includes(property);
        let type = getType(props[property]) || upperFirst(property);

        let description = props[property].description;
        if (!description && props[property].example) {
          description = "Example: " + props[property].example;
        }
        text += writeParam(type, prefix + property, description, optional);
      }
    }
  }
  return text;
}

function writeDescription(schema, suffix = 'object', name) {
  let text = `\n  * @typedef {Object} ${name} - `;
  text += schema.description || `Represents a ${schema.id} ${suffix}`;
  return `  * ${text}\n  *\n`;
}

function writeParam(type = '', field, description = '', optional) {
  const fieldTemplate = optional ? `[${field}]` : field;
  return `  * @property {${type}} ${fieldTemplate} - ${description} \n`;
}

function getType(schema) {
  if (schema.$ref) {
    const ref = json.get(root, schema.$ref.substr(1));
    return getType(ref);
  }

  if (schema.enum) {
    return generateEnums(schema.enum);
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.includes('null')) {
      return `?${schema.type[0]}`;
    } else {
      return schema.type.join('|');
    }
  }

  return schema.type;
}

function upperFirst(str = '') {
  return str.substr(0,1).toUpperCase() + str.substr(1);
}

/**
 * Returns a JSDoc enumeration string, e.g., `"Enum1"|"Enum2"|"Enum3"`
 * @param {string[]} enums
 */
function generateEnums(enums) {
  /** @type {string[]} */
  let quotedEnums = enums.map( enumeration => "\"" + enumeration + "\"");
  return quotedEnums.join("|");
}
