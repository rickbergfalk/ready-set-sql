/*
	SqlRunner: Helper/wrapper thing to make calling SQL easy and shorter.
	
	You give it a sql file directory and connection string.
	During instantiation it reads the directory, and caches the .sql file contents
	
	To use, call the doSql() method, and supply: 
		- sql Folder Path
		- parameters array (used in the pg module)
		- mapping function (should take pg module results object, and transform it into an array of business logic objects (ie models))
		- finished callback (which should take (err, finalMappedObjects))
	
	An example
	
	var sqlRunner = new SqlRunner({
			sqlFolderPath: 		'/path/to/sql', 
			connectionString: 	process.env.DATABASE_URL,
			encoding: 			'utf8', // this is the default, and is not necessary
			cache: 				true  	// caching on by default. May want to turn off if in development 
		});
		.
		
	sqlRunner.runSql('lesson - get by id', [id], mapToLessons, function(err, lessons) {
		// handle err or lessons here
	})
	
=================================================================== */

var pg = require('pg');
var path = require('path');
var fs = require('fs');


// The SqlRunner Object
var SqlRunner = function(options) { 
	// check for mandatory options. Throw error if they aren't supplied. 
	if (!options.connectionString) {
		throw new Error("SqlRunner requires a connectionString");
	}
	
	var sqlFolderPath;
	var connectionString = options.connectionString;
	var encoding = options.encoding || 'utf8';
	var cache = options.cache || true;
	var contentCache = {};
	
	if (options.sqlFolderPath) {
		sqlFolderPath = path.resolve(options.sqlFolderPath) + '/';
		
		// here we'll read the directory and internally cache the sql file contents. 
		var fileList = fs.readdirSync(sqlFolderPath);
		fileList.forEach(function(filename) {
			contentCache[filename] = fs.readFileSync((sqlFolderPath + filename), encoding);
		});
	}
	
	// method to run SQL
	this.runSql = function (sql, parameters, mappingFunction, finishedCallback) {
		pg.connect(connectionString, function(err, client) {
			if (err) {
				console.log('Error connecting to pg');
				console.log(err);
				finishedCallback(err);
			} else {
				client.query(sql, parameters, function(err, result) {
					if (err) {
						console.log('Error running query');
						console.log(err);
						finishedCallback(err);
					} else {
						//console.log(result.rows);
						var results = result.rows;
						if (mappingFunction) {
							results = mappingFunction(results);
						}
						finishedCallback(err, results);
						//pg.end();
					}
				});
			}
		});
	}
	
	// Sometimes we want to run SQL from a file. 
	// This method is a wrapper around .runSql to do just that
	this.runSqlFromFile = function (sqlFileName, parameters, mappingFunction, finishedCallback) {
		if (!sqlFolderPath) throw new Error("To run SQL from a file you must specify a folder path (options.sqlFolderPath)");
		var sql;
		if (cache) {
			sql = contentCache[sqlFileName]; // TODO: Check to make sure a directory has been specified. It might not be
		} else {
			sql = fs.readFileSync((sqlFolderPath + sqlFileName), encoding);
		}
		this.runSql(sql, parameters, mappingFunction, finishedCallback);
	}
	
}


// commonJS module systems
if (typeof module !== 'undefined' && "exports" in module) {
	module.exports = SqlRunner;
}