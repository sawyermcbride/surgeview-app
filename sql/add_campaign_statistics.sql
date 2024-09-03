SELECT * FROM campaigns JOIN customers 
ON customers.id = campaigns.customer_id WHERE customers.email = 'samcbride11@gmail.com';


UPDATE campaigns SET status='setup' WHERE campaign_id = 40;