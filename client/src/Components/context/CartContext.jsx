import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { bookingsApi, destinationsApi } from '../../utils/api';
import './cartcontext.scss';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [summaryItems, setSummaryItems] = useState([]);
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showGlobalLoader, setShowGlobalLoader] = useState(false);

    useEffect(() => {
        const loadUserAndTokens = () => {
            const savedUser = localStorage.getItem('travel-user');
            const savedAccessToken = localStorage.getItem('access_token');
            const savedRefreshToken = localStorage.getItem('refresh_token');
            const savedCart = localStorage.getItem('cartItems');
            const savedSummary = localStorage.getItem('summaryItems');

            if (savedUser && savedAccessToken) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser({
                        ...parsedUser,
                        avatar: parsedUser.avatar || 'https://www.gravatar.com/avatar/default?s=200&d=mp'
                    });
                    setAccessToken(savedAccessToken);
                    setRefreshToken(savedRefreshToken);
                } catch (e) {
                    console.error('Failed to parse user data', e);
                    localStorage.removeItem('travel-user');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }

            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (e) {
                    console.error('Failed to parse cart items', e);
                    localStorage.removeItem('cartItems');
                }
            }

            if (savedSummary) {
                try {
                    setSummaryItems(JSON.parse(savedSummary));
                } catch (e) {
                    console.error('Failed to parse summary items', e);
                    localStorage.removeItem('summaryItems');
                }
            }
        };

        loadUserAndTokens();
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('summaryItems', JSON.stringify(summaryItems));
    }, [cartItems, summaryItems]);

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            });
            const newAccessToken = response.data.access_token;
            setAccessToken(newAccessToken);
            localStorage.setItem('access_token', newAccessToken);
            return newAccessToken;
        } catch (err) {
            console.error('Failed to refresh token:', err);
            logoutUser();
            return null;
        }
    };

    const makeAuthenticatedRequest = async (apiCall, ...args) => {
        try {
            const response = await apiCall(...args, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response;
        } catch (err) {
            if (err.response?.status === 401 && refreshToken) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    return await apiCall(...args, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                }
            }
            throw err;
        }
    };

    const addToCart = (item) => {
        if (!cartItems.some(cartItem => cartItem.id === item.id)) {
            setCartItems([...cartItems, { 
                ...item,
                adults: 1,
                children: 0,
                travelDate: new Date().toISOString().split('T')[0],
                firstName: user?.name?.split(' ')[0] || '',
                lastName: user?.name?.split(' ')[1] || '',
                email: user?.email || '',
                phone: '',
                specialRequests: ''
            }]);
            return true;
        }
        return false;
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setSummaryItems(summaryItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
        setSummaryItems([]);
    };

    const updateCartItem = (id, updatedFields) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, ...updatedFields } : item
        ));
    };

    const addToSummary = (item) => {
        if (!summaryItems.some(summaryItem => summaryItem.id === item.id)) {
            setSummaryItems([...summaryItems, item]);
        }
    };

    const removeFromSummary = (id) => {
        setSummaryItems(summaryItems.filter(item => item.id !== id));
    };

    const updateSummaryItem = (id, updatedFields) => {
        setSummaryItems(summaryItems.map(item => 
            item.id === id ? { ...item, ...updatedFields } : item
        ));
    };

    const submitReview = async (destinationId, rating, comment) => {
        setIsLoading(true);
        try {
            const response = await makeAuthenticatedRequest(destinationsApi.submitReview, {
                destination_id: destinationId,
                rating,
                comment,
                user_id: user?.id
            });
            setIsLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review');
            setIsLoading(false);
            return false;
        }
    };

    const createBooking = async (bookingData) => {
        setIsLoading(true);
        setShowGlobalLoader(true);
        try {
            const response = await makeAuthenticatedRequest(bookingsApi.createBooking, bookingData);
            setIsLoading(false);
            setShowGlobalLoader(false);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create booking');
            setIsLoading(false);
            setShowGlobalLoader(false);
            throw err;
        }
    };

    const loginUser = (userData, accessToken, refreshToken) => {
        const userWithAvatar = {
            ...userData,
            avatar: userData.avatar || 'https://www.gravatar.com/avatar/default?s=200&d=mp'
        };
        setUser(userWithAvatar);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('travel-user', JSON.stringify(userWithAvatar));
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    };

    const logoutUser = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setCartItems([]);
            setSummaryItems([]);
            localStorage.removeItem('travel-user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('summaryItems');
        }
    };

    const isAuthenticated = () => {
        return !!user && !!accessToken;
    };

    const requireAuth = (action) => {
        if (!isAuthenticated()) {
            return { requiresAuth: true, action };
        }
        return { requiresAuth: false };
    };

    const calculateTotal = () => {
        return summaryItems.reduce((total, item) => {
            return total + (item.fees * (item.adults || 1)) + (item.fees * 0.5 * (item.children || 0));
        }, 0);
    };

    const LoadingSpinner = () => (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );

    return (
        <CartContext.Provider 
            value={{ 
                cartItems,
                summaryItems,
                user,
                accessToken,
                isLoading,
                error,
                showGlobalLoader,
                setShowGlobalLoader,
                addToCart, 
                removeFromCart, 
                clearCart,
                updateCartItem,
                addToSummary,
                removeFromSummary,
                updateSummaryItem,
                submitReview,
                calculateTotal,
                cartCount: cartItems.length,
                summaryCount: summaryItems.length,
                createBooking,
                loginUser,
                logoutUser,
                requireAuth,
                isAuthenticated,
                LoadingSpinner
            }}
        >
            {children}
            {showGlobalLoader && (
                <div className="global-loader-overlay">
                    <LoadingSpinner />
                </div>
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;