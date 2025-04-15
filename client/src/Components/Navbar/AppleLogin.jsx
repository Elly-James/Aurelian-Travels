import React from 'react';
import AppleSignin from 'react-apple-signin-auth';
import './AppleLogin.scss';
import { authApi } from '../../utils/api';

const AppleLogin = ({ onSuccess }) => {
    const handleAppleLogin = async (response) => {
        try {
            const { authorization, user } = response;
            if (!authorization) throw new Error('Apple login failed: No authorization data');

            const appleResponse = await authApi.appleLogin({
                id_token: authorization.id_token,
                firstName: user?.name?.firstName || '',
                lastName: user?.name?.lastName || '',
            });

            onSuccess({
                user: appleResponse.data.user,
                access_token: appleResponse.data.access_token,
            });
        } catch (error) {
            console.error('Apple login error:', error);
            throw error; // Let the parent component handle the error
        }
    };

    return (
        <AppleSignin
            authOptions={{
                clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
                scope: 'email name',
                redirectURI: window.location.origin, // Redirect URI for your app
                usePopup: true,
            }}
            onSuccess={handleAppleLogin}
            onError={(error) => {
                console.error('Apple Sign-In Error:', error);
                throw error;
            }}
            uiType="dark"
            className="appleLoginBtn"
            render={(props) => (
                <button {...props} className="appleLoginBtn">
                    <svg viewBox="0 0 24 24" className="appleIcon">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                </button>
            )}
        />
    );
};

export default AppleLogin;