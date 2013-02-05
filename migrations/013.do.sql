-- The James Bond database might not have mass appeal or the data variety for all the lessons.
-- Maybe we should use a boring purchase order database.

-- Or maybe a pizza order database? Everyone orders pizza, right?

CREATE TABLE customer (
	customer_id		INT,
	firstname 		VARCHAR(40),
	lastname 		VARCHAR(40),
	address 		VARCHAR(200),
	city 			VARCHAR(50),
	email 			VARCHAR(100),
	phone_number 	VARCHAR(10)		-- Here we can put in all sorts of poorly formatted phone numbers	
)

-- Could have value line, special line, etc.
-- For sake of simplicity, some of this data is going to be denormalized.
CREATE TABLE pizza (
	pizza_id 		INT,
	pizza_name		VARCHAR(100),
	description 	VARCHAR(200),
	price_small		FLOAT,
	price_med		FLOAT,
	price_large		FLOAT
)


CREATE TABLE pizza_order (
	customer_id			INT,
	order_id 			INT,
	order_date			DATETIME,
	total_amount		FLOAT,
	order_status 		VARCHAR(10),
	total_pizzas 		INT,
	delivery_deadline 	DATETIME,
	delivery_time		DATETIME
)


CREATE TABLE pizza_order_pizza (
	
)