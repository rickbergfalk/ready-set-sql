CREATE OR REPLACE VIEW vw_pizza_order_line
AS 
    SELECT 
        c.customer_id, 
        c.first_name, 
        c.last_name,
        c.city,
        pol.order_id,
        pol.line_number,
        p.pizza_name,
        pol.size_code,
        pol.quantity,
        pol.pizza_price,
        pol.total_line_amount,
        pol.notes
    FROM 
        customer c
        JOIN pizza_order po ON c.customer_id = po.customer_id
        JOIN pizza_order_line pol ON po.order_id = pol.order_id
        JOIN pizza p ON pol.pizza_id = p.pizza_id