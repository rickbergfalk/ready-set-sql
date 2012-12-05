UPDATE 
	lesson 
SET 
	lessonlist_id = $1, 
	seq = $2 
WHERE 
	lesson_id = $3