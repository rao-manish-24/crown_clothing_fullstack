import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./app.styles.scss";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/user.context.jsx";
import { ShopProvider } from "./context/shop.context.jsx";
import { CartProvider } from "./context/cart.context.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./utils/stripe.utils.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <UserProvider>
          <ShopProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ShopProvider>
        </UserProvider>
      </BrowserRouter>
    </Elements>
  </React.StrictMode>
);
