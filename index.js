const promisify = require("util").promisify;
const fs = require("fs");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const path = require("path");
const validator = new (require("jsonschema").Validator);

module.exports.validator = validator;
module.exports.initialized = false;

const walk = async (directory) => {
	let schemas = {};
	let files = await readdir(directory);

	for(let file of files) {
		let absolutePath = path.join(directory, file);
		if ((await stat(absolutePath)).isDirectory()) {
			schemas[file] = await walk(absolutePath);
		} else if (path.extname(file) == ".json") {
			let schema = require(absolutePath);
			schemas[path.basename(file, ".json")] = schema;
			validator.addSchema(schema);
		}
	};

	return schemas;
};

module.exports.loaded = walk(path.resolve(__dirname, "schemas")).then(schemas => {
	module.exports.schemas = schemas;
	module.exports.initialized = true;
});