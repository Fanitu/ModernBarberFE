import React, { useState, useEffect } from "react";
import { bookingAPI, barberAPI } from "../apiServece/apiService.jsx"
import './Availability.css';

const Availability = ({ barber, service, onBook, onBack }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to get today's date in local timezone (YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (barber && service && selectedDate) {
      fetchAvailability();
    }
  }, [barber, service, selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    setSelectedSlot(null);
    try {
      const dateString = formatDateForAPI(selectedDate);
      console.log('Fetching availability for:', dateString);
      
      const response = await barberAPI.getAvailability(
        barber._id,
        dateString,
        service.duration
      );
      
      if (response.data?.data?.availableTimes) {
        setAvailableSlots(response.data.data.availableTimes);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load available time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot || !selectedDate) return;
    
    try {
      const bookingData = {
        barberId: barber._id,
        bookingDate: formatDateForAPI(selectedDate), // Use formatted date
        startTime: selectedSlot.startTime,
        service: {
          name: service.name,
          duration: service.duration,
          price: service.price,
          serviceId: service._id
        },
        barberName: barber.user.name,
        serviceName: service.name
      };
      
      console.log('Booking data:', bookingData);
      
      // Validate before proceeding
      await barberAPI.validateAvailability({
        barberId: barber._id,
        date: bookingData.bookingDate,
        startTime: bookingData.startTime,
        serviceDuration: service.duration
      });
      
      onBook(bookingData);
    } catch (error) {
      console.error('Validation failed:', error);
      alert('This time slot is no longer available. Please select another slot.');
      fetchAvailability(); // Refresh availability
    }
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get next 14 days for date selection
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Get day name
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <div className="availability-container">
      <div className="availability-header">
        <button 
          className="back-to-services-btn"
          onClick={onBack}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Services
        </button>
        
        <div className="availability-title-section">
          <h2>Select Appointment Time</h2>
          <div className="service-info-card">
            <div className="barber-avatar">
              {barber?.user?.name?.charAt(0) || 'B'}
            </div>
            <div className="service-details">
              <h3>{service?.name || 'Service'}</h3>
              <p className="barber-name">with {barber?.user?.name || 'Barber'}</p>
              <div className="service-meta">
                <span className="duration-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {service?.duration || 0} min
                </span>
                <span className="price-tag">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {service?.price || 0} Birr
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="availability-content">
        <div className="date-selector-section">
          <h3>Select Date</h3>
          <div className="date-scroller">
            {getNextDays().map((date, index) => {
              const isSelected = selectedDate && 
                date.toDateString() === selectedDate.toDateString();
              const isTodayDate = isToday(date);
              
              return (
                <button
                  key={index}
                  className={`date-option ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {isTodayDate && (
                    <div className="today-badge">Today</div>
                  )}
                  <div className="date-day">{getDayName(date)}</div>
                  <div className="date-number">{date.getDate()}</div>
                  <div className="date-month">{getMonthName(date)}</div>
                </button>
              );
            })}
          </div>
          <div className="selected-date-display">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {selectedDate ? formatDateForDisplay(selectedDate) : 'Select a date'}
          </div>
        </div>

        <div className="time-slots-section">
          <div className="section-header">
            <h3>Available Time Slots</h3>
            <div className="date-info-badge">
              {selectedDate && isToday(selectedDate) ? "Today's Slots" : 
               formatDateForDisplay(selectedDate)}
            </div>
          </div>

          {!selectedDate ? (
            <div className="select-date-prompt">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h4>Select a Date First</h4>
              <p>Please choose a date from the options above to see available time slots.</p>
            </div>
          ) : error ? (
            <div className="error-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>{error}</p>
              <button onClick={fetchAvailability} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading available slots for {formatDateForDisplay(selectedDate)}...</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <h4>No Available Slots</h4>
              <p>There are no available time slots for {formatDateForDisplay(selectedDate)}.</p>
              <button 
                className="try-another-date-btn"
                onClick={() => {
                  const tomorrow = new Date(selectedDate);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setSelectedDate(tomorrow);
                }}
              >
                Try Tomorrow
              </button>
            </div>
          ) : (
            <>
              <div className="time-slots-info">
                <div className="slots-count">
                  {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available
                </div>
                <button 
                  className="refresh-btn"
                  onClick={fetchAvailability}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  Refresh
                </button>
              </div>
              
              <div className="time-grid">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`time-slot-card ${
                      selectedSlot?.startTime === slot.startTime ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="time-slot-content">
                      <span className="time-display">{formatTime(slot.startTime)}</span>
                      <span className="time-duration">to {formatTime(slot.endTime)}</span>
                    </div>
                    <div className="slot-indicator">
                      {selectedSlot?.startTime === slot.startTime ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <div className="slot-available-indicator"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {selectedSlot && selectedDate && (
          <div className="booking-summary-card">
            <div className="summary-content">
              <div className="selected-time-display">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <div className="time-range">
                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                  </div>
                  <div className="date-info">{formatDateForDisplay(selectedDate)}</div>
                </div>
              </div>
              <div className="service-summary">
                <div>
                  <strong>{service?.name}</strong>
                  <div className="summary-details">
                    <span>{service?.duration} min</span>
                    <span>•</span>
                    <span>{service?.price} Birr</span>
                  </div>
                </div>
                <button 
                  className="confirm-booking-btn"
                  onClick={handleBook}
                >
                  <span>Confirm Booking</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;