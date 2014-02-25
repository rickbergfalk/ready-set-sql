-- Adding some columns and data to customer
-- need more nullable fields

ALTER TABLE customer ADD COLUMN email VARCHAR(100) NULL;

ALTER TABLE customer ADD COLUMN favorite_pizza_id INT NULL;

UPDATE customer SET favorite_pizza_id = 103 WHERE customer_id = 10002;
UPDATE customer SET favorite_pizza_id = 107 WHERE customer_id IN (10004, 10005);

UPDATE customer SET email = 'CountrySinger47@coolmail.com' WHERE customer_id = 10001;
UPDATE customer SET email = 'DeathPrincess2000@email.net' WHERE customer_id = 10002;
UPDATE customer SET email = 'llleeeeroyyyy@coolmail.com' WHERE customer_id = 10004;
UPDATE customer SET email = 'm.monroe@bigbiz.com' WHERE customer_id = 10005;
