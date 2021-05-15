const { response } = require("express");
var express = require("express"); 
var app = express();
const stripe = require('stripe')('sk_test_51IrLXKAjEtY2LWHRasEmu2qzyFPTG4bn0L3M0nsYxiMKGw5KmAyNrdQqeC4JqDvptvVwJ6XyajyIw9NGxH0hL69G00tFJKP4CD');

app.use(express.static('.'));

const { PORT=3000, LOCAL_ADDRESS='0.0.0.0' } = process.env

app.get('/',(req,res)=>{
  res.send("public key is : pk_test_51IrLXKAjEtY2LWHRzgpLlnJFgd7mtXKYRWTkvn7vJK8YedIkCVVpFvBx4vO1WlBO4ibwA5jbhG8HsbfZsvKq8d0P006QfdiKqK")
})


//app.use(express.static("."));
app.use(express.json());


const calculateOrderAmount = items => {


  const nb  = items.length;
  items.forEach(prod => {
      console.log(prod.id);
  });
  return nb*1000;
};
app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


app.listen(PORT,LOCAL_ADDRESS, ()=> {
    console.log("server listening on "+PORT)
})




