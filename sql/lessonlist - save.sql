UPDATE lessonlist
SET 
	name = $1,
	description = $2
WHERE
	lessonlist_id = $3