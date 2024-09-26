DELETE FROM campaigns WHERE customer_id = (SELECT id FROM customers WHERE
email = 'samcbride11@gmail.com') AND plan_name != 'Pro';