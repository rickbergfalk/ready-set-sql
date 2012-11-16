
/* 	View : Lesson SCREEN Editor
	Backbone.js makes my head hurt. Not gonna do it anymore. Traditional JS FTW!
	================================================== */
	
	var ScreenEditor = function (id, screenListItem) {
		
		var screenEditor = this;
		
		var screen = {
			screenText		: screenListItem.getScreen().screenText 	|| "This is a new Screen",
			sqlTarget 		: screenListItem.getScreen().sqlTarget 		|| "",
			sqlExample 		: screenListItem.getScreen().sqlExample 	|| "",
			startingSql 	: screenListItem.getScreen().startingSql 	|| "",
			keepSql 		: screenListItem.getScreen().keepSql 		|| false
		};
		
		var $el = $('#' + id);
		
		
		// render the template
		var fromHtml = $('#lesson-screen-editor-template').html();
		
		//var template = _.template( fromHtml, screen );
		$el.html(fromHtml);
		
		// cache jQuery objects for inputs/elements on screen
		var $legendNumber = $el.find('#legend-number').text(screenListItem.getScreenNumber());
		var $screenText = $el.find('#screen-text');
		var $keepSql = $el.find('#keep-sql');
		
		$el.find('#screen-text').addClass("mceEditor").val(screen.screenText);
		$el.find('#sql-example').text(screen.sqlExample);
		$el.find('#sql-target').text(screen.sqlTarget);
		$el.find('#starting-sql').text(screen.startingSql);
		
		
		tinyMCE.init({
			//mode : "textareas",
			mode : "specific_textareas",
			editor_selector: "mceEditor",
			
			//width: 400,
			height: "400",
			
			// General options
			theme : "advanced",
			//plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
			//plugins : "style,table,advhr,advimage,advlink,inlinepopups,media,paste,noneditable,visualchars,nonbreaking,xhtmlxtras",
			plugins : "style,table,advhr,advimage,advlink,inlinepopups,media,paste,noneditable",
			// Theme options
			theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect",
			theme_advanced_buttons2 : "bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,image,code",
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			
			// Example content CSS (should be your site CSS)
			content_css : "/stylesheets/bootstrap.css"
			
		});
		
		
		// some things can't be easily accomplished in the template/template data pattern
		// so we'll manually script them here.
		// - keepSql checkbox
		if (screen.keepSql) {
			$keepSql.prop("checked", true);
		} else {
			$keepSql.prop("checked", false);
		}
		
		// - codemirror boxes
		var codeMirrorOptions = {
			lineNumbers: false, 
			indentWithTabs : true,
			matchBrackets: true,
			indentUnit: 4,
			mode: "text/x-mysql",
			theme: "monokai",
			tabMode: "indent"//,					// TODO: update this?
			//extraKeys: {"Tab": "indentAuto"}
		};
		cmSqlExample = CodeMirror.fromTextArea(document.getElementById('sql-example'), codeMirrorOptions);
		cmStartingSql = CodeMirror.fromTextArea(document.getElementById('starting-sql'), codeMirrorOptions);
		cmSqlTarget =   CodeMirror.fromTextArea(document.getElementById('sql-target'), codeMirrorOptions);
		
		
		this.setLegendNumber = function (n) {
			$legendNumber.text(n);
		}
		
		this.getScreenData = function () {
			//alert($keepSql.is(':checked'));
			screen.screenText = tinyMCE.get('screen-text').getContent(); // $screenText.val();
			screen.keepSql = $keepSql.is(':checked');
			screen.sqlTarget = cmSqlTarget.getValue();
			screen.sqlExample = cmSqlExample.getValue();
			screen.startingSql = cmStartingSql.getValue();
			//alert(screen.screenType + ' - ' + screen.screenTitle + ' - ' + screen.keepSql);
			return screen;
		}
		
		
	};