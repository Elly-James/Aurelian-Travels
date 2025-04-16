import React, { useState, useEffect } from "react";
import './home.scss';
import {GrLocation} from 'react-icons/gr';
import {HiSearch} from 'react-icons/hi';
import {FiFacebook} from 'react-icons/fi';
import {AiOutlineInstagram} from 'react-icons/ai';
import {FaTripadvisor} from 'react-icons/fa';
import {BsListTask} from 'react-icons/bs';
import {TbApps} from 'react-icons/tb';

import Main from '../Main/Main';
import { useCart } from '../context/CartContext';
import { destinationsApi } from '../../utils/api';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [priceRange, setPriceRange] = useState(5000);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useCart();

    useEffect(() => {
        const fetchTopRatedDestinations = async () => {
            try {
                // Fetch all destinations
                const response = await destinationsApi.getDestinations();
                const allDestinations = response.data;
                
                // Calculate average ratings and filter
                const ratedDestinations = allDestinations.map(dest => ({
                    ...dest,
                    avgRating: calculateAverageRating(dest.reviews),
                    reviewCount: dest.reviews?.length || 0
                }));

                // Filter destinations with at least 1 review
                const reviewedDestinations = ratedDestinations.filter(d => d.reviewCount > 0);
                
                // Sort by rating (highest first)
                reviewedDestinations.sort((a, b) => b.avgRating - a.avgRating);
                
                // Get top 15 highest rated to ensure variety
                const topRated = reviewedDestinations.slice(0, 15);
                
                // Shuffle and select 9 random destinations
                const shuffled = [...topRated].sort(() => 0.5 - Math.random());
                const selectedDestinations = shuffled.slice(0, 9);
                
                setDestinations(selectedDestinations);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching destinations:', error);
                setLoading(false);
            }
        };

        fetchTopRatedDestinations();
    }, []);

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
    };

    const handleSearch = async () => {
        if (!isAuthenticated()) {
            alert('Please login to search destinations');
            return;
        }
        try {
            const response = await destinationsApi.searchDestinations({
                q: searchTerm,
                max_price: priceRange,
                date: selectedDate
            });
            setDestinations(response.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    return (
        <>
            <section className='home'>
                <div className='overlay'></div>
                    <video 
                        src="https://cdn.pixabay.com/video/2019/04/23/23011-332483109_tiny.mp4" 
                        muted 
                        autoPlay 
                        loop 
                        type="video/mp4">
                    </video>
                            
                <div className="homeContent container">
                    <div className="textDiv">
                        <span className="smallText">
                            TRAVEL WITH US
                        </span>
                        <h1 className="homeTitle">
                            Search your Holiday
                        </h1>
                    </div>

                    <div className="cardDiv">
                        <div className="destinationInput">
                            <label htmlFor="city">Search your destination:</label>
                            <div className="input flex">
                                <input 
                                    type="text" 
                                    placeholder="Enter name here..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <GrLocation className="icon"/>
                            </div>
                        </div>

                        <div className="dateInput">
                            <label htmlFor="date">Select your date:</label>
                            <div className="input flex">
                                <input 
                                    type="date" 
                                    placeholder="dd/mm/yyyy"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="priceInput">
                            <div className="label_total flex">
                                <label htmlFor="price">Max price:</label>
                                <h3 className="total">${priceRange}</h3>
                            </div>
                            <div className="input flex">
                                <input 
                                    type="range" 
                                    max="5000" 
                                    min="1000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="searchOptions flex" onClick={handleSearch}>
                            <HiSearch className="icon"/>
                            <span>SEARCH</span>
                        </div>
                    </div>

                    <div className="homeFooterIcons flex">
                        <div className="rightIcons">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FiFacebook className="icon" />
                        </a>
                        <a href="https://www.instagram.com/its_gathua" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <AiOutlineInstagram className="icon" />
                        </a>
                        <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor">
                        <FaTripadvisor className="icon" />
                        </a>
                        </div>
                        <div className="leftIcons">
                            <BsListTask className="icon"/>
                            <TbApps className="icon"/>
                        </div>
                    </div>
                </div>
            </section>
            
            <Main destinations={destinations} loading={loading} />
        </>
    )
}

export default Home;
