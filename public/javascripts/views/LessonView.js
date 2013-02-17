
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

LessonView = Backbone.View.extend({
			
	el: '#main-body', 
	
	model: {}, // lesson JSON
	myCodeMirror: {},
	screenCache: {},
	screenSQLResult: null,
	
	initialize: function(){
		//this.render();
	},
	
	render: function(){
		var me = this;
		
		var lessonContent = {};
		
		
		// Cache all the jQuery objects
		this.$screenText = $('#screen-text');
		
		this.$previousButton = $('#previous-button');
		this.$runSql = $('#run-sql');
		this.$advanceButton = $('#advance-button');
		this.$helpButton = $('#help-btn');
		
		this.$tableContainer = $('#table-container');
		this.$progressBar = $('#progress-bar');
		this.$editor = $('#editor');
		this.$subBrand = $('#sub-brand');
		
		this.$subBrand.text(this.model.get("lesson").lessonTitle);
		
		
		// Create CodeMirror
		this.myCodeMirror = CodeMirror(this.$editor.get(0), {
			lineNumbers: false, 
			tabmode: "indent",
			indentWithTabs : true,
			matchBrackets: true,
			indentUnit: 4,
			
			value: "",
			mode: "text/x-mysql",
			theme: "monokai",
			extraKeys: {
				"Ctrl-E": function (cm) {
					me.runSQL();
				}, 
				"Cmd-E": function (cm) {
					me.runSQL();
				}
			}
		});
		
		var lessonScreenObj = this.model.currentLessonScreen();
		// render lesson screen
		this.renderScreen(lessonScreenObj);
		
	},
	
	cacheScreen: function() {
		// before we render anything, make sure we cache any interactions the user has made
		// for example: SQL written, results
		var currentScreenIndex = this.model.get("currentScreenIndex");
		this.screenCache[currentScreenIndex] = {
			screenSql: this.myCodeMirror.getValue(),
			tableContainerHtml: this.$tableContainer.html()
		};
	},
		
	renderScreen: function(screenData) {
		var me = this;
		
		var currentScreenIndex = this.model.get("currentScreenIndex");
		var furthestScreenIndex = this.model.get("furthestScreenIndex");
		var lessonId = this.model.get("lesson").lessonId;
		
		this.$screenText.html(screenData.screenText);
		
		// look for any SQL blocks - render them in codemirror
		$('pre > code').each(function(index, element) {
			$(this).parent().addClass('cm-s-monokai');
			CodeMirror.runMode($(this).html(), 'text/x-mysql', $(this).parent().get(0));
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
				data: {database: 'rickber2_nodejs_mysql_test', sqlQuery: screenData.sqlTarget},
				success: function (data, textStatus, jqXHR) {
					me.screenSQLResult = data.results;
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					console.log(jqXHR.responseText);
					console.log(textStatus);
					console.log(errorThrown);
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
		
		// if there is a SQL example, render it via Codemirror's runMode.
		if (screenData.sqlExample) {
			var $pre = $('<pre>' + screenData.sqlExample + '</pre>').appendTo(me.$screenText).addClass('cm-s-monokai');
			CodeMirror.runMode(screenData.sqlExample, 'text/x-mysql', $pre.get(0));
		}
		
		// if this is the last screen, disable the next button
		// the user should be presented with different actions to follow
		// 		- go to next lesson
		// 		- go to lesson list
		if (this.model.isLastScreen()) { 
			this.disableAdvanceButton();
			this.$screenText.append($('#template-final-lesson-screen').html());
			$('#next-lesson-button')
				.html("Next Lesson <br><br>" + this.model.get("lesson").nextLessonListName + ": " + this.model.get("lesson").nextLessonTitle)
				.attr("href", "/lesson/" + this.model.get("lesson").nextLessonId);
		}
		
		// update the progress bar
		this.$progressBar.width(this.model.percentComplete());
		
	},
	
	enableAdvanceButton: function () {
		this.$advanceButton.removeAttr('disabled').addClass('btn-primary').children().addClass('icon-white');
	},
	
	disableAdvanceButton: function () {
		this.$advanceButton.attr('disabled', 'disabled').removeClass('btn-primary').children().removeClass('icon-white');
	},
	
	enableSqlButtons: function () {
		this.$runSql.removeAttr('disabled').addClass('btn-primary').children().addClass('icon-white');
		this.$helpButton.removeAttr('disabled');
	},
	disableSqlButtons: function () {
		this.$runSql.attr('disabled', 'disabled').removeClass('btn-primary').children().removeClass('icon-white');
		this.$helpButton.attr('disabled', 'disabled');
	},
	
	events: {
		"click #advance-button"		: "advanceButtonClick",
		"click #previous-button"	: "previousScreen",
		"click #run-sql"			: "runSQL",
		"click #help-btn" 			: "help",
		"click #help-confirm-btn" 	: "helpConfirmed"
	},
	
	advanceButtonClick: function (event) {
		
		// check to see if advance-button is not disabled
		// even though advance-button is disabled, click event could still register via icon :(
		if (!$(event.target).parent().is(':disabled')) {
			this.advanceScreen();
		}
	},
	
	advanceScreen: function( event ){
		this.cacheScreen();
		this.renderScreen(this.model.getNextScreen());
	},
	
	previousScreen: function (event) {
		this.cacheScreen();
		this.renderScreen(this.model.getPreviousScreen());
	}, 
	
	clearQueryResults: function () {
		this.$tableContainer.empty();
	},
	
	help: function () {
		// Opens the help modal.
		// Right now this happens automatically via bootstrap. May need to come here if there are problems?
	},
	
	helpConfirmed: function () {
		// takes target SQL and pastes it into the codemirror input box.
		var currentScreen = this.model.currentLessonScreen();
		this.myCodeMirror.setValue(currentScreen.sqlTarget);
	},
	
	runSQL: function ( event ){
		var me = this;
		
		var $queryMessage = $('#query-message');
		$queryMessage.hide();
		
		// clear SQL results areas. 
		// For the time being this will serve as an indicator that something is happening.
		me.$tableContainer.empty();
		$queryMessage.show().html('<div class="query-message">Running query...</div>');
		
		var processQueryResults = function(data, textStatus, jqXHR) {
			console.log(data);
			// Render the response as appropriate
			
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
			data: {sqlQuery: this.myCodeMirror.getValue()},
			success: processQueryResults,
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
				console.log(jqXHR.responseText);
				$queryMessage.show().html(jqXHR.responseText);
				console.log(textStatus);
				console.log(errorThrown);
			},
			dataType: 'json'
		});
		
	}
});