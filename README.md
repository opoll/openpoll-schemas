# OpenPoll Schemas

This is a repo containing all the JSON Schema definitions for OpenPoll.

# Usage

`@openpoll/schemas` exports several helpers to access and validate data against their schemas.

* `schemas` contains a structured (nested) object with schema definitions. A schema with
  `"$id": "https://schemas.openpoll.io/0.1/poll/response.json"` is accessible through `schemas["0.1"].poll.response`
* `schemasFlat` contains an object where the IDs of the schemas are the key, and the schema is the value (e.g. 
  `schemasFlat["https://schemas.openpoll.io/0.1/poll/response.json"]` returns the schema)
* `validator` is an instance of [`ajv`](https://github.com/epoberezkin/ajv), loaded with all the schemas in this
  package, plus the drafts that these schemas follow
* `validate` a quick wrapper that wraps the `validator.validate` method. It returns `true` or `false` depending on the
  validity of the data. `validate` expects a schema or the `$id` of a schema as the first parameter, and the data as 2nd

```javascript
const { schemas, validate, validator } = require("@openpoll/schemas");

let data = {
    some: "data",
    is: false
};

console.log(validate(schemas["0.1"].mainchain.block, data)); // returns false

// To check the errors that occur, you have to use the ajv validator
// validator.errors always stores the latest result, so if you want to use the errors somewhere else,
// you'll have to copy the data into another variable
console.error("Errors", validator.errors);
```

# Additional information

All schemas in this package can also be found on https://schemas.openpoll.io. The ID of a schema should resolve to a
valid URL.
