import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import AppleLogin from './AppleLogin.jsx';
import './AuthPromptModal.scss';
import { authApi } from '../../utils/api';
import { useCart } from '../context/CartContext';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../../config/auth';

const AuthPromptModal = ({ show, action, onClose }) => {
    const [error, setError] = useState(null);
    const { loginUser } = useCart();

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
        flow: 'auth-code',
        scope: 'openid profile email',
        clientId: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI
    });

    if (!show) return null;

    async function handleGoogleSuccess(response) {
        console.log("Google login response:", response);
        try {
            setError(null);
            const { code } = response;
            if (!code) {
                throw new Error("No authorization code received from Google");
            }
            
            const res = await authApi.googleLogin({ 
                code,
                redirect_uri: GOOGLE_REDIRECT_URI
            });
            
            console.log("Google login backend response:", res.data);
            loginUser(res.data.user, res.data.access_token, res.data.refresh_token);
            onClose();
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
            onClose();
        } catch (error) {
            console.error('Apple login failed:', error);
            setError('Apple login failed. Please try again.');
        }
    };

    const actionText = {
        'addToCart': 'add items to your cart',
        'proceedToCheckout': 'proceed to checkout',
        'viewCart': 'view your cart'
    }[action] || 'perform this action';

    return (
        <div className="authModal">
            <div className="modalContent">
                <h3>Login Required</h3>
                <p>You need to login to {actionText}.</p>
                {error && <div className="error-message">{error}</div>}
                <div className="authProviders">
                    <button className="googleLoginBtn" onClick={() => googleLogin()}>
                        Continue with Google
                    </button>
                    <AppleLogin onSuccess={handleAppleSuccess} />
                </div>
                <button className="closeModal" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default AuthPromptModal;