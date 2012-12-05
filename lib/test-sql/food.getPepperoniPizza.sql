
-- Get pepperoni pizza

	SELECT 
		flavor,
		price,
		something,
		topping
	FROM 
		pizza p
		JOIN toppings t ON p.pizza_id = t.pizza_id
	WHERE
		topping IN ('pepperoni');
