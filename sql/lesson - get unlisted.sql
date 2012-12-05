SELECT l.lesson_id, l.title, l.description 
FROM lesson l 
LEFT JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id 
WHERE ll.lessonlist_id IS NULL