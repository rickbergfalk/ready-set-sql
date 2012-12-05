WITH fancylesson AS (
	SELECT 
		l.lesson_id,
		l.title,
		l.description,
		l.screens,
		l.seq AS lesson_seq,
		ll.seq AS lessonlist_seq,
		ll.name AS lessonlist_name,
		rank()  OVER (ORDER BY ll.seq, l.seq) AS lessonOrder
	FROM lesson l
	JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id
	ORDER BY
		ll.seq,
		l.seq
)
SELECT
		current.lesson_id,
		current.title,
		current.description,
		current.screens,
		nextlesson.lesson_id AS nextlesson_id,	
		nextlesson.title AS nextlesson_title,
		nextlesson.lessonlist_name AS nextlesson_listname
FROM fancylesson current
LEFT JOIN fancylesson nextlesson ON current.lessonOrder + 1 = nextlesson.lessonOrder
WHERE current.lesson_id = $1 