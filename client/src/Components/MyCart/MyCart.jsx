import React, { useState, useEffect } from 'react';
import './myCart.scss';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { AiFillDelete } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import AuthPromptModal from '../Navbar/AuthPromptModal.jsx';
import { destinationsApi } from '../../utils/api';

const MyCart = () => {
    const { 
        cartItems, 
        summaryItems,
        removeFromCart, 
        updateCartItem, 
        calculateTotal,
        user,
        addToSummary,
        removeFromSummary,
        submitReview,
        requireAuth,
        isLoading,
        isAuthenticated,
    } = useCart();
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [error, setError] = useState(null);
    const [reviewRatings, setReviewRatings] = useState({});
    const [destinationReviews, setDestinationReviews] = useState({});

    useEffect(() => {
        const loadReviews = async () => {
            const reviews = {};
            for (const item of cartItems) {
                try {
                    const response = await destinationsApi.getReviews(item.id);
                    reviews[item.id] = response.data;
                } catch (err) {
                    console.error(`Failed to load reviews for destination ${item.id}:`, err);
                    reviews[item.id] = [];
                }
            }
            setDestinationReviews(reviews);
        };

        if (cartItems.length > 0) {
            loadReviews();
        }
    }, [cartItems]);

    const handleBookingChange = (id, field, value) => {
        updateCartItem(id, { [field]: value });
    };

    const handleReviewRating = (id, rating) => {
        setReviewRatings(prev => ({ ...prev, [id]: rating }));
    };

    const handleSubmitReview = async (e, destinationId) => {
        e.preventDefault();
        if (!reviewRatings[destinationId]) {
            setError('Please select a rating');
            return;
        }

        try {
            const success = await submitReview(
                destinationId,
                reviewRatings[destinationId]
            );

            if (success) {
                const response = await destinationsApi.getReviews(destinationId);
                setDestinationReviews(prev => ({
                    ...prev,
                    [destinationId]: response.data
                }));
                
                setReviewRatings(prev => {
                    const newRatings = {...prev};
                    delete newRatings[destinationId];
                    return newRatings;
                });
                setError(null);
            }
        } catch (err) {
            setError('Failed to submit review. Please try again.');
            console.error('Review submission error:', err);
        }
    };

    const handleBookDestination = (item) => {
        if (!isAuthenticated()) {
            const authCheck = requireAuth('bookDestination');
            if (authCheck.requiresAuth) {
                setShowAuthModal(true);
                return;
            }
        }

        if (!item.travelDate || !item.adults || !item.firstName || !item.lastName || !item.email) {
            alert('Please complete all required fields before booking');
            return;
        }

        addToSummary(item);
    };

    const handleProceedToSummary = () => {
        const authCheck = requireAuth('proceedToCheckout');
        if (authCheck.requiresAuth) {
            setShowAuthModal(true);
            return;
        }

        if (summaryItems.length === 0) {
            alert('Please add at least one destination to summary');
            return;
        }

        navigate('/summary');
    };

    const StarRating = ({ rating, reviewCount }) => {
        return (
            <div className="rating-container">
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                            key={star}
                            className={`star ${star <= rating ? 'filled' : 'empty'}`}
                        />
                    ))}
                </div>
                <span className="review-count">({reviewCount} reviews)</span>
            </div>
        );
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    };

    return (
        <section className="myCart container section">
            <div className="secTitle">
                <h3 className="title">My Cart</h3>
                <p className="subtitle">Review and book your holiday experiences</p>
                {error && <div className="error-message">{error}</div>}
            </div>

            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <p>Your cart is empty. Explore our destinations to start planning!</p>
                    <div className="emptyCartActions">
                        <a href="/kenyan-holidays" className="btn">Discover Kenyan Holidays</a>
                        <a href="/international-holidays" className="btn">Explore International Holidays</a>
                    </div>
                </div>
            ) : (
                <div className="cartContent">
                    <div className="cartItems">
                        {cartItems.map(item => {
                            const isInSummary = summaryItems.some(summaryItem => summaryItem.id === item.id);
                            const reviews = destinationReviews[item.id] || [];
                            const averageRating = calculateAverageRating(reviews);
                            
                            return (
                                <div key={item.id} className="cartItem">
                                    <div className="itemImage">
                                        <img src={item.image_url} alt={item.title} />
                                        <div className="itemInfo">
                                            <h4>{item.title}</h4>
                                            <span className="location flex">
                                                <HiOutlineLocationMarker className="icon" />
                                                <span>{item.location}</span>
                                            </span>
                                            <p className="price">${item.fees}</p>
                                            <div className="description">
                                                <p>{item.description}</p>
                                            </div>
                                            <div className="reviews-display">
                                                <StarRating 
                                                    rating={averageRating} 
                                                    reviewCount={reviews.length} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bookingForm">
                                        <h5>Booking Details</h5>
                                        <form>
                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>First Name *</label>
                                                    <input 
                                                        type="text" 
                                                        value={item.firstName || ''}
                                                        onChange={(e) => handleBookingChange(item.id, 'firstName', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Last Name *</label>
                                                    <input 
                                                        type="text" 
                                                        value={item.lastName || ''}
                                                        onChange={(e) => handleBookingChange(item.id, 'lastName', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>Email *</label>
                                                    <input 
                                                        type="email" 
                                                        value={item.email || user?.email || ''}
                                                        onChange={(e) => handleBookingChange(item.id, 'email', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Phone (with country code)</label>
                                                    <input 
                                                        type="tel" 
                                                        value={item.phone || ''}
                                                        onChange={(e) => handleBookingChange(item.id, 'phone', e.target.value)}
                                                        placeholder="e.g., +254712345678"
                                                    />
                                                </div>
                                            </div>

                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>Travel Date *</label>
                                                    <input 
                                                        type="date" 
                                                        value={item.travelDate || ''}
                                                        onChange={(e) => handleBookingChange(item.id, 'travelDate', e.target.value)}
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Return Date (optional)</label>
                                                    <input 
                                                        type="date" 
                                                        value={item.returnDate || ''}
                                                        onChange={(e) => handleBookingChange(item.id, 'returnDate', e.target.value)}
                                                        min={item.travelDate || new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>Number of Adults *</label>
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        value={item.adults || 1}
                                                        onChange={(e) => handleBookingChange(item.id, 'adults', parseInt(e.target.value))}
                                                        required
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Number of Children</label>
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        value={item.children || 0}
                                                        onChange={(e) => handleBookingChange(item.id, 'children', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="formGroup">
                                                <label>Special Requests</label>
                                                <textarea 
                                                    value={item.specialRequests || ''}
                                                    onChange={(e) => handleBookingChange(item.id, 'specialRequests', e.target.value)}
                                                    placeholder="Any special requirements or notes"
                                                />
                                            </div>

                                            <div className="reviewSection">
                                                <h5>Rate This Destination</h5>
                                                <form onSubmit={(e) => handleSubmitReview(e, item.id)}>
                                                    <div className="formGroup">
                                                        <label>Your Rating</label>
                                                        <div className="star-rating interactive">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FaStar 
                                                                    key={star}
                                                                    className={`star ${star <= (reviewRatings[item.id] || 0) ? 'filled' : 'empty'}`}
                                                                    onClick={() => handleReviewRating(item.id, star)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="submit" 
                                                        className="btn submitReviewBtn"
                                                        disabled={!reviewRatings[item.id] || isLoading}
                                                    >
                                                        {isLoading ? 'Submitting...' : 'Submit Rating'}
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="itemActions">
                                                <button 
                                                    className="btn removeBtn"
                                                    onClick={() => removeFromCart(item.id)}
                                                    disabled={isLoading}
                                                >
                                                    <AiFillDelete className="icon" /> Remove
                                                </button>
                                                <button 
                                                    className={`btn bookBtn ${isInSummary ? 'inactive' : ''}`}
                                                    onClick={() => handleBookDestination(item)}
                                                    disabled={isLoading || isInSummary}
                                                >
                                                    {isInSummary ? 'Added to Summary' : 'Book This Destination'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {summaryItems.length > 0 && (
                        <div className="proceedToSummary">
                            <button 
                                className="btn proceedBtn"
                                onClick={handleProceedToSummary}
                                disabled={isLoading}
                            >
                                Proceed to Summary ({summaryItems.length})
                            </button>
                        </div>
                    )}
                </div>
            )}

            <AuthPromptModal 
                show={showAuthModal}
                action="proceedToCheckout"
                onClose={() => setShowAuthModal(false)}
            />
        </section>
    );
};

export default MyCart;