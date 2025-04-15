import React, { useState, useEffect, useRef } from 'react';
import './internationalHolidays.scss';
import { HiOutlineLocationMarker, HiOutlineClipboardCheck, HiShoppingCart } from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext.jsx';
import AuthPromptModal from '../Navbar/AuthPromptModal.jsx';
import { destinationsApi } from '../../utils/api';

const InternationalHolidays = () => {
    const [destinations, setDestinations] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suggestedDestination, setSuggestedDestination] = useState({
        title: '',
        location: '',
        description: '',
        fees: '',
        image_url: '',
        is_package: false,
        type: 'international'
    });
    const [destActiveDot, setDestActiveDot] = useState(0);
    const [pkgActiveDot, setPkgActiveDot] = useState(0);
    const [destButtons, setDestButtons] = useState({ left: false, right: true });
    const [pkgButtons, setPkgButtons] = useState({ left: false, right: true });

    const { addToCart, isAuthenticated, LoadingSpinner, cartItems } = useCart();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authAction, setAuthAction] = useState('');

    // Refs for carousels
    const destCarouselRef = useRef(null);
    const pkgCarouselRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const destResponse = await destinationsApi.getDestinations({
                    type: 'international',
                    is_package: false
                });
                const pkgResponse = await destinationsApi.getDestinations({
                    type: 'international',
                    is_package: true
                });

                setDestinations(destResponse.data);
                setPackages(pkgResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load destinations. Please try again later.');
                setLoading(false);
                console.error('Error fetching destinations:', err);
            }
        };

        fetchData();
    }, []);

    const updateButtonStates = (carouselRef, setButtons, itemCount) => {
        const container = carouselRef.current;
        if (!container) return;

        const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = Math.max(0, (itemCount - 3) * cardWidth); // Stop when last 3 cards are visible

        setButtons({
            left: scrollLeft <= 0,
            right: scrollLeft >= maxScroll - 1 // -1 for rounding errors
        });
    };

    const updateActiveDot = (carouselRef, setActiveDot, itemCount) => {
        const container = carouselRef.current;
        if (!container) return;

        const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
        const scrollPosition = container.scrollLeft;
        const cardIndex = Math.round(scrollPosition / cardWidth);
        const itemsPerDot = Math.ceil(Math.max(1, (itemCount - 2) / 3)); // Segments for 3 dots
        const activeDot = Math.min(2, Math.floor(cardIndex / itemsPerDot));

        setActiveDot(activeDot);
    };

    useEffect(() => {
        const destContainer = destCarouselRef.current;
        const pkgContainer = pkgCarouselRef.current;

        const handleDestScroll = () => {
            updateButtonStates(destCarouselRef, setDestButtons, destinations.length);
            updateActiveDot(destCarouselRef, setDestActiveDot, destinations.length);
        };

        const handlePkgScroll = () => {
            updateButtonStates(pkgCarouselRef, setPkgButtons, packages.length);
            updateActiveDot(pkgCarouselRef, setPkgActiveDot, packages.length);
        };

        if (destContainer) {
            destContainer.addEventListener('scroll', handleDestScroll);
            updateButtonStates(destCarouselRef, setDestButtons, destinations.length);
            updateActiveDot(destCarouselRef, setDestActiveDot, destinations.length);
        }

        if (pkgContainer) {
            pkgContainer.addEventListener('scroll', handlePkgScroll);
            updateButtonStates(pkgCarouselRef, setPkgButtons, packages.length);
            updateActiveDot(pkgCarouselRef, setPkgActiveDot, packages.length);
        }

        return () => {
            if (destContainer) destContainer.removeEventListener('scroll', handleDestScroll);
            if (pkgContainer) pkgContainer.removeEventListener('scroll', handlePkgScroll);
        };
    }, [destinations, packages]);

    const handleAddToCart = (item) => {
        if (!isAuthenticated()) {
            setAuthAction('addToCart');
            setShowAuthModal(true);
            return;
        }
        addToCart({
            ...item,
            fees: parseFloat(item.fees),
            adults: 1,
            children: 0,
            travelDate: new Date().toISOString().split('T')[0]
        });
    };

    const isInCart = (id) => {
        return cartItems.some(item => item.id === id);
    };

    const scrollCarousel = (direction, carouselRef, setButtons, setActiveDot, itemCount) => {
        const container = carouselRef.current;
        if (!container) return;

        const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
        const currentScroll = container.scrollLeft;
        const maxScroll = Math.max(0, (itemCount - 3) * cardWidth); // Stop at last 3 cards
        let newScrollLeft;

        if (direction === 'left') {
            newScrollLeft = Math.max(0, currentScroll - cardWidth);
        } else {
            newScrollLeft = Math.min(maxScroll, currentScroll + cardWidth);
        }

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });

        // Update button states and active dot after scroll
        setTimeout(() => {
            updateButtonStates(carouselRef, setButtons, itemCount);
            updateActiveDot(carouselRef, setActiveDot, itemCount);
        }, 300); // Match scroll animation duration
    };

    const handleDotClick = (index, carouselRef, setActiveDot, itemCount) => {
        const container = carouselRef.current;
        if (!container) return;

        const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
        const itemsPerDot = Math.ceil(Math.max(1, (itemCount - 2) / 3)); // Segments for 3 dots
        const maxScroll = Math.max(0, (itemCount - 3) * cardWidth);
        let scrollTo;

        if (index === 0) {
            scrollTo = 0;
        } else if (index === 1) {
            scrollTo = itemsPerDot * cardWidth;
        } else {
            scrollTo = maxScroll; // Last 3 cards
        }

        container.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
        setActiveDot(index);
    };

    const handleSuggestionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSuggestedDestination(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const submitSuggestion = async (e) => {
        e.preventDefault();
        try {
            await destinationsApi.suggestDestination(suggestedDestination);
            alert('Thank you for your suggestion! We will review it soon.');
            setSuggestedDestination({
                title: '',
                location: '',
                description: '',
                fees: '',
                image_url: '',
                is_package: false,
                type: 'international'
            });
        } catch (err) {
            console.error('Error submitting suggestion:', err);
            alert('Failed to submit suggestion. Please try again.');
        }
    };

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

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <section className="internationalHolidays container section">
            <div className="secTitle">
                <h3 className="title">International Holiday Experiences</h3>
            </div>

            <div className="secTitle" style={{ marginTop: '2rem' }}>
                <h4 className="subtitle">Single Destinations</h4>
            </div>

            <div className="destinationsContainer">
                <div className="scrollControls">
                    <button
                        className="scrollButton left"
                        onClick={() => scrollCarousel('left', destCarouselRef, setDestButtons, setDestActiveDot, destinations.length)}
                        disabled={destButtons.left}
                    >
                        <FiChevronLeft className="icon" />
                    </button>

                    <div className="carouselWrapper" ref={destCarouselRef}>
                        <div className="destinationsGrid">
                            {destinations.map(destination => {
                                const averageRating = calculateAverageRating(destination.reviews);
                                const inCart = isInCart(destination.id);

                                return (
                                    <div key={destination.id} className="destinationCard">
                                        <div className="imageDiv">
                                            <img src={destination.image_url} alt={destination.title} />
                                        </div>
                                        <div className="cardInfo">
                                            <h4 className="destTitle">{destination.title}</h4>
                                            <span className="locations">
                                                <span className="location flex">
                                                    <HiOutlineLocationMarker className="icon" />
                                                    <span>{destination.location}</span>
                                                </span>
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
                                                        <HiShoppingCart className="icon" /> In Cart
                                                    </>
                                                ) : (
                                                    <>
                                                        Add to Cart <HiOutlineClipboardCheck className="icon" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        className="scrollButton right"
                        onClick={() => scrollCarousel('right', destCarouselRef, setDestButtons, setDestActiveDot, destinations.length)}
                        disabled={destButtons.right}
                    >
                        <FiChevronRight className="icon" />
                    </button>
                </div>
                <div className="carouselDots">
                    {[0, 1, 2].map(index => (
                        <span
                            key={index}
                            className={`dot ${index === destActiveDot ? 'active' : ''}`}
                            onClick={() => handleDotClick(index, destCarouselRef, setDestActiveDot, destinations.length)}
                        ></span>
                    ))}
                </div>
            </div>

            <div className="secTitle" style={{ marginTop: '3rem' }}>
                <h4 className="subtitle">Holiday Packages</h4>
            </div>

            <div className="packagesContainer">
                <div className="scrollControls">
                    <button
                        className="scrollButton left"
                        onClick={() => scrollCarousel('left', pkgCarouselRef, setPkgButtons, setPkgActiveDot, packages.length)}
                        disabled={pkgButtons.left}
                    >
                        <FiChevronLeft className="icon" />
                    </button>

                    <div className="carouselWrapper" ref={pkgCarouselRef}>
                        <div className="packagesGrid">
                            {packages.map(pkg => {
                                const averageRating = calculateAverageRating(pkg.reviews);
                                const inCart = isInCart(pkg.id);

                                return (
                                    <div key={pkg.id} className="destinationCard">
                                        <div className="imageDiv">
                                            <img src={pkg.image_url} alt={pkg.title} />
                                        </div>
                                        <div className="cardInfo">
                                            <h4 className="packageTitle">{pkg.title}</h4>
                                            <span className="locations">
                                                {pkg.location.split(',').map((loc, i) => (
                                                    <span key={i} className="location flex">
                                                        <HiOutlineLocationMarker className="icon" />
                                                        <span>{loc.trim()}</span>
                                                    </span>
                                                ))}
                                            </span>
                                            <div className="rating-section">
                                                <StarRating rating={averageRating} />
                                                <span className="review-count">
                                                    ({pkg.reviews?.length || 0} reviews)
                                                </span>
                                            </div>
                                            <div className="duration">
                                                <span>{pkg.duration}</span>
                                            </div>
                                            <div className="fees flex">
                                                <div className="price">
                                                    <h5>${pkg.fees}</h5>
                                                </div>
                                            </div>
                                            <div className="desc">
                                                <p>{pkg.description}</p>
                                            </div>
                                            <button
                                                className={`btn flex ${inCart ? 'inCart' : ''}`}
                                                onClick={() => handleAddToCart(pkg)}
                                                disabled={inCart}
                                            >
                                                {inCart ? (
                                                    <>
                                                        <HiShoppingCart className="icon" /> In Cart
                                                    </>
                                                ) : (
                                                    <>
                                                        Add to Cart <HiOutlineClipboardCheck className="icon" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        className="scrollButton right"
                        onClick={() => scrollCarousel('right', pkgCarouselRef, setPkgButtons, setPkgActiveDot, packages.length)}
                        disabled={pkgButtons.right}
                    >
                        <FiChevronRight className="icon" />
                    </button>
                </div>
                <div className="carouselDots">
                    {[0, 1, 2].map(index => (
                        <span
                            key={index}
                            className={`dot ${index === pkgActiveDot ? 'active' : ''}`}
                            onClick={() => handleDotClick(index, pkgCarouselRef, setPkgActiveDot, packages.length)}
                        ></span>
                    ))}
                </div>
            </div>

            {/* Suggestion Form */}
            <div className="suggestionForm">
                <h4 className="formTitle">Can't find what you're looking for?</h4>
                <p className="formSubtitle">Suggest a new international destination</p>

                <form onSubmit={submitSuggestion}>
                    <div className="formRow">
                        <div className="formGroup">
                            <label>Destination Name *</label>
                            <input
                                type="text"
                                name="title"
                                value={suggestedDestination.title}
                                onChange={handleSuggestionChange}
                                required
                                maxLength={100}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={suggestedDestination.location}
                                onChange={handleSuggestionChange}
                                required
                                maxLength={100}
                            />
                        </div>
                    </div>

                    <div className="formGroup">
                        <label>Description * (Max 500 characters)</label>
                        <textarea
                            name="description"
                            value={suggestedDestination.description}
                            onChange={handleSuggestionChange}
                            required
                            maxLength={500}
                            placeholder="Describe the destination (max 500 characters)"
                        />
                    </div>

                    <div className="formRow">
                        <div className="formGroup">
                            <label>Estimated Price ($) *</label>
                            <input
                                type="number"
                                name="fees"
                                min="0"
                                value={suggestedDestination.fees}
                                onChange={handleSuggestionChange}
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                name="image_url"
                                value={suggestedDestination.image_url}
                                onChange={handleSuggestionChange}
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>
                    </div>

                    <div className="formGroup">
                        <label>Is this a package?</label>
                        <div className="checkboxContainer">
                            <input
                                type="checkbox"
                                name="is_package"
                                checked={suggestedDestination.is_package}
                                onChange={handleSuggestionChange}
                            />
                            <span>Yes, this is a holiday package</span>
                        </div>
                    </div>

                    <button type="submit" className="submitBtn">
                        Submit Suggestion
                    </button>
                </form>
            </div>

            <AuthPromptModal
                show={showAuthModal}
                action={authAction}
                onClose={() => setShowAuthModal(false)}
            />
        </section>
    );
};

export default InternationalHolidays;