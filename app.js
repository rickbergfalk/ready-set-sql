
/* =========================================================================
	Module dependencies.
============================================================================ */  
var express = require('express');
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var moment = require('moment'); // a date library
var postgrator = require('postgrator');


/* =========================================================================
    load some environment variables if they are not present
	This really should be outside the app, 
	and in a separate app running script... but...
============================================================================ */  
if (!process.env.NODE_ENV || !process.env.DATABASE_URL) {
	console.log('Environment variable is missing - loading the .env');
	try {
		var envFile = fs.readFileSync(__dirname + '/.env', 'utf8');
		var envSettings = envFile.replace(/\r/g, '').split('\n');
		envSettings.forEach(function(setting) {
			keyvalue = setting.split('=');
			if (keyvalue.length == 2) {
				console.log('setting process.env.' + keyvalue[0] + ' = ' + keyvalue[1]);
				process.env[keyvalue[0]] = keyvalue[1];
			}
		});
	} catch (err) {
		console.log(err);
	}
}


var isBadSql = require('./lib/is-bad-sql');
var banHammer = require('./lib/banHammer');
var lessonRoutes = require('./routes/lessonRoutes');
var lessonlistRoutes = require('./routes/lessonlistRoutes');

var SqlRunner = require('./lib/sql-runner');
var sqlRunner = new SqlRunner({	connectionString: process.env.DATABASE_URL }); 



/* =========================================================================
    Postgrator stuff
============================================================================ */ 
if (!process.env.NODE_ENV) throw new Error('process.env.NODE_ENV is not set');
if (!process.env.DATABASE_URL) throw new Error('process.env.DATABASE_URL is not set');

postgrator.setMigrationDirectory(__dirname + '/migrations');
postgrator.setConnectionString(process.env.DATABASE_URL);
postgrator.migrate('013', function(err) {
	if (err) console.log(err);
});



/* =========================================================================
    Some Middleware
============================================================================ */
var editorsOnly = function (req, res, next) {
	if (req.session && req.session.isSignedIn) {
		next();
	} else {
		res.redirect('/signin');
	}
};


 
/* =========================================================================
    Express Setup and stuff
============================================================================ */
var app = express();

app.configure('development', function(){
	app.use(express.errorHandler());
	app.use(express.logger('dev'));
});


app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	
	app.use(banHammer.handleBannedPeople);
	
	// Determine which links should be used (per view)
	// (Whether or not to show editor links is directly related to whether someone is logged in or not
	// before this I used app.locals, which meant 1 person logs in and *everyone* got the editors links)
	app.use(function(req, res, next) {
		if (req.session && req.session.isSignedIn) { 
			res.locals.links = editorsLinks;
		} else { 
			res.locals.links = everyonesLinks;
		}
		next();
	});
	
	app.use(app.router);
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
	
	// Since this is the last non-error-handling
	// middleware use()d, we assume 404, as nothing else
	// responded.
	app.use(function(req, res, next){
		// the status option, or res.statusCode = 404
		// are equivalent, however with the option we
		// get the "status" local available as well
		res.render('404', { status: 404, url: req.url });
	});

	// error-handling middleware, take the same form
	// as regular middleware, however they require an
	// arity of 4, aka the signature (err, req, res, next).
	// when connect has an error, it will invoke ONLY error-handling
	// middleware.

	// If we were to next() here any remaining non-error-handling
	// middleware would then be executed, or if we next(err) to
	// continue passing the error, only error-handling middleware
	// would remain being executed, however here
	// we simply respond with an error page.
	
	app.use(function(err, req, res, next){
		// we may use properties of the error object
		// here and next(err) appropriately, or if
		// we possibly recovered from the error, simply next().
		res.render('500', {
			status: err.status || 500,
			error: err
		});
	});
	
});




