
# NIEM Specification Utils

Extracts rule and definition information from NIEM specifications into JSON and YAML files.

**Branch status**:
master:
[![Master Build Status](https://github.com/cdmgtri/niem-specification-utils/workflows/build/badge.svg?branch=master)](https://github.com/cdmgtri/niem-specification-utils/actions)
[![Master Coverage Status](https://coveralls.io/repos/github/cdmgtri/niem-specification-utils/badge.svg?branch=master)](https://coveralls.io/github/cdmgtri/niem-specification-utils?branch=master)
dev:
[![Dev Build Status](https://github.com/cdmgtri/niem-specification-utils/workflows/build/badge.svg?branch=dev)](https://github.com/cdmgtri/niem-specification-utils/actions)
[![Dev Coverage Status](https://coveralls.io/repos/github/cdmgtri/niem-specification-utils/badge.svg?branch=dev)](https://coveralls.io/github/cdmgtri/niem-specification-utils?branch=dev)

## Install

```bash
npm install cdmgtri/niem-specification-utils
```

## Usage

```bash
npm run build
```

This will generate separate rules and definition files for each version of each specification in the output directory.

## Test changes

```bash
npm test
```

## CI

Run GitHub Actions CI locally before committing

```bash
act -j build
```

## Add a new version of a specification

- Save the specification HTML file to the src/assets/specifications directory

  - Rename the file if necessary so the name follows the same pattern as the other versions of the spec

- In the custom specification class:
  - add the new version number to the class's static version array
  - update the static currentVersion constant

  ```js
  // File src/ndr/index.js

  NDR.currentVersion = "5.0";
  NDR.versions = ["3.0", "4.0", "5.0"];
  ```
