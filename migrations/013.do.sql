-- The James Bond database might not have mass appeal or the data variety for all the lessons.
-- Maybe we should use a boring purchase order database.

-- Or maybe a pizza order database? Everyone orders pizza, right?

CREATE TABLE customer (
	customer_id		INT,
	first_name 		VARCHAR(40),
	last_name 		VARCHAR(40),
	address 		VARCHAR(200),
	city 			VARCHAR(50),
	phone_number 	VARCHAR(20)		-- Here we can put in all sorts of poorly formatted phone numbers	
);
INSERT INTO customer VALUES (10001, 'Jonathan', 'Jenkins',  '14 2nd Street',         'Farmton',   '713-555-1337');
INSERT INTO customer VALUES (10002, 'Faye',     'Fletcher', '10028 Party Ave',       'Cityville', '(981) 555-1239'); -- Faye Fletcher
INSERT INTO customer VALUES (10003, 'Marty',    'Metinson', '18 43rd Street',        'Farmton',   '(713)555-3468'); -- Marty Metinson
INSERT INTO customer VALUES (10004, 'Leonard',  'Labeau',   '10910 Avenue Way',      'Cityville', '981.555.7279');
INSERT INTO customer VALUES (10005, 'Millie',   'Monroe',   '17213 Business Circle', 'Cityville', '9815551932'); 
-- Dominic Dunaway ?


CREATE TABLE pizza (
	pizza_id 		INT,
	pizza_name		VARCHAR(100),
	description 	VARCHAR(200)
);
INSERT INTO pizza VALUES (101, 'Cheesy Cheese',     'A super cheesy cheese pizza.');
INSERT INTO pizza VALUES (102, 'Classic Pepperoni', 'Classic Pepperoni pizza. It''ll never give you up. It''ll never let you down.');
INSERT INTO pizza VALUES (103, 'Mizza Meat Pizza',  'Lotsa Meat on this Mizza Pizza');
INSERT INTO pizza VALUES (104, 'Boring Sausage',    'In pepperoni vs. sausage, pepperoni wins hands down every time.');
INSERT INTO pizza VALUES (105, 'Almost Everthing',  'An everything pizza. Veggies. Meat. EVERYTHING.');
INSERT INTO pizza VALUES (106, 'Value Cheese',      'A cheap cheese pizza. Made with Cheezy Cheeze brand cheese. (not real cheese)');
INSERT INTO pizza VALUES (107, 'Value Pepperoni',   'A cheap pepperoni with fake cheese. Less sauce too, because margins.');


CREATE TABLE size_code (
	size_code 		CHAR(1),
	size_name 		VARCHAR(20)
);
INSERT INTO size_code VALUES ('S', 'Small');
INSERT INTO size_code VALUES ('M', 'Medium');
INSERT INTO size_code VALUES ('L', 'Large');


CREATE TABLE pizza_price (
	pizza_id		INT,
	size_code		CHAR(1),
	price			FLOAT
);
INSERT INTO pizza_price VALUES (101, 'S',  8.99); -- Cheesy Cheese
INSERT INTO pizza_price VALUES (101, 'M',  9.99);
INSERT INTO pizza_price VALUES (101, 'L', 10.99);
INSERT INTO pizza_price VALUES (102, 'S',  9.99); -- Pepperoni
INSERT INTO pizza_price VALUES (102, 'M', 10.99);
INSERT INTO pizza_price VALUES (102, 'L', 11.99);
INSERT INTO pizza_price VALUES (103, 'S', 10.99); -- Mizza Meat Pizza
INSERT INTO pizza_price VALUES (103, 'M', 11.99);
INSERT INTO pizza_price VALUES (103, 'L', 12.99);
INSERT INTO pizza_price VALUES (104, 'S',  9.99); -- Boring Sausage
INSERT INTO pizza_price VALUES (104, 'M', 10.99);
INSERT INTO pizza_price VALUES (104, 'L', 11.99);
INSERT INTO pizza_price VALUES (105, 'S', 10.99); -- Almost Everything
INSERT INTO pizza_price VALUES (105, 'M', 11.99);
INSERT INTO pizza_price VALUES (105, 'L', 12.99);
INSERT INTO pizza_price VALUES (106, 'S',  5.00); -- Value Cheese
INSERT INTO pizza_price VALUES (107, 'S',  5.00); -- Value Pepperoni


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

