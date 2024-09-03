SELECT customers.email, campaigns.campaign_id, campaigns.video_link, campaigns.plan_name,
campaigns.title, campaigns.channelTitle
FROM customers JOIN campaigns ON customers.id = campaigns.customer_id
WHERE email = 'samcbride11@gmail.com';