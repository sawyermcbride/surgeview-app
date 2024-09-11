import  express, {Request, Response} from "express"; 
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe('sk_test_51PmqG6KG6RDK9K4gSDxcza88uYRyVuFV0LJUQLQyPopCIBxR0rPHbnNu2LHHzf9DO4eqv0kvpNgczOaOOyB7HcKO00qg3j3lTw');

const endpointSecret = "whsec_d634c1b2770b4c55d8c051ffd351beebcb12dfc5958886173092f3373dcf297c";

router.use('/', express.raw({ type: 'application/json' }));

// router.post('/', (request: Request, response: Response) => {
//   console.log('Headers:', request.headers);
//   console.log('Request body:', request.body);
//   console.log('Is Buffer:', Buffer.isBuffer(request.body));
// });



router.post("/", (request: Request, response: Response) => {
  const sig = request.headers['stripe-signature'] as string | undefined;
  
  // console.log('Headers:', request.headers);
  // console.log('Request body:', request.body);
  
  // console.log('Is Buffer:', Buffer.isBuffer(request.body));
  
  if (!sig) {
    return response.status(400).send('Missing Stripe-Signature header');
  }
  
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    response.json({ received: true });

  } catch(error) {
    console.log(error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // console.log("event");
  // console.log(event);

  switch(event.type) {
    case 'payment_intent.succeeded':
      console.log("Succeeded payment intent recieved");
    default: 
      console.log(`Other event type ${event.type}`);
  }
  return;

});



export default router;