-- http://www.timeanddate.com/calendar/?year=2013&country=1
-- Need some stories for fun and "realistic" data:
-- 10001 is a regular pepperoni person. Occasionally order cheese
-- 10002 is a Partier. Big orders every Friday
-- 10003 is a country meat guy. Mizza always every monday
-- 10004 cheap. Value pizzas at random, for lunch
-- 10005 a bit of everything, except for sausage. Nobody likes sausage.
INSERT INTO pizza_order VALUES (1001, '03/06/2013 18:32', 10001, 10.99, '03/06/2013 19:02', '03/06/2013 19:01');
INSERT INTO pizza_order VALUES (1002, '03/08/2013 19:13', 10002, 93.95, '03/08/2013 19:43', '03/08/2013 19:46');
INSERT INTO pizza_order VALUES (1003, '03/09/2013 18:39', 10005, 11.99, '03/09/2013 19:09', '03/09/2013 19:03');
INSERT INTO pizza_order VALUES (1004, '03/11/2013 11:49', 10004,  5.00, '03/11/2013 12:19', '03/11/2013 12:11');
INSERT INTO pizza_order VALUES (1005, '03/13/2013 12:13', 10004,  5.00, '03/13/2013 12:43', '03/13/2013 12:36');
INSERT INTO pizza_order VALUES (1006, '03/15/2013 18:51', 10002, 99.90, '03/15/2013 19:21', '03/15/2013 19:28');
INSERT INTO pizza_order VALUES (1007, '03/18/2013 16:57', 10003, 10.99, '03/18/2013 17:27', '03/18/2013 17:28');
INSERT INTO pizza_order VALUES (1008, '03/19/2013 11:45', 10004,  5.00, '03/19/2013 12:15', '03/19/2013 12:11');
INSERT INTO pizza_order VALUES (1009, '03/21/2013 17:47', 10001, 21.98, '03/21/2013 18:17', '03/21/2013 18:14');
INSERT INTO pizza_order VALUES (1010, '03/22/2013 20:24', 10002, 88.93, '03/22/2013 20:54', '03/22/2013 20:53');
INSERT INTO pizza_order VALUES (1011, '03/22/2013 14:12', 10005, 25.99, '03/22/2013 14:42', '03/22/2013 14:39');
INSERT INTO pizza_order VALUES (1012, '03/25/2013 12:17', 10004,  5.00, '03/25/2013 12:47', '03/25/2013 12:36');
INSERT INTO pizza_order VALUES (1013, '03/25/2013 17:16', 10003, 12.99, '03/25/2013 17:46', '03/25/2013 17:43');
INSERT INTO pizza_order VALUES (1014, '03/26/2013 11:59', 10004,  5.00, '03/26/2013 12:29', '03/26/2013 12:24');
INSERT INTO pizza_order VALUES (1015, '03/29/2013 19:37', 10005, 21.99, '03/29/2013 20:07', '03/29/2013 20:05');
INSERT INTO pizza_order VALUES (1016, '03/29/2013 20:13', 10002, 99.96, '03/29/2013 20:43', '03/29/2013 20:44');

INSERT INTO pizza_order_line VALUES (1001, 1, 102, 'M', 1, 10.99, 10.99, NULL);

INSERT INTO pizza_order_line VALUES (1002, 1, 102, 'L', 2, 11.99, 23.98, NULL);
INSERT INTO pizza_order_line VALUES (1002, 2, 103, 'L', 3, 12.99, 33.00, 'Mizza Madness Promo - 3 Large Mizza Pizzas for $33'); -- partier, mizza pizza
INSERT INTO pizza_order_line VALUES (1002, 3, 105, 'L', 2, 12.99, 25.98, NULL); -- partier, Almost Everything
INSERT INTO pizza_order_line VALUES (1002, 4, 104, 'M', 1, 10.99, 10.99, NULL); -- partier, sausage

