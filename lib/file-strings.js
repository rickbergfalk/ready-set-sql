/*
	// target usage
	var FileStrings = require('file-strings');
	var sqls = new FileStrings({
						directory: __dirname + '/sql/', 
						encoding: 'utf8', 
						cache: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'Production')
					});
	
	// returns the contents of user.something.sql file. 
	// In Dev it reads the actual file. 
	// In Production it works off a cache
	sqls.get('user.something.sql') 

*/
var path = require('path'); // allows some relative file path support
var fs = require('fs');

var FileStrings = function (options) {
	if (!options || !options.directory) {
		throw new Error("file-strings module requires a directory");
	}
	this.directory = path.resolve(options.directory) + '/';
	this.encoding = options.encoding || 'utf8';
	this.cache = options.cache || 'true';
	
	var contentCache = {};
	
	var fileList = fs.readdirSync(this.directory);
	fileList.forEach(function(filename) {
		contentCache[filename] = fs.readFileSync((options.directory + filename), 'utf8');
	});
	
	this.get = function (filename) {
		return contentCache[filename];
	};
	
	this.getCache = function() {
		return contentCache;
	};
};

// commonJS module systems
if (typeof module !== 'undefined' && "exports" in module) {
	module.exports = FileStrings;
}
