BEGIN;


INSERT INTO stripe_payments (payment_intent_id, client_secret, subscription_id, 
campaign_id, amount, currency, status, truncated_created_at)
VALUES('4454444545', '556565656', null, 39, 99.0, 'usd', 'not_attempted',
DATE_TRUNC('minute', NOW()));


COMMIT;