import ajv = require("ajv");

interface NestedSchemas {
	[key: string]: NestedSchemas;
}

interface OpenPollSchemas {
	validator: ajv.Ajv;
	schemas: NestedSchemas;
	schemasFlat: {
		[key: string]: any
	};
}

declare var _: OpenPollSchemas;
export = _;