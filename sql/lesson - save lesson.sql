UPDATE lesson 
SET 
	title = $1, 
	description = $2, 
	updated = CURRENT_TIMESTAMP, 
	screens = $3 
WHERE 
	lesson_id = $4