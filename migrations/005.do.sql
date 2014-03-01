CREATE OR REPLACE VIEW vw_pizza_order 
AS 
    SELECT 
        c.customer_id, 
        c.first_name, 
        c.last_name,
        c.address,
        c.city,
        c.phone_number,
        c.email,
        c.favorite_pizza_id,
        po.order_id,
        po.order_date,
        po.total_amount,
        po.delivery_deadline,
        po.delivery_time
    FROM 
        customer c
        JOIN pizza_order po ON c.customer_id = po.customer_id