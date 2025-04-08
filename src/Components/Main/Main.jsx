import React from "react";
import './main.css';
import {HiOutlineLocationMarker} from 'react-icons/hi';
import {HiOutlineClipboardCheck} from 'react-icons/hi';
import img from '../../Assets/img (1).jpg';
import img2 from '../../Assets/img (2).jpg';
import img3 from '../../Assets/img (3).jpg';
import img4 from '../../Assets/img (4).jpg';
import img5 from '../../Assets/img (5).jpg';
import img6 from '../../Assets/img (6).jpg';
import img7 from '../../Assets/img (7).jpg';
import img8 from '../../Assets/img (8).jpg';
import img9 from '../../Assets/img (9).jpg';


const Data = [
    {
        id: 1,
        imgSrc: img,
        destTitle: "Bora Bora",
        location: "New Zealand",
        grade: "Cultural Relax",
        fees: "$700",
        description: "The epitome of romance, Bora Bora is a tropical paradise with stunning turquoise waters, luxurious overwater bungalows, and breathtaking sunsets. It's the perfect destination for couples seeking a romantic getaway."
    },
    {
        id: 2,
        imgSrc: img2,
        destTitle: "Machu Picchu",
        location: "Peru",
        grade: "Cultural Relax",
        fees: "$600",
        description: "Huayna Picchu is an ancient Incan citadel nestled in the Andes Mountains. It's a UNESCO World Heritage site and offers breathtaking views, rich history, and a chance to explore the fascinating culture of the Incas."
    },
    {
        id: 3,
        imgSrc: img3,
        destTitle: "Great Wall",
        location: "China",
        grade: "Cultural Relax",
        fees: "$700",
        description: "The Great Wall of China is a UNESCO World Heritage site and one of the most iconic landmarks in the world. It offers stunning views, rich history, and a chance to explore the fascinating culture of the Chinese civilization."
    },
    {
        id: 4,
        imgSrc: img4,
        destTitle: "Grand Canyon",
        location: "USA",
        grade: "Cultural Relax",
        fees: "$700",
        description: "The Grand Canyon is a natural wonder that offers breathtaking views, hiking trails, and opportunities for adventure. It's a must-visit destination for nature lovers and outdoor enthusiasts."
    },
    {
        id: 5,
        imgSrc: img5,
        destTitle: "Eiffel Tower",
        location: "France",
        grade: "Cultural Relax",
        fees: "$700",
        description: "The Eiffel Tower is an iconic symbol of Paris and a must-visit destination for anyone traveling to France. It offers stunning views of the city, rich history, and a chance to experience the romance of Paris."
    },
    {
        id: 6,
        imgSrc: img6,
        destTitle: "Santorini",
        location: "Greece",
        grade: "Cultural Relax",
        fees: "$700",
        description: "Santorini is a stunning island in Greece known for its white-washed buildings, crystal-clear waters, and breathtaking sunsets. It's a popular destination for couples seeking a romantic getaway."
    },
    {
        id: 7,
        imgSrc: img7,
        destTitle: "Bali Island",
        location: "Indonesia",
        grade: "Cultural Relax",
        fees: "$500",
        description: "Bali Island is a tropical paradise known for its stunning beaches, lush landscapes, and vibrant culture. It's a popular destination for travelers seeking relaxation, adventure, and a taste of Balinese culture."
    },
    {
        id: 8,
        imgSrc: img8,
        destTitle: "Great Barrier Reef",
        location: "Australia",
        grade: "Cultural Relax",
        fees: "$700",
        description: "The Great Barrier Reef is the world's largest coral reef system and a UNESCO World Heritage site. It's a paradise for divers and snorkelers, offering stunning marine life and vibrant coral reefs."
    },
    {
        id: 9,
        imgSrc: img9,
        destTitle: "Cappadocia",
        location: "Turkey",
        grade: "Cultural Relax",
        fees: "$600",
        description: "Cappadocia is a unique region in Turkey known for its surreal landscapes, fairy chimneys, and ancient cave dwellings. It's a popular destination for hot air balloon rides and exploring the rich history of the area."
    }
]
const Main = () => {

    return (
        <section className="main container section">
            <div className="secTitle"></div>
            <h3 className="title">
                Most Visited Destinations
            </h3>

            <div className="secContent grid">

                {
                    data.map(({ id, imgSrc, destTitle, location, grade, fees, description }) => { 
                        return (
                            <div className="singleDestination" key={id}>
                                <div className="imageDiv">
                                    <img src={imgSrc} alt={destTitle} />
                                </div>
                                <div className="cardInfo">
                                    <h4 className="destTitle">{destTitle}</h4>
                                    <span className="continent flex">
                                        <HiOutlineLocationMarker className="icon" />
                                        <span className="name">{location}</span>
                                        <span className="material-symbols-outlined">location_on</span>
                                    </span>
                                    <div className="fees flex">
                                        <div className="grade">
                                            <span>{grade} <small>+1</small></span>
                                        </div>
                                        <div className="price">
                                            <h5>{fees}</h5>
                                        </div>
                                    </div>
                                    <div className="desc">
                                        <p>{description}</p>
                                    </div>

                                    <button className="btn flex">
                                        DETAILS <HiOutlineClipboardCheck className="icon" />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Main;