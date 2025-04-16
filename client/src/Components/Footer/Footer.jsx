import React, { useState } from 'react';
import './footer.scss';

import { FiSend } from 'react-icons/fi';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { AiOutlineTwitter, AiFillYoutube, AiFillInstagram } from 'react-icons/ai';
import { FaTripadvisor, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionStatus('Please enter a valid email address.');
      return;
    }
    
    window.location.href = `mailto:ellykomunga@gmail.com?subject=Contact from Aurelian Travels&body=Hello, I would like to get more information about your travel services.`;
    
    setSubscriptionStatus('Thank you for contacting us! We will get back to you soon.');
    setEmail('');
  };

  return (
    <section className="footer">
      <div className="videoDiv">
        <video 
            src="https://cdn.pixabay.com/video/2019/04/23/23011-332483109_tiny.mp4" 
            muted 
            autoPlay 
            loop 
            type="video/mp4">
        </video>

      </div>

      <div className="secContent container">
        <div className="contactDiv flex">
          <div className="text">
            <small>KEEP IN TOUCH</small>
            <h2>Travel with Us</h2>
          </div>

          <div className="inputDiv flex">
            <form onSubmit={handleSubscribe} className="subscriptionForm">
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn flex" type="submit">
                SEND <FiSend className="icon" />
              </button>
            </form>
            {subscriptionStatus && (
              <div className={`subscriptionMessage ${subscriptionStatus.includes('Thank') ? 'success' : 'error'}`}>
                {subscriptionStatus}
              </div>
            )}
          </div>
        </div>

        <div className="footerCard grid">
          {/* Company Info */}
          <div className="footerIntro">
            <div className="logoDiv">
              <NavLink to="/" className="logo flex">
                <MdOutlineTravelExplore className="icon" /> Aurelian Travels.
              </NavLink>
            </div>

            <div className="footerContent">
              <div className="companyInfo">
                Aurelian Travels offers unforgettable adventures across the globe. From the vibrant landscapes of Kenya to international destinations, we make your travel dreams a reality with seamless booking and exceptional service. We pride ourselves on personalized travel experiences tailored to your unique preferences. Our team of expert travel consultants is dedicated to creating memorable journeys that exceed your expectations.
              </div>
              
              <div className="paymentMethodsContainer">
                <div className="paymentMethods">
                  <p className="acceptsText">We accept:</p>
                  <div className="paymentIcons">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                      alt="Visa Payment" 
                      className="paymentIcon" 
                    />
                    <img 
                      src="https://asset.edusson.com/bundles/asterfreelance/_layout/images/_common_images/payment-icons-v3/mastercard.svg" 
                      alt="Mastercard Payment" 
                      className="paymentIcon" 
                    />
                    <img 
                      src="https://asset.edusson.com/bundles/asterfreelance/_layout/images/_common_images/payment-icons-v3/applepay.svg" 
                      alt="Apple Pay Payment" 
                      className="paymentIcon" 
                    />
                    <img 
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                      alt="PayPal Payment" 
                      className="paymentIcon" 
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" 
                      alt="M-Pesa Payment" 
                      className="paymentIcon mpesa" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="footerSocials flex">
              <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <AiOutlineTwitter className="icon" />
              </a>
              <a href="http://www.youtube.com/@gathuagotgame" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <AiFillYoutube className="icon" />
              </a>
              <a href="https://www.instagram.com/its_gathua" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <AiFillInstagram className="icon" />
              </a>
              <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor">
                <FaTripadvisor className="icon" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footerLinks grid">
            {/* Quick Links */}
            <div className="linkGroup">
              <span className="groupTitle">QUICK LINKS</span>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                <NavLink to="/kenyan-holidays">Kenyan Holidays</NavLink>
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                <NavLink to="/international-holidays">International Holidays</NavLink>
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                <NavLink to="/mycart">My Cart</NavLink>
              </li>
            </div>

            {/* Our Agency */}
            <div className="linkGroup">
              <span className="groupTitle">OUR AGENCY</span>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Services
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Insurance
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Agency
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Tourism
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Payment
              </li>
            </div>

            {/* Partners */}
            <div className="linkGroup">
              <span className="groupTitle">PARTNERS</span>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                AirBnB
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Rentcars
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                HostelWorld
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                Trivago
              </li>
              <li className="footerList flex">
                <FiChevronRight className="icon" />
                TripAdvisor
              </li>
            </div>

            {/* Contact Us */}
            <div className="linkGroup">
              <span className="groupTitle">CONTACT US</span>
              <li className="footerList flex">
                <FaPhone className="icon" />
                +254 743 767 800
              </li>
              <li className="footerList flex">
                <FaEnvelope className="icon" />
                <a href="mailto:ellykomunga@gmail.com">aureliantravels@gmail.com</a>
              </li>
              <li className="footerList flex">
                <FaMapMarkerAlt className="icon" />
                Nairobi, Kenya
              </li>
            </div>
          </div>

          <div className="footerDiv flex">
            <small>BEST TRAVEL COMPANY</small>
            <small>© {new Date().getFullYear()} AURELIAN TRAVELS. ALL RIGHTS RESERVED.</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
