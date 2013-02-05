/* =========================================================================
	Cool SqlRunner helper
	Runs SQL queries stored in .sql files. 
	Has a hook for a mapping/tranformation function to translate the pg result.rows object into something more helpful.
============================================================================ */ 

var SqlRunner = require('../lib/sql-runner');
var sqlRunner = new SqlRunner({
						sqlFolderPath: 		'./sql/', 
						connectionString: 	process.env.DATABASE_URL,
						encoding: 			'utf8', // this is the default, and is not necessary
						cache: 				true // TODO: Support not caching sql file contents. (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'Production') 
					});




// GET /lessonlist
// get a list of *all* lessonlists
exports.getAll = function(req, res) {
	sqlRunner.runSqlFromFile('lessonlist - get all.sql', [], null, function(err, results) {
		if (err) {
			console.log(err);
			res.send(500, 'query failed to execute');
		} else {
			res.send({
				success: true,
				lessonlists: results
			});
		}
	});
};


// POST /lessonlist/id/:id
// save lessonlist by lessonlistId
exports.save = function(req, res) {
	
	var lessonListId = req.params.id;
	var lessonIds = req.body.lessonIds;
	console.log(lessonIds);
	
	var statements = [];
	var errs = [];
	
	statements.push({
		sql: 'lesson - clear lessonlist info by lessonlist_id.sql',
		params: [lessonListId]
	});
	
	var lessonIdLength = 0;
	if (lessonIds) lessonIdLength = lessonIds.length;
	
	for (var i = 0; i < lessonIdLength; i++) {
		statements.push({
			sql: 'lesson - set lessonlist by lesson_id.sql',
			params: [lessonListId, i, lessonIds[i]]
		});
	}
	
	var runNextStatement = function () {
		if (statements.length) {
			// we still have a sql query to run
			var next = statements.shift();
			console.log(next);
			sqlRunner.runSqlFromFile(next.sql, next.params, null, function(err, results) {
				if (err) errs.push(err);
				runNextStatement();
			});
		} else {
			// we are all done running sql. 
			// check the errors, and send response to browser accordingly.
			if (errs.length) {
				res.send(500, 'One or more of the queries went terribly wrong. This might get messy...');
			} else {
				res.send({ success: true });
			}
		}
	}
	runNextStatement();
	
};