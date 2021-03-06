
/*  Lesson
====================================================== */

var Lesson = function (lesson) {
	this.lessonId 				= lesson.lessonId;
	this.lessonTitle 			= lesson.lessonTitle || "Lesson Title";
	this.lessonDescription 		= lesson.lessonDescription || "";
	this.lessonScreens 			= lesson.lessonScreens || [];
	this.lessonListId			= lesson.lessonListId;
	this.lessonSeq 				= lesson.lessonSeq;
	this.nextLessonId 			= lesson.nextLessonId;
	this.nextLessonTitle		= lesson.nextLessonTitle;
	this.nextLessonListName		= lesson.nextLessonListName;
	this.currentScreenIndex 	= 0;
	this.furthestScreenIndex 	= 0;
	
	this.currentLessonScreen = function () {
		return this.lessonScreens[this.currentScreenIndex];
	}
	
	this.isLastScreen = function () {
		return (this.lessonScreens.length === Number(this.currentScreenIndex + 1));
	}
	
	var roundNumber = function (num, dec) {
		var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
		return result;
	}
	
	this.furthestPercentCompleteDecimal = function () {
		var screenIndex = this.furthestScreenIndex;
		var screenLength = this.lessonScreens.length;
		var percent = ( screenIndex / (screenLength - 1) ); 
		return roundNumber(percent, 2);
	}
	
	this.percentCompleteDecimal = function () {
		var screenIndex = this.currentScreenIndex;
		var screenLength = this.lessonScreens.length;
		var percent = ( screenIndex / (screenLength - 1) ); 
		return roundNumber(percent, 2);
	}
	
	this.percentComplete = function () {
		var screenIndex = this.currentScreenIndex;
		var screenLength = this.lessonScreens.length;
		var percent = (( screenIndex / (screenLength - 1) ) * 100); 
		return percent + '%';
	}
	
	this.getLessonScreen = function (screenIndex) {
		var lessonScreen = this.lessonScreens[screenIndex];
		// maintain screen index
		this.currentScreenIndex = screenIndex;
		var furthestIndex = this.furthestScreenIndex;
		if (screenIndex > furthestIndex) {
			this.furthestScreenIndex = screenIndex;
		}
		return lessonScreen;
	}
	
	this.getNextScreen = function () {
		var currentIndex = this.currentScreenIndex;
		var nextIndex = Number(currentIndex) + 1;
		return this.getLessonScreen(nextIndex);
	}
	
	this.getPreviousScreen = function () {
		var currentIndex = this.currentScreenIndex;
		var previousIndex = Number(currentIndex) - 1;
		return this.getLessonScreen(previousIndex);
	}
	
}
