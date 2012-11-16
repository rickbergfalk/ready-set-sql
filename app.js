
/**
 * Module dependencies.
 */

var express = require('express')
  , lessonRoutes = require('./routes/lessonRoutes')
  , lessonlistRoutes = require('./routes/lessonlistRoutes')
  , http = require('http')
  , appDb = require('./lib/appDb')
  , crypto = require('crypto')
  , fs = require('fs')
  , mysql = require('mysql')
  , config = require('./lib/config')
  , path = require('path')
  , postgrator = require('postgrator');

  
/* ============================================================
    Postgrator stuff
=============================================================== */  
var envConfig = config[process.env.NODE_ENV];
var cs = "tcp://" + envConfig.user + ":" + envConfig.password + "@" + envConfig.host + "/" + envConfig.database;

console.log(process.env.NODE_ENV);
console.log(cs);

postgrator.setMigrationDirectory(__dirname + '/migrations');
postgrator.setConnectionString(cs);
postgrator.migrate('003');
  
  
/* ============================================================
    Convenience functions
=============================================================== */

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};
var hashPassword = function (password) {
	var salt = '@n@lystSQL';
	return md5(salt + password + salt);
};
 


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

var obsessiveLogging = function (req, res, next) {
	//console.log('remoteAddress: ' + req.connection.remoteAddress);
	/*
	if (req.session) {
		console.log('*** SESSION ***');
		console.log(req.session);
	}
	*/
	next();
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
	
	app.use(obsessiveLogging);
  
	
	app.use(app.router);
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});




/* ============================================================
    Support Functions
=============================================================== */

/*
 *	PreCalc
 *  - a place to cache data frequently used.
 *  - for now its just the lessonlist on the home page. 
 *		But later it could be individual lessons if usage is heavy enough.
 *
 *****************************************************************************/
var precalc = {
	lessonLists: [],
	refreshLessonLists: function () {
		
		var sql = "SELECT ll.lessonlist_id AS listId, ll.name AS listName, ll.description AS listDescription, ll.seq AS listSeq, l.lesson_id AS lessonId, l.title AS lessonTitle, l.description AS lessonDescription, l.seq AS lessonSeq FROM lesson l JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id ORDER BY ll.seq, l.seq";
	
		appDb.query(sql, [], function(err, results) {
			if (err) {
				console.log('database query error: couldnt get lessons for homepage :( ');
				precalc.lessonLists = [];
			} else {
				var lessonLists = [];
				var lessonListCounter = -1;
				
				for (i = 0; i < results.length; i++) {
					var listname = results[i].listname;
					var listid = results[i].listid;
					var listDescription = results[i].listdescription;
					
					if (lessonLists[lessonListCounter] && lessonLists[lessonListCounter].listname == listname) {
						lessonLists[lessonListCounter].lessons.push(results[i]);
					
					} else {
						// we've approached a new list. Increment the lessonListcounter
						lessonListCounter = lessonListCounter + 1;
						// if currentList has lessons
						lessonLists[lessonListCounter] = {};
						lessonLists[lessonListCounter].listid = listid;
						lessonLists[lessonListCounter].listname = listname;
						lessonLists[lessonListCounter].listDescription = listDescription;
						lessonLists[lessonListCounter].lessons = [];
						lessonLists[lessonListCounter].lessons.push(results[i]);
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
app.get('/credits', function(req, res) {
	res.locals.title = 'Credits | Learn some SQL';
	res.render('credits');
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
	
	var envConfig = config[process.env.NODE_ENV];
	var cs = "tcp://" + envConfig.user + ":" + envConfig.password + "@" + envConfig.host + "/" + envConfig.database;

	postgrator.setMigrationDirectory(__dirname + '/migrations');
	postgrator.setConnectionString(cs);
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
app.post('/query', function(req, res) {
	
	var sqlQuery = req.body.sqlQuery || '';

	if (sqlQuery.trim().length > 0) {
	
		appDb.query(sqlQuery, [], function(err, results) {
			if (err) {
				console.log('err: /query');
				console.log(err);
				res.send({
					success: false, 
					message: 'query failed to execute'
				});
			} else {
				console.log('Finished Query: ' + Date());
				console.log(results);
				res.send({
					success: true,
					results: results
				});
			}
		});
		
	} else {
		res.send({
			success: false, 
			message: 'Query not provided'
		});
	}
	
		
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

// A Catch-all route for anything we missed. 
// By default it'll return the root route, 
// which will be our single-page apps main page.
// (ALWAYS Keep this as the last route) 
// This used to be for 404's, but there really isn't such a thing if our app only has 1 page now is there?
//app.get('/*', function(req, res){
//    res.redirect('/');
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
