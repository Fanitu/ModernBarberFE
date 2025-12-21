import React, { useState } from 'react';
import { bookingAPI } from '../apiServece/apiService.jsx';
import './BookingModal.css';

const BookingModal = ({ 
  bookingData, 
  onClose, 
  onSuccess,
  barberName,
  serviceName
}) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  // Format data to match backend requirements
  const formatBookingData = () => {
    if (!bookingData) return null;

    return {
      barberId: bookingData.barberId,
      bookingdate: bookingData.bookingDate || bookingData.date, // Handle both formats
      startTime: bookingData.startTime,
      service: {
        name: bookingData.service?.name || serviceName,
        duration: bookingData.service?.duration,
        price: bookingData.service?.price,
        serviceId: bookingData.service?.serviceId || bookingData.service?.id
      },
      customerNote: note.trim() || undefined,
      // Add any other required fields based on your backend
    };
  };

  const handleConfirm = async () => {
    const formattedData = formatBookingData();
    
    if (!formattedData) {
      setError('Invalid booking data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Creating booking with data:', formattedData);
      
      const response = await bookingAPI.create(formattedData);
      console.log('✅ Booking created successfully:', response.data);
      
      // Store booking details for success display
      setBookingDetails({
        bookingId: response.data.data?._id || response.data.bookingId,
        bookingDate: formattedData.date,
        startTime: formattedData.startTime,
        barberName: barberName,
        serviceName: serviceName,
        servicePrice: formattedData.service?.price,
        referenceNumber: `BOOK-${Date.now().toString().slice(-8)}`
      });
      
      // Show success state
      setSuccess(true);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 5000);
      
    } catch (error) {
      console.error('❌ Booking creation failed:', error);
      
      let errorMessage = 'Failed to create booking. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Success View
  if (success && bookingDetails) {
    return (
      <div className="modal-overlay">
        <div className="modal-content success-modal">
          <div className="success-animation">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          
          <div className="success-header">
            <h3>Booking Confirmed! 🎉</h3>
            <p className="success-subtitle">Your appointment has been successfully scheduled</p>
          </div>
          
          <div className="booking-summary-card">
            <div className="summary-header">
              <h4>Booking Details</h4>
              <span className="booking-id">Ref: {bookingDetails.referenceNumber}</span>
            </div>
            
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Service:</span>
                <span className="summary-value">{bookingDetails.serviceName}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Barber:</span>
                <span className="summary-value">{bookingDetails.barberName}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Date:</span>
                <span className="summary-value">{formatDate(bookingDetails.bookingDate)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Time:</span>
                <span className="summary-value">{formatTime(bookingDetails.startTime)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Amount:</span>
                <span className="summary-value price">
                  {bookingDetails.servicePrice ? `$${bookingDetails.servicePrice}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="success-actions">
            <p className="success-note">
              A confirmation has been sent to your email. 
              This modal will close in 5 seconds...
            </p>
            <button 
              className="close-success-btn"
              onClick={() => {
                onClose();
                if (onSuccess) onSuccess();
              }}
            >
              Close Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Booking Form View
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirm Your Booking</h3>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="booking-details-card">
            <h4>Booking Summary</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Barber:</span>
                <span className="detail-value">{barberName}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Service:</span>
                <span className="detail-value">{serviceName}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(bookingData?.bookingDate)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{formatTime(bookingData?.startTime)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{bookingData?.service?.duration || 0} minutes</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value price">
                  ${bookingData?.service?.price || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="booking-note-section">
            <label htmlFor="note" className="note-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Add a note (optional):
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special requests, instructions, or notes for the barber..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleConfirm}
              disabled={loading || !bookingData}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                'Create Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;