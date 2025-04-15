import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './Components/context/CartContext';
import { GOOGLE_CLIENT_ID } from './config/auth';
import './app.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import Home from './Components/Home/Home.jsx';
import KenyanHolidays from './Components/KenyanHolidays/KenyanHoliday.jsx';
import InternationalHolidays from './Components/InternationalHolidays/InternationalHolidays.jsx';
import MyCart from './Components/MyCart/MyCart.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Summary from './Components/summary/Summary.jsx';

const App = () => {
  console.log("Google Client ID:", GOOGLE_CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kenyan-holidays" element={<KenyanHolidays />} />
            <Route path="/international-holidays" element={<InternationalHolidays />} />
            <Route path="/mycart" element={<MyCart />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
};

export default App;