/* =========================================================================
    App Locals
============================================================================ */
var everyonesLinks = [
	{
		text: 'Lessons',
		url: '/'
	}, {
		text: 'About',
		url: '/about'
	}, {
		text: 'More SQL Resources',
		url: '/more-sql-resources'
	}
];
var editorsLinks = [
	{
		text: 'Lessons',
		url: '/'
	}, {
		text: 'About',
		url: '/about'
	}, {
		text: 'More SQL Resources',
		url: '/more-sql-resources'
	}, {
		text: 'superquery',
		url: '/superquery'
	}, {
		text: 'editor',
		url: '/edit'
	}, {
		text: 'sign out',
		url: '/signout'
	}
];
app.locals.links = everyonesLinks;
app.locals.title = 'Learn some SQL'; // Default title if none is provided
app.locals.makeTable = function (columns, rows) {
	var html = '<table class="table table-demo table-bordered table-striped" style="">'
	html = html + '<thead><tr>';
	for (var c = 0; c < columns; c++) {
		html = html + '<th>   </th>';
	}
	// close table header row, start body
	html = html + '</tr></thead><tbody>';
	for (var r = 0; r < rows; r++) {
		var rowHtml = '<tr>'
		for (var c = 0; c < columns; c++) {
			rowHtml = rowHtml + '<td> </td>';
		}
		rowHtml = rowHtml + '</tr>';
		html = html + rowHtml;
	}
	// clost body and table
	html = html + '</tbody></table>';
	return html;
};



/* =========================================================================
    The Routes
============================================================================ */

/* ============================================
	lessonlists: [
		{
			listid: n,
			listname: '',
			listDescription: '',
			lessons: [
				{
					listid,
					listname,
					listdescription,
					listseq,
					lessonid,
					lessontitle,
					lessondescription,
					lessonseq
				}
			]
		}
	]
=============================================== */
app.get('/', function(req, res){
	var sql = "SELECT ll.lessonlist_id AS listId, ll.name AS listName, ll.description AS listDescription, ll.seq AS listSeq, l.lesson_id AS lessonId, l.title AS lessonTitle, l.description AS lessonDescription, l.seq AS lessonSeq FROM lesson l JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id ORDER BY ll.seq, l.seq";
	sqlRunner.runSql(sql, [], null, function(err, results) {
		if (err) {
			throw new Error('Homepage LessonLists query failure');
		} else {
			var lessonLists = [];
			var lessonListCounter = -1;
			
			for (i = 0; i < results.length; i++) {
				var lesson = results[i];
				
				if (lessonLists[lessonListCounter] && lessonLists[lessonListCounter].listname == lesson.listname) {
					lessonLists[lessonListCounter].lessons.push(lesson);
				} else {
					// we've approached a new list. Increment the lessonListcounter
					lessonListCounter = lessonListCounter + 1;
					// if currentList has lessons
					lessonLists[lessonListCounter] = {};
					lessonLists[lessonListCounter].listid = lesson.listid;
					lessonLists[lessonListCounter].listname = lesson.listname;
					lessonLists[lessonListCounter].listDescription = lesson.listdescription;
					lessonLists[lessonListCounter].lessons = [];
					lessonLists[lessonListCounter].lessons.push(lesson);
				}
			}
			
			res.locals.lessonLists = lessonLists;
			res.render('index', {});
		}
	});	
});

app.get('/about', function(req, res) {
	res.render('About', {});
});

app.get('/more-sql-resources', function(req, res) {
	res.locals.title = 'More SQL Resources | Learn some SQL';
	res.render('more-sql-resources');
});

