
let specificationData = {
  /** @type {"NDR"|"IEPD"|"CodeLists"|"CTAS"} */
  classID: "",
  tag: "",
  name: "",
  version: "",
  current: false,
  url: "",
};

/** @type {specificationData[]} */
module.exports = [
  {
    classID: "NDR",
    version: "3.0",
    url: "https://reference.niem.gov/niem/specification/naming-and-design-rules/3.0/niem-ndr-3.0.html"
  },
  {
    classID: "NDR",
    version: "4.0",
    url: "https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html"
  },
  {
    classID: "NDR",
    version: "5.0",
    current: true,
    url: "https://reference.niem.gov/niem/specification/naming-and-design-rules/5.0/niem-ndr-5.0.html"
  },
  {
    classID: "IEPD",
    tag: "MPD",
    name: "Model Package Description",
    version: "3.0.1",
    current: true,
    url: "https://reference.niem.gov/niem/specification/model-package-description/3.0.1/model-package-description-3.0.1.html"
  },
  {
    classID: "CodeLists",
    version: "4.0",
    current: true,
    url: "https://reference.niem.gov/niem/specification/code-lists/4.0/niem-code-lists-4.0.html"
  },
  {
    classID: "CTAS",
    version: "3.0",
    current: true,
    url: "https://reference.niem.gov/niem/specification/conformance-targets-attribute/3.0/NIEM-CTAS-3.0-2014-07-31.html"
  }
];
