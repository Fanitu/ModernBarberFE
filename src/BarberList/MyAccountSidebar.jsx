import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../apiServece/apiService';
const MyAccountSidebar = ({ isOpen, onClose, onLanguageChange }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  useEffect(() => {
    if (isOpen) {
      fetchUserBookings();
    }
  }, [isOpen]);

  const fetchUserBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setUserBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>My Account</h3>
        <button className="sidebar-close" onClick={onClose}>×</button>
      </div>
      
      <div className="sidebar-section">
        <h4>Language</h4>
        <div className="language-selector">
          <button 
            className={`lang-btn ${selectedLanguage === 'amharic' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('amharic')}
          >
            አማርኛ
          </button>
          <button 
            className={`lang-btn ${selectedLanguage === 'english' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('english')}
          >
            English
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>📍 Our Shop</h4>
        <p>Bole, Addis Ababa, Ethiopia</p>
        <p>Open: 8:00 AM - 8:00 PM</p>
      </div>

      <div className="sidebar-section">
        <h4>My Bookings</h4>
        {userBookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="bookings-list">
            {userBookings.map((booking, index) => (
              <div key={index} className="booking-item">
                <span>{new Date(booking.date).toLocaleDateString()}</span>
                <span className={`status-${booking.status}`}>{booking.status}</span>
                {booking.paymentUrl && (
                  <a href={booking.paymentUrl} target="_blank" rel="noopener noreferrer">
                    Receipt
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountSidebar;