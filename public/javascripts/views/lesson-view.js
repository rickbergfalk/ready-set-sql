
var QueryResult = function (results) {
	this.results = results;
	/*
		<table class="table table-striped table-bordered ">
			<thead>
				<tr id="table-header">
					<% for (field in fields) { %>
							<th> <%= field %> </th>
						<% } %>
				</tr>
			</thead>
			<tbody id="table-body">
				<% for (var r = 0; r < results.length; r++) { %>
				<% 	var record = results[r]; %>
					<tr>
						<% for (col in record) { %>
							<td> <%= record[col] %> </td>
						<% } %>
					</tr>
				<% } %>
			</tbody>
		</table>
	*/
	this.$table = $('<table class="table table-striped table-bordered">');
	this.$thead = $('<thead>').appendTo(this.$table);
	this.$headTr = $('<tr id="table-header">').appendTo(this.$thead);
	this.$tbody = $('<tbody id="table-body">').appendTo(this.$table);
	
	var firstrow = results[0] || {};
	for (column in firstrow) {
		$('<th>' + column + '</th>').appendTo(this.$headTr);
	} 
	
	for (record in results) {
		var $tr = $('<tr>');
		for (column in results[record]) {
			$('<td>' + results[record][column] + '</td>').appendTo($tr);
		}
		$tr.appendTo(this.$tbody);
	}
} 

var LessonView = function (lesson) {
	var me = this;	
	this.el = '#main-body';
	this.model = lesson || {}; // lesson object
	this.myCodeMirror = {}
	this.screenCache = {};
	this.screenSQLResult = null;
	
	this.$screenText = $('#screen-text');
	this.$previousButton = $('#previous-button');
	this.$runSql = $('#run-sql');
	this.$advanceButton = $('#advance-button');
	this.$helpButton = $('#help-btn');
	this.$tableContainer = $('#table-container');
	this.$progressBar = $('#progress-bar');
	this.$editor = $('#editor');
	this.$subBrand = $('#sub-brand');
	
	this.render = function () {
		
		this.$subBrand.text(this.model.lessonTitle);
				
		// Create CodeMirror
		this.myCodeMirror = CodeMirror(this.$editor.get(0), {
			lineNumbers: false,  
			indentWithTabs : true,
			matchBrackets: true,
			indentUnit: 4,
			value: "",
			mode: "text/x-plsql",
			theme: "monokai",
			extraKeys: {
				"Ctrl-E": function (cm) {
					me.runSQL();
				}, 
				"Cmd-E": function (cm) {
					me.runSQL();
				},
				"Ctrl-Left": function (cm) {
					me.previousScreen();
				},
				"Cmd-Left": function (cm) {
					me.previousScreen();
				},
				"Ctrl-Right": function (cm) {
					me.advanceButtonClick();
				},
				"Cmd-Right": function (cm) {
					me.advanceButtonClick();
				},
				"Ctrl-Enter": function (cm) {
					me.runSQL();
				},
				"Cmd-Enter": function (cm) {
					me.runSQL();
				}
			}
		});
		
		var lessonScreenObj = this.model.currentLessonScreen();
		// render lesson screen
		this.renderScreen(lessonScreenObj);
		
		// Add events to all the stuff
		// Now that all the functions exist, 
		this.$advanceButton.click(me.advanceButtonClick);
		this.$previousButton.click(me.previousScreen); // TODO - make this consistent
		this.$runSql.click(me.runSQL);
		//this.$helpButton.click(me.help);	
		$('#help-confirm-btn').click(me.helpConfirmed);
		
		
	}
	
	this.cacheScreen = function() {
		// before we render anything, make sure we cache any interactions the user has made
		// for example: SQL written, results
		var currentScreenIndex = this.model.currentScreenIndex;
		this.screenCache[currentScreenIndex] = {
			screenSql: this.myCodeMirror.getValue(),
			tableContainerHtml: this.$tableContainer.html()
		};
	}
		
	this.renderScreen = function(screenData) {
		var currentScreenIndex = this.model.currentScreenIndex;
		var furthestScreenIndex = this.model.furthestScreenIndex;
		var lessonId = this.model.lessonId;
		
		this.$screenText.html(screenData.screenText);
		
		// look for any SQL blocks - render them in codemirror
		$('pre > code').each(function(index, element) {
			$(this).parent().addClass('cm-s-monokai');
			CodeMirror.runMode($(this).text(), 'text/x-mysql', $(this).parent().get(0));
		});
		
		// Match any inline code elements that are NOT contained within a pre element
		/*
		$('code:not(pre > code)').each(function(index, element) {
			$(this).addClass('cm-s-monokai');
			CodeMirror.runMode($(this).html(), 'text/x-mysql', $(this).get(0));
		});
		*/
		
		if (currentScreenIndex === 0) {
			this.$previousButton.attr('disabled', 'disabled');
		} else {
			this.$previousButton.removeAttr('disabled');
		}
		
		if (screenData.sqlTarget) {
			// if there is a sqlTarget, 
			// the user shouldn't be able to advance to the next screen until completing the query
			this.enableSqlButtons();
			this.disableAdvanceButton();
			
			$.ajax({
				type: 'post',
				url: '/query',
				data: {sqlQuery: screenData.sqlTarget},
				success: function (data, textStatus, jqXHR) {
					me.screenSQLResult = data.results;
				},
				error: function (jqXHR, textStatus, errorThrown) {
					alert("uh-oh. Something seems to be wrong with our interactive query functionality. Sorry about that...");
				},
				dataType: 'json'
			});
			
		} else {
			// user will use the next button to advance
			this.disableSqlButtons();
			this.enableAdvanceButton();
			this.screenSQLResult = null;
		}
		
		
		// if the user has already been through this screen 
		// - enable the advance button
		// - remove the primary class from run-sql button (if it is there)
		if (currentScreenIndex < furthestScreenIndex) {
			this.enableAdvanceButton();
			this.disableSqlButtons();
		}
		
		
		// if there is cache data for this screen, load it up
		// otherwise load per the lesson screen's instruction
		var screenCache = this.screenCache[currentScreenIndex];
		if (screenCache) {
			this.myCodeMirror.setValue(screenCache.screenSql);
			this.$tableContainer.html(screenCache.tableContainerHtml);
		} else {
			// rendering actions for all screens:
			// if startingSQL has been provided, load that and clear query results
			// otherwise, if keepSql is not checked, clear the codemirror 
			if (screenData.startingSql) {
				this.myCodeMirror.setValue(screenData.startingSql);
				this.clearQueryResults();
			} else if (!screenData.keepSql) {
				this.myCodeMirror.setValue('');
				this.clearQueryResults();
			}
		}
		
		// if this is the last screen, disable the next button
		// the user should be presented with different actions to follow
		// 		- go to next lesson
		// 		- go to lesson list
		if (this.model.isLastScreen()) { 
			this.disableAdvanceButton();
			this.$screenText.append($('#template-final-lesson-screen').html());
			$('#next-lesson-button')
				//.html("Next Lesson <br><br>" + this.model.nextLessonListName + ": " + this.model.nextLessonTitle)
				.html("Next Lesson <br><br>" + this.model.nextLessonTitle)
				.attr("href", "/lesson/" + this.model.nextLessonId);
		}
		
		// update the progress bar
		me.$progressBar.width(this.model.percentComplete());
		
	}
	
	this.enableAdvanceButton = function () {
		me.$advanceButton.removeAttr('disabled').addClass('btn-primary').children().addClass('icon-white');
	}
	
	this.disableAdvanceButton = function () {
		me.$advanceButton.attr('disabled', 'disabled').removeClass('btn-primary').children().removeClass('icon-white');
	}
	
	this.enableSqlButtons = function () {
		me.$runSql.removeAttr('disabled').addClass('btn-primary').children().addClass('icon-white');
		me.$helpButton.removeAttr('disabled');
	}
	
	this.disableSqlButtons = function () {
		me.$runSql.attr('disabled', 'disabled').removeClass('btn-primary').children().removeClass('icon-white');
		me.$helpButton.attr('disabled', 'disabled');
	}
	
	this.advanceButtonClick = function (event) {
		// check to see if advance-button is not disabled
		// Because even though advance-button is disabled, click event could still register via icon :(
		// NOTE: This can't be moved into the .advanceScreen method, 
		// as that is used elsewhere to advance the screen after a query matches the desired result.
		// TODO: Should we give the editor focus?
		if (!me.$advanceButton.is(':disabled')) {
			me.advanceScreen();
		}
	}
	
	this.advanceScreen = function( event ){
		me.cacheScreen();
		me.renderScreen(me.model.getNextScreen());
	}
	
	this.previousScreen = function (event) {
		if (me.model.currentScreenIndex > 0) {
			me.cacheScreen();
			me.renderScreen(me.model.getPreviousScreen());
		}
	}
	
	this.clearQueryResults = function () {
		me.$tableContainer.empty();
	}
	
	this.help = function () {
		// Opens the help modal.
		// Right now this happens automatically via bootstrap. May need to come here if there are problems?
	}
	
	this.helpConfirmed = function () {
		// takes target SQL and pastes it into the codemirror input box.
		var currentScreen = me.model.currentLessonScreen();
		me.myCodeMirror.setValue(currentScreen.sqlTarget);
	}
	
	this.runSQL = function (event) {
		var $queryMessage = $('#query-message');
		$queryMessage.hide();
		
		// clear SQL results areas. 
		// For the time being this will serve as an indicator that something is happening.
		me.$tableContainer.empty();
		$queryMessage.show().html('<div class="query-message">Running query...</div>');
		
		var processQueryResults = function(data, textStatus, jqXHR) {
			if (data.results) {
				// not showing record count anymore?
				//me.$lessonInputActionText.empty().text(data.results.length + " records returned.");
				var queryResult = new QueryResult(data.results);
				me.$tableContainer.empty().append(queryResult.$table);
				$queryMessage.hide();
				
				// if there's target results, and we match it, then advance the screen
				if (me.screenSQLResult) {
					if (_.isEqual(data.results, me.screenSQLResult)) {
						// proceed to next screen
						me.advanceScreen();
					} else {
						// the query runs, but the results are not what we are looking for.
						//me.$tableContainer.prepend('<div class="query-message">Sorry. Your query runs, but the result is incorrect.</div>');
						$queryMessage.show().html("Sorry. Your query runs, but the result is incorrect.");
					}	
				}
			} else {
				//me.$tableContainer.empty().html('<div class="query-message">No Results Returned</div>');
				$queryMessage.show().html("No Results Returned");
			}
		};
		
		$.ajax({
			type: 'post',
			url: '/query',
			data: {sqlQuery: me.myCodeMirror.getValue()},
			success: processQueryResults,
			error: function (jqXHR, textStatus, errorThrown) {
				$queryMessage.show().html(jqXHR.responseText);
			},
			dataType: 'json'
		});
		
	}
	
};