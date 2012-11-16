	
	
CREATE TABLE lesson (
	lesson_id		SERIAL,
	title			VARCHAR(50)		NULL,
	description		VARCHAR(300)	NULL,
	created 		TIMESTAMP		NULL,
	updated 		TIMESTAMP		NULL,
	screen_count 	INT 			NULL,
	screens 		TEXT			NULL,
	lessonlist_id	INT 			NULL,
	seq 			INT 			NULL,
	PRIMARY KEY (lesson_id)
);

INSERT INTO lesson (title, description, created, updated, screen_count, screens, lessonlist_id, seq) 
	VALUES ('Lesson Engine Demo', 'This is a walk-through of what the lesson engine is capable of.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, '[{"screenTitle": "Welcome!","screenText": "<p>This lesson is just for demonstrating the lesson capabilities build so far. Dont expect to learn any SQL quite yet.</p><img src=\'http://www.drinnan.com/davedrinnan/wp-content/uploads/2010/11/ist2_267869-ntsc-tv-test-pattern1.jpg\' width=\'200px\' />"}, {"screenTitle": "InfoOnly Screen Type","screenText": "<p>This lesson screen is an <b>InfoOnly</b> screen type. It is purely informational and does not require any action for the user to advance to the next screen (other than clicking the next button anyways)...</p>"}, {"screenTitle": "InfoOnly Screen Type","screenText": "<p>InfoOnly screens should be used for introducing the lesson, explaining concepts, and transitioning between activities that may be present in the lesson.</p><p>The text should be short and scannable. Images should be worked in to help break up endless screens of text.</p>"}, {"screenTitle": "Writing SQL","screenText": "Questions only go so far though. The big draw to these SQL lessons is the interactive piece of... writing SQL. </p><p>Time to give this a shot. Try typing this query out into that big black box over there:<br/><br/><pre>SELECT &#10;&#09;* &#10;FROM &#10;&#09;test</pre>","sqlTarget": "SELECT * FROM test","startingSql": "-- Write your query over here "}, {"screenTitle": "Well Done!","screenText": "<p>Just like the Question screen, the Lesson Engine will advance to the next screen upon completing the SQL writing task. Only correct queries will advance - SQL that is incomplete or returns a different-than-expected result will not.</p><p>Also, see how your query is still present in the editor? This is because the \'keepSql\' setting for this screen is set to <em>true</em>.</p>","keepSql": true}, {"screenTitle": "Clearing SQL","screenText": "<p>If that option is missing or set to false for the screen, the users SQL is cleared out.</p>"}, {"screenTitle": "Final Screen","screenText": "<p>That about wraps up the Lesson Engine Demo. We hope you enjoyed it!</p><p>Upon advancing this screen you will be left with a system generated screen, which will provide additional actions that you may want to take based on the status of your user session.</p>"}]', 1, 1);
INSERT INTO lesson (title, description, created, updated, screen_count, screens, lessonlist_id, seq) 
	VALUES ('New Lesson', 'Just an auto-inserted lesson', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '[{"screenTitle": "this is a test"}]', 1, 2);
INSERT INTO lesson (title, description, created, updated, screen_count, screens, lessonlist_id, seq) 
	VALUES ('Another Lesson', 'Second auto-inserted lesson', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '[{"screenTitle": "this is a test"}]', 1, 3);

	
	
	
CREATE TABLE lessonlist (
	lessonlist_id	SERIAL,
	name 			VARCHAR(50) 	NULL,
	seq 			INT				NULL,
	is_visible		INT				NULL,
	PRIMARY KEY (lessonlist_id)
);

INSERT INTO lessonlist (name, seq, is_visible) VALUES ('The Basics', 1, 1);
INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Filtering Results', 2, 1);
INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Working with Multiple Tables', 3, 1);
INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Aggregating Data', 4, 1);
INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Tips & Tricks', 5, 0); 


