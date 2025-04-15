import React, { useState } from 'react';

import './main.scss';
import { HiOutlineLocationMarker, HiOutlineClipboardCheck } from 'react-icons/hi';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext.jsx';
import AuthPromptModal from '../Navbar/AuthPromptModal.jsx';

const Main = ({ destinations, loading }) => {
    const { 
        addToCart, 
        isAuthenticated, 
        requireAuth, 
        LoadingSpinner,
        cartItems
    } = useCart();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const StarRating = ({ rating }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar 
                    key={i}
                    className={i <= rating ? "star filled" : "star empty"}
                />
            );
        }
        return <div className="star-rating">{stars}</div>;
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    };

    const handleAddToCart = (destination) => {
        if (!isAuthenticated()) {
            const authCheck = requireAuth('addToCart');
            if (authCheck.requiresAuth) {
                setShowAuthModal(true);
                return;
            }
        }
        addToCart({
            ...destination,
            fees: parseFloat(destination.fees),
            adults: 1,
            children: 0,
            travelDate: new Date().toISOString().split('T')[0]
        });
    };

    const isInCart = (id) => {
        return cartItems.some(item => item.id === id);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <section className="main container section">
            <div className="secTitle">
                <h3 className="title">Top Rated Destinations</h3>
                <p className="subtitle">Our highest rated destinations from around the world</p>
            </div>

            <div className="secContent grid">
                {destinations.map((destination) => { 
                    const averageRating = calculateAverageRating(destination.reviews);
                    const inCart = isInCart(destination.id);
                    
                    return (
                        <div className="singleDestination" key={destination.id}>
                            <div className="imageDiv">
                                <img src={destination.image_url} alt={destination.title} />
                                <div className="destinationType">
                                    {destination.is_package ? 'Package' : 'Single'} • {destination.type}
                                </div>
                            </div>
                            <div className="cardInfo">
                                <h4 className="destTitle">{destination.title}</h4>
                                <span className="continent flex">
                                    <HiOutlineLocationMarker className="icon" />
                                    <span className="name">{destination.location}</span>
                                </span>
                                <div className="rating-section">
                                    <StarRating rating={averageRating} />
                                    <span className="review-count">
                                        ({destination.reviews?.length || 0} reviews)
                                    </span>
                                </div>
                                <div className="fees flex">
                                    <div className="price">
                                        <h5>${destination.fees}</h5>
                                    </div>
                                </div>
                                <div className="desc">
                                    <p>{destination.description}</p>
                                </div>
                                <button 
                                    className={`btn flex ${inCart ? 'inCart' : ''}`} 
                                    onClick={() => handleAddToCart(destination)}
                                    disabled={inCart}
                                >
                                    {inCart ? (
                                        <>
                                            <FaShoppingCart className="icon" /> In Cart
                                        </>
                                    ) : (
                                        <>
                                            Add to Cart <HiOutlineClipboardCheck className="icon" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <AuthPromptModal 
                show={showAuthModal}
                action="addToCart"
                onClose={() => setShowAuthModal(false)}
            />
        </section>
    );
};

export default Main;