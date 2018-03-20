import ajv = require("ajv");

interface NestedSchemas {
	[key: string]: NestedSchemas;
}

interface OpenPollSchemas {
	validator: ajv.Ajv;
	validate: (schema: any, data: any) => boolean;
	schemas: NestedSchemas;
	schemasFlat: {
		[key: string]: any
	};
}

declare var _: OpenPollSchemas;
export = _;