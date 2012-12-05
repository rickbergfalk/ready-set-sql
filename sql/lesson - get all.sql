SELECT 
	ll.name AS listName, 
	ll.seq AS listSeq, 
	l.lesson_id AS lessonId, 
	l.title AS lessonTitle, 
	l.description AS lessonDescription, 
	l.seq AS lessonSeq 
FROM 
	lesson l 
	JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id