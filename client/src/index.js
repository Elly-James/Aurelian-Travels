import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import { CartProvider } from './Components/context/CartContext.jsx';  // Updated import path

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);