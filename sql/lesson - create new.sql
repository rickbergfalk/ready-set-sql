INSERT INTO lesson (title, description, created, updated, screens) 
VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $3)