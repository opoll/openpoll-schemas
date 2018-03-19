# OpenPoll Schemas

This is a repo containing all the JSON Schema definitions for OpenPoll.

# Usage

`openpoll-schemas` exports two features, an `schemas` object containing a (structured) way of accessing the schemas
(`https://schemas.openpoll.io/0.1/mainchain/block.json` becomes `schemas["0.1"].mainchain.block`), and a `validator`
instance ([`jsonschema`](https://npmjs.com/package/jsonschema)). You can validate your data against the schemas by using
the following code:

```javascript
const schemas = require("openpoll-schemas").schemas;
const validator = require("openpoll-schemas").validator;

let data = {
    some: "data",
    is: false
};

console.log(validator.validate(data, schemas["0.1"].mainchain.block));
```

# Additional information

All schemas in this package can also be found on https://schemas.openpoll.io. The ID of a schema should resolve to a
valid URL.