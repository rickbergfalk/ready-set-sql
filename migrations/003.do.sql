
	
--CREATE TABLE lessonlist (
--	lessonlist_id	SERIAL,
--	name 			VARCHAR(50) 	NULL,
--	seq 			INT				NULL,
--	is_visible		INT				NULL,
--	PRIMARY KEY (lessonlist_id)
--);

--INSERT INTO lessonlist (name, seq, is_visible) VALUES ('The Basics', 1, 1);
--INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Filtering Results', 2, 1);
--INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Working with Multiple Tables', 3, 1);
--INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Aggregating Data', 4, 1);
--INSERT INTO lessonlist (name, seq, is_visible) VALUES ('Tips & Tricks', 5, 0); 

-- Want to add a column to lessonlist for description

ALTER TABLE lessonlist ADD COLUMN description VARCHAR(500);

UPDATE lessonlist 
	SET description = 
		  'Learn how to view the data from a table using the SELECT statement. Show all columns or just some of them.'
	WHERE 
		name = 'The Basics';

UPDATE lessonlist 
	SET description = 
		  'Most of the time you don''t want to view all the data from a table - you just want some of it. That''s where query filters come in. Restrict data returned by your query using the WHERE clause. '
	WHERE 
		name = 'Filtering Results';
		
UPDATE lessonlist 
	SET description = 
		  'Working with multiple tables?'
	WHERE 
		name = 'Working with Multiple Tables';