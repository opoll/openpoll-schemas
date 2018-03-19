const fs = require("fs");
const path = require("path");
const validator = new (require("jsonschema").Validator);

module.exports.validator = validator;

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
			validator.addSchema(schema);
		}
	};

	return schemas;
};

module.exports.schemas = walk(path.resolve(__dirname, "schemas"));

// Remove references that have been resolved now
const unresolvedRefs = validator.unresolvedRefs;

unresolvedRefs.forEach((id) => {
	if (validator.schemas[id]) {
		let index = validator.unresolvedRefs.indexOf(id);
		validator.unresolvedRefs.splice(index);
	}
});
