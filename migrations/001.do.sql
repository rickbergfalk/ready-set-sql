-- So a pizza order database. Everyone orders pizza, right?

CREATE TABLE customer (
	customer_id		INT,
	first_name 		VARCHAR(40),
	last_name 		VARCHAR(40),
	address 		VARCHAR(200),
	city 			VARCHAR(50),
	phone_number 	VARCHAR(20)		-- Here we can put in all sorts of poorly formatted phone numbers like real life
);

CREATE TABLE pizza (
	pizza_id 		INT,
	pizza_name		VARCHAR(100),
	description 	VARCHAR(200)
);

CREATE TABLE size_code (
	size_code 		CHAR(1),
	size_name 		VARCHAR(20)
);

CREATE TABLE pizza_price (
	pizza_id		INT,
	size_code		CHAR(1),
	price			FLOAT
);

CREATE TABLE pizza_order (
	order_id 			INT,
	order_date			TIMESTAMP,
	customer_id			INT,
	total_amount		FLOAT,
	delivery_deadline 	TIMESTAMP,
	delivery_time		TIMESTAMP
);

CREATE TABLE pizza_order_line (
	order_id 				INT,
	line_number				INT,
	pizza_id 				INT,
	size_code				CHAR(1),
	quantity 				INT,
	pizza_price 			FLOAT,
	total_line_amount 		FLOAT,
	notes 	      			VARCHAR(200)
);
