import jsonschema = require("jsonschema");

interface NestedSchemas {
	[key: string]: NestedSchemas;
}

interface OpenPollSchemas {
	validator: jsonschema.Validator;
	schemas: NestedSchemas;
}

declare var _: OpenPollSchemas;
export = _;