const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();

module.exports.validator = ajv;
module.exports.schemasFlat = {};

const walk = (directory) => {
	let schemas = {};
	let files = fs.readdirSync(directory);

	for(let file of files) {
		let absolutePath = path.join(directory, file);
		if (fs.statSync(absolutePath).isDirectory()) {
			schemas[file] = walk(absolutePath);
		} else if (path.extname(file) == ".json") {
			let schema = require(absolutePath);
			schemas[path.basename(file, ".json")] = schema;
			module.exports.schemasFlat[schema["$id"]] = schema;
			ajv.addSchema(schema);
		}
	};

	return schemas;
};

module.exports.schemas = walk(path.resolve(__dirname, "schemas"));
