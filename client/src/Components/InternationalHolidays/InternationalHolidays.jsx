import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './internationalHolidays.scss';
import { HiOutlineLocationMarker, HiOutlineClipboardCheck, HiShoppingCart } from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import AuthPromptModal from '../Navbar/AuthPromptModal.jsx';

const InternationalHolidays = () => {
  const { addToCart, isAuthenticated, LoadingSpinner, cartItems } = useCart();
  const [singleDestinations, setSingleDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    image_url: '',
    fees: '',
    type: 'international',
    is_package: false,
    duration: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [destActiveDot, setDestActiveDot] = useState(0);
  const [pkgActiveDot, setPkgActiveDot] = useState(0);
  const [destButtons, setDestButtons] = useState({ left: false, right: true });
  const [pkgButtons, setPkgButtons] = useState({ left: false, right: true });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');

  const destCarouselRef = useRef(null);
  const pkgCarouselRef = useRef(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const singleResponse = await axios.get('http://localhost:5000/api/destinations?type=international&is_package=false');
      const packageResponse = await axios.get('http://localhost:5000/api/destinations?type=international&is_package=true');
      setSingleDestinations(singleResponse.data);
      setPackages(packageResponse.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load destinations. Please try again later.');
      setLoading(false);
      console.error('Error fetching destinations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/destinations/suggest', formData);
      setSuccessMessage('Destination suggestion submitted successfully!');
      await fetchDestinations();
      setFormData({
        title: '',
        location: '',
        description: '',
        image_url: '',
        fees: '',
        type: 'international',
        is_package: false,
        duration: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSuccessMessage('Failed to submit suggestion. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const updateButtonStates = (carouselRef, setButtons, itemCount) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = Math.max(0, (itemCount - 3) * cardWidth);

    setButtons({
      left: scrollLeft <= 0,
      right: scrollLeft >= maxScroll - 1
    });
  };

  const updateActiveDot = (carouselRef, setActiveDot, itemCount) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
    const scrollPosition = container.scrollLeft;
    const cardIndex = Math.round(scrollPosition / cardWidth);
    const itemsPerDot = Math.ceil(Math.max(1, (itemCount - 2) / 3));
    const activeDot = Math.min(2, Math.floor(cardIndex / itemsPerDot));

    setActiveDot(activeDot);
  };

  useEffect(() => {
    const destContainer = destCarouselRef.current;
    const pkgContainer = pkgCarouselRef.current;

    const handleDestScroll = () => {
      updateButtonStates(destCarouselRef, setDestButtons, singleDestinations.length);
      updateActiveDot(destCarouselRef, setDestActiveDot, singleDestinations.length);
    };

    const handlePkgScroll = () => {
      updateButtonStates(pkgCarouselRef, setPkgButtons, packages.length);
      updateActiveDot(pkgCarouselRef, setPkgActiveDot, packages.length);
    };

    if (destContainer) {
      destContainer.addEventListener('scroll', handleDestScroll);
      updateButtonStates(destCarouselRef, setDestButtons, singleDestinations.length);
      updateActiveDot(destCarouselRef, setDestActiveDot, singleDestinations.length);
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
  }, [singleDestinations, packages]);

  const scrollCarousel = (direction, carouselRef, setButtons, setActiveDot, itemCount) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
    const currentScroll = container.scrollLeft;
    const maxScroll = Math.max(0, (itemCount - 3) * cardWidth);
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

    setTimeout(() => {
      updateButtonStates(carouselRef, setButtons, itemCount);
      updateActiveDot(carouselRef, setActiveDot, itemCount);
    }, 300);
  };

  const handleDotClick = (index, carouselRef, setActiveDot, itemCount) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.destinationCard')?.offsetWidth || 350;
    const itemsPerDot = Math.ceil(Math.max(1, (itemCount - 2) / 3));
    const maxScroll = Math.max(0, (itemCount - 3) * cardWidth);
    let scrollTo;

    if (index === 0) {
      scrollTo = 0;
    } else if (index === 1) {
      scrollTo = itemsPerDot * cardWidth;
    } else {
      scrollTo = maxScroll;
    }

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
    setActiveDot(index);
  };

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
            onClick={() => scrollCarousel('left', destCarouselRef, setDestButtons, setDestActiveDot, singleDestinations.length)}
            disabled={destButtons.left}
          >
            <FiChevronLeft className="icon" />
          </button>

          <div className="carouselWrapper" ref={destCarouselRef}>
            <div className="destinationsGrid">
              {singleDestinations.map(dest => {
                const averageRating = calculateAverageRating(dest.reviews);
                const inCart = isInCart(dest.id);

                return (
                  <div key={dest.id} className="destinationCard">
                    <div className="imageDiv">
                      <img src={dest.image_url} alt={dest.title} />
                    </div>
                    <div className="cardInfo">
                      <h4 className="destTitle">{dest.title}</h4>
                      <span className="locations">
                        <span className="location flex">
                          <HiOutlineLocationMarker className="icon" />
                          <span>{dest.location}</span>
                        </span>
                      </span>
                      <div className="rating-section">
                        <StarRating rating={averageRating} />
                        <span className="review-count">
                          ({dest.reviews?.length || 0} reviews)
                        </span>
                      </div>
                      <div className="fees flex">
                        <div className="price">
                          <h5>${dest.fees}</h5>
                        </div>
                      </div>
                      <div className="desc">
                        <p>{dest.description}</p>
                      </div>
                      <button
                        className={`btn flex ${inCart ? 'inCart' : ''}`}
                        onClick={() => handleAddToCart(dest)}
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
            onClick={() => scrollCarousel('right', destCarouselRef, setDestButtons, setDestActiveDot, singleDestinations.length)}
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
              onClick={() => handleDotClick(index, destCarouselRef, setDestActiveDot, singleDestinations.length)}
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

      <div className="suggestionForm">
        <h4 className="formTitle">Can't find what you're looking for?</h4>
        <p className="formSubtitle">Suggest a new international destination</p>
        {successMessage && (
          <p className={`text-center mb-4 ${successMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="formRow">
            <div className="formGroup">
              <label>Destination Name *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </div>
            <div className="formGroup">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </div>
          </div>

          <div className="formGroup">
            <label>Description * (Max 500 characters)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
                value={formData.fees}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="formGroup">
            <label>Is this a package?</label>
            <div className="checkboxContainer">
              <input
                type="checkbox"
                name="is_package"
                checked={formData.is_package}
                onChange={handleInputChange}
              />
              <span>Yes, this is a holiday package</span>
            </div>
          </div>

          {formData.is_package && (
            <div className="formGroup">
              <label>Duration (e.g., 7 days, 6 nights)</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>
          )}

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