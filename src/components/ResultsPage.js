
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ResultsPage.module.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { city, state, startDate, endDate, budget, hotelFacilities, restaurantFacilities } = location.state || {};

  const [tab, setTab] = useState('hotels');
  const [results, setResults] = useState({
    hotels: [],
    restaurants: [],
    attractions: [],
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.post('http://localhost:5001/recommendations', {
          city,
          state,
          hotelFacilities,
        });
        console.log("Hotel recommendations:", response.data);

        // Set the results returned from the backend (only hotels in this case)
        setResults({ hotels: response.data });
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    fetchResults();
  }, [city, state, hotelFacilities]);

  const renderContent = () => {
    if (!results || !results.hotels) {
      return <div>Loading results...</div>; 
    }

    switch (tab) {
      case 'hotels':
  return (
    <div className={styles.hotelList}>
      <h2 className={styles.hotelHeading}>Popular Hotels</h2>
      {results.hotels.length > 0 ? (
        <div className={styles.hotelCards}>
          {results.hotels.map((hotel, index) => (
            <div className={styles.hotelCard} key={index}>
              <h3 className={styles.hotelName}>{hotel.HotelName}</h3>
              <div className={styles.hotelDetails}>
                <p><strong>Rating:</strong> {hotel.HotelRating}</p>
                <p><strong>Address:</strong> {hotel.Address}</p>
                <p><strong>Website:</strong> 
                  <a href={hotel.HotelWebsite} target="_blank" rel="noopener noreferrer">
                    {hotel.HotelWebsite}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hotels found.</p>
      )}
    </div>
  );



      // You can add similar sections for restaurants or attractions if needed
      
      case 'restaurants':
        return (
          <div>
            <h2>Popular Restaurants in {city}, {state}</h2>
            {results.restaurants.length > 0 ? (
              <ul>
                {results.restaurants.map((restaurant, index) => (
                  <li key={index}>{restaurant}</li>
                ))}
              </ul>
            ) : (
              <p>No restaurants found.</p>
            )}
          </div>
        );
      case 'attractions':
        return (
          <div>
            <h2>Popular Attractions in {city}, {state}</h2>
            {results.attractions.length > 0 ? (
              <ul>
                {results.attractions.map((attraction, index) => (
                  <li key={index}>{attraction}</li>
                ))}
              </ul>
            ) : (
              <p>No attractions found.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleModifySearch = () => {
    navigate('/home');
  };

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.navbar}>
        <div className={styles.tabButtons}>
          <button
            onClick={() => setTab('hotels')}
            className={tab === 'hotels' ? styles.active : ''}
          >
            Hotels
          </button>
          <button
            onClick={() => setTab('restaurants')}
            className={tab === 'restaurants' ? styles.active : ''}
          >
            Restaurants
          </button>
          <button
            onClick={() => setTab('attractions')}
            className={tab === 'attractions' ? styles.active : ''}
          >
            Attractions
          </button>
        </div>
        
        {/* Modify Search button */}
        <button onClick={handleModifySearch} className={styles.modifySearchButton}>
          Modify Search
        </button>
      </div>
      <div className={styles.resultsHeading}>
        <h1>Results for {city}, {state}</h1>  {/* Display city and state */}
      </div>
      {/* Content area */}
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default ResultsPage;
