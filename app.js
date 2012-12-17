
/**
 * Module dependencies.
 */

var express = require('express')
  , lessonRoutes = require('./routes/lessonRoutes')
  , lessonlistRoutes = require('./routes/lessonlistRoutes')
  , http = require('http')
  , appDb = require('./lib/appDb')
  , isBadSql = require('./lib/is-bad-sql')
  , crypto = require('crypto')
  , fs = require('fs')
  , path = require('path')
  , banHammer = require('./lib/banHammer')
  , postgrator = require('postgrator');


/* ============================================================
    load some environment variables if they are not present
	This really should be outside the app, 
	and in a separate app running script... but...
=============================================================== */    
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

  
  
/* ============================================================
    Postgrator stuff
=============================================================== */  
if (!process.env.NODE_ENV) console.log('NODE_ENV not set');
if (!process.env.DATABASE_URL) console.log('DATABASE_URL not set');

postgrator.setMigrationDirectory(__dirname + '/migrations');
postgrator.setConnectionString(process.env.DATABASE_URL);
postgrator.migrate('012');

 


/* ============================================================
    Some Middleware
=============================================================== */
var editorsOnly = function (req, res, next) {
	if (req.session && req.session.isSignedIn) {
		next();
	} else {
		res.redirect('/signin');
	}
};


 
/* ============================================================
    Express Setup and stuff
=============================================================== */
 
var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	
	app.use(banHammer.handleBannedPeople);
	
	app.use(app.router);
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
	
});

app.configure('development', function(){
	app.use(express.errorHandler());
});




/* ============================================================
    PreCalc 
	Basically a cache of all the lesson data. 
	Should be refreshed each time a lesson or lessonlist is changed/added
	
	it looks like:
	precalc.lessonlists: [
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
=============================================================== */

var precalc = {
	lessonLists: [],
	refreshLessonLists: function () {
		
		var sql = "SELECT ll.lessonlist_id AS listId, ll.name AS listName, ll.description AS listDescription, ll.seq AS listSeq, l.lesson_id AS lessonId, l.title AS lessonTitle, l.description AS lessonDescription, l.seq AS lessonSeq FROM lesson l JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id ORDER BY ll.seq, l.seq";
	
		appDb.query(sql, [], function(err, results) {
			if (err) {
				console.log('precalc.refreshLessonLists() failure to run query');
				precalc.lessonLists = [];
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
				
				precalc.lessonLists = lessonLists;
			}
		});
		
	}
};	
precalc.refreshLessonLists();




/* ============================================================
    Some glocals?
=============================================================== */
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
		text: 'about',
		url: '/about'
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

/* ============================================================
    The Routes
=============================================================== */

//app.get('/', routes.index);
app.get('/', function(req, res){
	//console.log('remoteAddress: ' + req.connection.remoteAddress);
	res.locals.title = 'Learn some SQL';
	res.locals.lessonLists = precalc.lessonLists;
	res.render('index', {});
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
	app.locals.links = everyonesLinks;
	res.redirect('/');
});

app.get('/signin', function(req, res) {
	res.locals.title = 'Are you Rick? | Learn some SQL';
	res.locals.message = false;
	res.render('sign-in');
});

app.post('/signin', function(req, res) {
	
	var message = false;
	
	if (req.session.attempts === undefined) {
		req.session.attempts = 0;
	}
	
	if (req.body.passphrase === 'yes') {
		req.session.isSignedIn = true;
		req.session.attempts = 0;
		app.locals.links = editorsLinks;
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
app.get('/lessonlist/edit', [editorsOnly], function (req, res) {
	res.locals.lessonLists = precalc.lessonLists;
	res.render('lesson-list-editor', {title: 'Edit some SQL'});
});
app.get('/edit', [editorsOnly], function (req, res) {
	res.locals.lessonLists = precalc.lessonLists;
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


/*
 *	Lists
 *
 *****************************************************************************/
lessonlistRoutes.setPrecalc(precalc); // this adds a reference to the precalc object from within lessonRoutes module
app.get('/lessonlist', lessonlistRoutes.getAll);
app.post('/lessonlist/id/:id', lessonlistRoutes.save);



/*
 *	Lesson
 *
 *****************************************************************************/
lessonRoutes.setPrecalc(precalc); // this adds a reference to the precalc object from within lessonRoutes module
app.put('/lesson', lessonRoutes.create);
app.get('/lesson', lessonRoutes.getAll);
app.get('/lesson/unlisted', lessonRoutes.getUnlisted);
app.get('/lesson/listid/:id', lessonRoutes.getByListId);
app.get('/lesson/:id/:format?', lessonRoutes.getByLessonId);
app.get('/edit/lesson/:id?', lessonRoutes.editById);
app.post('/lesson/:id', lessonRoutes.save);


 
 
 
/*	
 *	AJAXy things
 *	
 *****************************************************************************/

var checkBadSql = function (req, res, next) {
	
	var sqlQuery = req.body.sqlQuery || '';
	
	if (isBadSql(sqlQuery)) {
		
		// take note of the offenders remoteAddress (IP Address)
		// After so many attacks, they should be silenced.
		// We can't do this on the session object, because it'll reset on browser close/change.
		var offense = banHammer.recordOffense(req.connection.remoteAddress);
		
		
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
		
			appDb.query(sqlQuery, [], function(err, results) {
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
		
	}
	
});


app.get('/req', function(req, res) {
	res.send({ip: req.ip});
});


 
/*
 *	Error Routes and Stuff
 *
 *****************************************************************************/
// A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
	throw new Error('This is a 500 Error');
});

// A Route for Creating a 404 Error (Useful to keep around)
app.get('/404', function(req, res){
	throw new NotFound();
});

//app.get('/*', function(req, res){
	//throw new NotFound();
//});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}





/* ============================================================
    The Server
=============================================================== */

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
