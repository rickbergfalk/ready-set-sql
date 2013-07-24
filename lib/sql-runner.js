var pg = require('pg');

var SqlRunner = function(options) { 
	// check for mandatory options. Throw error if they aren't supplied. 
	if (!options.connectionString) {
		throw new Error("SqlRunner requires a connectionString");
	}
	var connectionString = options.connectionString;
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
	};
}

// commonJS module systems
if (typeof module !== 'undefined' && "exports" in module) {
	module.exports = SqlRunner;
}