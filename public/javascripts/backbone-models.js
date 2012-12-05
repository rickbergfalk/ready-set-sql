
/* 	Model : 
	================================================== */
	
	var Lesson = Backbone.Model.extend({
		
		defaults: {
			lesson: {}, // lesson object from JSON
			currentScreenIndex: 0, // options.startingScreen
			furthestScreenIndex: 0
		},
		
		initialize: function () {
			// no initialization necessary anymore - we aren't going to save your lesson position
		},
		
		
		currentLessonScreen: function () {
			//this.getLessonScreen(this.get("currentScreenIndex"));
			var lessonScreen = this.get("lesson").lessonScreens[this.get("currentScreenIndex")];
			lessonScreen.lessonTitle = this.get("lesson").lessonTitle;
			return lessonScreen;
		},
		
		isLastScreen: function () {
			if (this.get("lesson").lessonScreens.length === (Number(this.get("currentScreenIndex")) + 1)) {
				return true;
			} else {
				return false;
			}
		},
		
		furthestPercentCompleteDecimal: function () {
			var screenIndex = this.get("furthestScreenIndex");
			var screenLength = this.get("lesson").lessonScreens.length;
			var percent = ( screenIndex / (screenLength - 1) ); 
			
			var roundNumber = function (num, dec) {
				var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
				return result;
			}
			
			return roundNumber(percent, 2);
		},
		
		percentCompleteDecimal: function () {
			var screenIndex = this.get("currentScreenIndex");
			var screenLength = this.get("lesson").lessonScreens.length;
			var percent = ( screenIndex / (screenLength - 1) ); 
			
			var roundNumber = function (num, dec) {
				var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
				return result;
			}
			
			return roundNumber(percent, 2);
		},
		
		percentComplete: function () {
			//var screenIndex = this.get("currentScreenIndex") + 1;
			var screenIndex = this.get("currentScreenIndex");
			var screenLength = this.get("lesson").lessonScreens.length;
			var percent = (( screenIndex / (screenLength - 1) ) * 100); 
			return percent + '%';
		},
	
		getLessonScreen: function (screenIndex) {
			var lessonScreen = this.get("lesson").lessonScreens[screenIndex];
			lessonScreen.lessonTitle = this.get("lesson").lessonTitle;
			
			// maintain screen index
			this.set({currentScreenIndex: screenIndex});
			var furthestIndex = this.get("furthestScreenIndex");
			if (screenIndex > furthestIndex) {
				this.set({furthestScreenIndex: screenIndex});
			}
			
			return lessonScreen;
		},
		
		getNextScreen: function () {
			var currentIndex = this.get("currentScreenIndex");
			var nextIndex = Number(currentIndex) + 1;
			return this.getLessonScreen(nextIndex);
		},
	
		getPreviousScreen: function () {
			var currentIndex = this.get("currentScreenIndex");
			var previousIndex = Number(currentIndex) - 1;
			
			return this.getLessonScreen(previousIndex);
		}
	
	});
	
	
	
	
/* 	Model : 
	================================================== */
	
	var LessonScreen = Backbone.Model.extend ({
	
		defaults: function() {
			return {
				order			: screenList.nextOrder(),
				screenType		: "InfoOnly", // WriteSQL, Question
				screenTitle		: "lesson screen title",
				screenText		: "this test is on the page",
				questionText	: "",
				sqlTarget 		: "",
				startingSql 	: ""
			};
		},

		clear: function() {
			this.destroy();
		}

	});

	var ScreenEditor = function (id) {
	
		var $el = $('#' + id);
	
		var template = _.template( $("#lesson-editor-template").html(), {} );
		this.el.html( template );
	
	};