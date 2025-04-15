import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.scss';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import { TbGridDots } from 'react-icons/tb';
import { useGoogleLogin } from '@react-oauth/google';
import { useCart } from '../context/CartContext';
import { authApi } from '../../utils/api';
import AppleLogin from './AppleLogin';

const Navbar = () => {
    const [active, setActive] = useState('navBar');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [error, setError] = useState(null);
    const { user, loginUser, logoutUser } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
        flow: 'auth-code',
        scope: 'profile email openid',
    });

    useEffect(() => {
        const updateDimension = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', updateDimension);
        if (screenWidth >= 769) setActive('navBar');
        return () => window.removeEventListener('resize', updateDimension);
    }, [screenWidth]);

    const showNav = () => setActive('navBar activeNavbar');
    const removeNavbar = () => setActive('navBar');

    async function handleGoogleSuccess(response) {
        console.log("Google login response:", response);
        try {
            setError(null);
            const { code } = response;
            if (!code) {
                throw new Error("No authorization code received from Google");
            }
            const res = await authApi.googleLogin({ code });
            console.log("Google login backend response:", res.data);
            loginUser(res.data.user, res.data.access_token, res.data.refresh_token);
            setShowAuthModal(false);
            navigate('/');
        } catch (error) {
            console.error('Google login failed:', error);
            setError(error.response?.data?.error || 'Google login failed. Please try again.');
        }
    }

    function handleGoogleError(error) {
        console.error('Google Login Failed:', error);
        setError('Google login failed. Please try again.');
    }

    const handleAppleSuccess = (response) => {
        try {
            setError(null);
            loginUser(response.user, response.access_token, response.refresh_token);
            setShowAuthModal(false);
            navigate('/');
        } catch (error) {
            console.error('Apple login failed:', error);
            setError('Apple login failed. Please try again.');
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/');
    };

    return (
        <section className="navBarSection">
            <header className="header flex">
                <div className="logoDiv">
                    <Link to="/" className="logo flex">
                        <MdOutlineTravelExplore className="icon"/> 
                        <span>Aurelian Travels.</span>
                    </Link>
                </div>
                <div className={active}>
                    <ul className="navLists flex">
                        <li className="navItem">
                            <Link
                                to="/"
                                className={`navLink ${location.pathname === '/' ? 'activeLink' : ''}`}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="navItem">
                            <Link
                                to="/kenyan-holidays"
                                className={`navLink ${location.pathname === '/kenyan-holidays' ? 'activeLink' : ''}`}
                            >
                                Kenyan Holidays
                            </Link>
                        </li>
                        <li className="navItem">
                            <Link
                                to="/international-holidays"
                                className={`navLink ${location.pathname === '/international-holidays' ? 'activeLink' : ''}`}
                            >
                                International Holidays
                            </Link>
                        </li>
                        <li className="navItem">
                            <Link
                                to="/mycart"
                                className={`navLink ${location.pathname === '/mycart' ? 'activeLink' : ''}`}
                            >
                                MyCart
                            </Link>
                        </li>
                        {user && (
                            <li className="navItem">
                                <Link
                                    to="/summary"
                                    className={`navLink ${location.pathname === '/summary' ? 'activeLink' : ''}`}
                                >
                                    Summary
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="btnContainer">
                        {user ? (
                            <div className="userProfile">
                                <img src={user.avatar} alt={user.name} className="profilePic" />
                                <span className="userName">{user.name}</span>
                                <button onClick={handleLogout} className="logoutBtn">Logout</button>
                            </div>
                        ) : (
                            <button className='authBtn' onClick={() => setShowAuthModal(true)}>
                                Login/Sign Up
                            </button>
                        )}
                    </div>
                    <div onClick={removeNavbar} className="closeNavbar">
                        <AiFillCloseCircle className="icon" />
                    </div>
                </div>
                <div onClick={showNav} className="toggleNavbar">
                    <TbGridDots className="icon" />
                </div>
            </header>

            {showAuthModal && (
                <div className="authModal">
                    <div className="modalContent">
                        <h3>Login or Sign Up</h3>
                        <p>Continue with your preferred method</p>
                        {error && <div className="error-message">{error}</div>}
                        <div className="authProviders">
                            <button className="googleLoginBtn" onClick={() => googleLogin()}>
                                Continue with Google
                            </button>
                            <AppleLogin onSuccess={handleAppleSuccess} />
                        </div>
                        <button className="closeModal" onClick={() => setShowAuthModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Navbar;