var appDb = require('../lib/appDb');
var FileStrings = require('../lib/file-strings');

/* ============================================================
    SQL FileStrings
	(because inline SQL was icky)
	
	use it like: 
		sqls.get('user-get-all.sql')
=============================================================== */  

//var sqls = new FileStrings({directory: path.resolve('./sql/') + '/'}); 
var sqls = new FileStrings({directory: './sql/'}); 

var precalc = {};
exports.setPrecalc = function(pc) {
	precalc = pc;
};

// GET /lessonlist
exports.getAll = function(req, res) {
	// get a list of *all* lessonlists
	console.log('getting all lists');
	//var sql = "SELECT lessonlist_id, name, seq, is_visible FROM lessonlist ORDER BY seq";
	appDb.query(sqls.get('lessonlist - get all.sql'), [], function(err, results) {
		if (err) {
			console.log(err);
			res.send({ success: false });
		} else {
			res.send({
				success: true,
				lessonlists: results
			});
		}
	});
};



// POST /lessonlist/id/:id
exports.save = function(req, res) {
	// save lessonlist by lessonlistId
	var lessonListId = req.params.id;
	var lessonIds = req.body.lessonIds;
	console.log(lessonIds);
	
	var statements = [];
	var errs = [];
	
	statements.push({
		//sql: 	"UPDATE lesson SET lessonlist_id = NULL, seq = NULL WHERE lessonlist_id = $1",
		sql: sqls.get('lesson - clear lessonlist info by lessonlist_id.sql'),
		params: [lessonListId]
	});
	
	var lessonIdLength = 0;
	if (lessonIds) lessonIdLength = lessonIds.length;
	
	for (var i = 0; i < lessonIdLength; i++) {
		statements.push({
			//sql: 	'UPDATE lesson SET lessonlist_id = $1, seq = $2 WHERE lesson_id = $3',
			sql: sqls.get('lesson - set lessonlist by lesson_id.sql'),
			params: [lessonListId, i, lessonIds[i]]
		});
	}
	
	var runNextStatement = function () {
		if (statements.length) {
			// we still have a sql query to run
			var next = statements.shift();
			console.log(next);
			appDb.query(next.sql, next.params, function(err, results, fields) {
				if (err) errs.push(err);
				runNextStatement();
			});
		} else {
			// we are all done running sql. 
			// check the errors, and send response to browser accordingly.
			console.log('all done');
			if (errs.length) {
				res.send({ success: false });
			} else {
				res.send({ success: true });
			}
			
			// refresh the lesson lists on homepage
			precalc.refreshLessonLists();
		}
	}
	runNextStatement();
	
};