INSERT INTO pizza_order_line VALUES (1003, 1, 103, 'M', 1, 11.99, 11.99, NULL);

INSERT INTO pizza_order_line VALUES (1004, 1, 107, 'S', 1,  5.00,  5.00, NULL); -- Value pep

INSERT INTO pizza_order_line VALUES (1005, 1, 106, 'S', 1,  5.00,  5.00, NULL); -- Value Cheese

INSERT INTO pizza_order_line VALUES (1006, 1, 103, 'L', 2, 12.99, 19.98, '9 for 9.99 Promo - 9 or more Large Pizzas for 9.99 each'); -- mizza pizza
INSERT INTO pizza_order_line VALUES (1006, 2, 102, 'L', 3, 11.99, 29.97, '9 for 9.99 Promo - 9 or more Large Pizzas for 9.99 each'); -- pep
INSERT INTO pizza_order_line VALUES (1006, 3, 105, 'L', 2, 12.99, 19.98, '9 for 9.99 Promo - 9 or more Large Pizzas for 9.99 each'); -- Almost Everything
INSERT INTO pizza_order_line VALUES (1006, 4, 101, 'L', 3, 10.99, 29.97, '9 for 9.99 Promo - 9 or more Large Pizzas for 9.99 each'); -- Cheese

INSERT INTO pizza_order_line VALUES (1007, 1, 103, 'S', 1, 10.99, 10.99, NULL); -- Meat monday

INSERT INTO pizza_order_line VALUES (1008, 1, 107, 'S', 1,  5.00,  5.00, NULL); -- Value pep

INSERT INTO pizza_order_line VALUES (1009, 1, 102, 'L', 1, 11.99, 11.99, NULL);
INSERT INTO pizza_order_line VALUES (1009, 2, 101, 'M', 1,  9.99,  9.99, NULL);

INSERT INTO pizza_order_line VALUES (1010, 1, 102, 'L', 2, 11.99, 23.98, NULL);
INSERT INTO pizza_order_line VALUES (1010, 2, 103, 'L', 3, 12.99, 38.97, NULL); -- mizza pizza
INSERT INTO pizza_order_line VALUES (1010, 3, 105, 'L', 2, 12.99, 25.98, NULL); -- Almost Everything

INSERT INTO pizza_order_line VALUES (1011, 1, 101, 'L', 1, 10.99, 10.99, NULL);
INSERT INTO pizza_order_line VALUES (1011, 2, 107, 'S', 3,  5.00, 15.00, NULL);

INSERT INTO pizza_order_line VALUES (1012, 1, 107, 'S', 1,  5.00,  5.00, NULL); -- Value pep

INSERT INTO pizza_order_line VALUES (1013, 1, 103, 'L', 1, 12.99, 12.99, NULL); -- Meat monday

INSERT INTO pizza_order_line VALUES (1014, 1, 107, 'S', 1,  5.00,  5.00, NULL); -- Value pep

INSERT INTO pizza_order_line VALUES (1015, 1, 103, 'M', 1, 11.99, 11.99, NULL); -- meat
INSERT INTO pizza_order_line VALUES (1015, 2, 106, 'S', 1,  5.00,  5.00, NULL); -- cheese
INSERT INTO pizza_order_line VALUES (1015, 3, 107, 'S', 1,  5.00,  5.00, NULL); -- pep

INSERT INTO pizza_order_line VALUES (1016, 1, 103, 'M', 2, 11.99, 23.98, NULL); -- mizza pizza
INSERT INTO pizza_order_line VALUES (1016, 2, 105, 'L', 2, 12.99, 25.98, NULL); -- Almost Everything
INSERT INTO pizza_order_line VALUES (1016, 3, 107, 'S', 5,  5.00, 25.00, NULL); -- Value Pep
INSERT INTO pizza_order_line VALUES (1016, 4, 106, 'S', 5,  5.00, 25.00, NULL); -- Value Cheese



