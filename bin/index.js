#!/usr/bin/env node

// Parse rule and definition info from NIEM specifications and save results to /output/
let niemSpecs = require("../src/index").parse();