app.get('/signout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

app.get('/signin', function(req, res) {
	res.locals.title = 'Are you Rick? | Learn some SQL';
	res.locals.message = false;
	res.render('sign-in');
});

app.post('/signin', function(req, res) {
	var message;
	if (req.session.attempts === undefined) {
		req.session.attempts = 0;
	}
	if (req.body.passphrase === process.env.PASSPHRASE) {
		req.session.isSignedIn = true;
		req.session.attempts = 0;
		res.redirect('/edit');
	} else {
		req.session.isSignedIn = false;
		req.session.attempts = req.session.attempts + 1;
		if (req.session.attempts === 1) {
			message = "That's not the passphrase";
		} else if (req.session.attempts > 1) {
			message = "That's not the passphrase either";
		}
		res.render('sign-in', {
			title: 'Learn some SQL',
			message: message,
			session: req.session
		});
	}		
});


// mostly a client-side driven page
app.get('/edit', [editorsOnly], function (req, res) {
	res.render('lesson-list-editor', {title: 'Edit some SQL'});
});

app.get('/migrate/:version', [editorsOnly], function (req, res) {
	var version = req.params.version;
	postgrator.setMigrationDirectory(__dirname + '/migrations');
	postgrator.setConnectionString(process.env.DATABASE_URL);
	postgrator.migrate(version, function(err, migrations) {
		if (err) {
			res.send(err)
			console.log('error running the migration');
			console.log(err);
		}
		res.send(migrations);
	});
});



/* =========================================================================
	Lists
============================================================================ */
app.get('/lessonlist', lessonlistRoutes.getAll);
app.post('/lessonlist/id/:id', lessonlistRoutes.save);



/* =========================================================================
	Lesson
============================================================================ */
app.put('/lesson', lessonRoutes.create);
app.get('/lesson', lessonRoutes.getAll);
app.get('/lesson/unlisted', lessonRoutes.getUnlisted);
app.get('/lesson/listid/:id', lessonRoutes.getByListId);
app.get('/lesson/:id/:format?', lessonRoutes.getByLessonId);
app.get('/edit/lesson/:id?', lessonRoutes.editById);
app.post('/lesson/:id', lessonRoutes.save);

 
 
/* =========================================================================
	AJAXy things
============================================================================ */

var checkBadSql = function (req, res, next) {
	var sqlQuery = req.body.sqlQuery || '';
	if (isBadSql(sqlQuery)) {
		// take note of the offenders remoteAddress (IP Address)
		// After so many attacks, they should be silenced.
		// We can't do this on the session object, because it'll reset on browser close/change.
		var offense = banHammer.recordOffense(req);
		// 403 == forbidden
		res.send(403, offense.message);
	} else {
		next();
	}
};

 
app.post('/query', checkBadSql, function(req, res) {
	var sqlQuery = req.body.sqlQuery || '';
	if (isBadSql(sqlQuery)) {
		// 403 is forbidden
		res.send(403, 'That kind of SQL is not allowed. Try anything else funny and you will be banned.');
	} else {
		if (sqlQuery.trim().length > 0) {
			sqlRunner.runSql(sqlQuery, [], null, function(err, results) {
				if (err) {
					// 400 is bad request
					res.send(400, 'Query failed because <br>' + err.message);
				} else {
					// Before we send results, we should change the dates 
					// to strings formatted to how we want them to be.
					for (row in results) {
						for (column in results[row]) {
							var field = results[row][column];
							if (field instanceof Date) {
								var m = moment.utc(field);
								results[row][column] = m.format('MM/DD/YYYY HH:mm:SS');
							}
						}
					}
					res.send({
						results: results
					});
				}
			});
		} else {
			res.send(400, 'Query was not provided');
		}
	}
});


app.get('/req', function(req, res) {
	res.send({
		ip: req.ip, 
		ips: req.ips,
		remoteAddress: req.connection.remoteAddress
	});
});


app.get('/superquery', [editorsOnly], function (req, res) {
	res.render('super-query', {title: 'Edit some SQL'});
});


app.post('/superquery', [editorsOnly], function (req, res) {
	var sqlQuery = req.body.sqlQuery || '';
	if (sqlQuery.trim().length > 0) {
		sqlRunner.runSql(sqlQuery, [], null, function(err, results) {
			if (err) {
				// 400 is bad request
				res.send(400, 'Query failed because <br>' + err.message);
			} else {
				res.send({
					results: results
				});
			}
		});
	} else {
		res.send(400, 'Query was not provided');
	}
});



/* =========================================================================
	Error Route Testing
	(not sure if this is necessary anymore with new Express format)
============================================================================ */
app.get('/500', function(req, res){
	throw new Error('This is a 500 Error');
});



/* =========================================================================
    The Server
============================================================================ */
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
