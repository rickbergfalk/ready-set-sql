SELECT 
	lessonlist_id, 
	name, 
	seq, 
	description,
	is_visible 
FROM 
	lessonlist 
WHERE
	lessonlist_id = $1