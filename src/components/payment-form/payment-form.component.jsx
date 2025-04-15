import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import { useContext, useState } from "react";
import { CartContext } from "../../context/cart.context";
import { UserContext } from "../../context/user.context";
import "./payment-form.styles.scss";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartTotal, emptyCart } = useContext(CartContext);
  const { currentUser } = useContext(UserContext);

  const paymentHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: cartTotal * 100 }),
    }).then((res) => res.json());
    const clientSecret = response.paymentIntent.client_secret;

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: currentUser ? `${currentUser.email.split("@")[0]}` : "Guest",
          address: {
            line1: "123 Street",
            city: "City",
            postal_code: "12345",
            country: "US",
          },
        },
      },
    });

    setIsProcessing(false);

    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        alert("Payment Successful!");
        navigate("/");
        emptyCart();
      }
    }
  };
  return (
    <div className="payment-form-container">
      <div className="form-container">
        <h2>Credir Card Payemt</h2>
        <CardElement />
        <Button
          isLoading={isProcessing}
          onClick={paymentHandler}
          buttonType={BUTTON_TYPE_CLASSES.inverted}
          className="payment-button"
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
