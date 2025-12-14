import React, { useState } from 'react';
import './BookingModal.css'; // Add styles for modal

const BookingModal = ({ 
  bookingData, 
  onClose, 
  onConfirm,
  barberName,
  serviceName,
  setCurrentView
}) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!bookingData) {
      setError('No booking data available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add note to booking data
      const completeBookingData = {
        ...bookingData,
        customerNote: note
      };

      await onConfirm(completeBookingData);
      
      // Show success message
      setSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setCurrentView('home');
      }, 3000);
      
    } catch (error) {
      console.error('Booking confirmation error:', error);
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal-content success-modal">
          <div className="success-icon">✓</div>
          <h3>Booking Confirmed!</h3>
          <p>Your appointment has been successfully scheduled.</p>
          <div className="booking-summary">
            <p><strong>Service:</strong> {serviceName}</p>
            <p><strong>Barber:</strong> {barberName}</p>
            <p><strong>Date:</strong> {bookingData?.bookingDate}</p>
            <p><strong>Time:</strong> {formatTime(bookingData?.startTime)}</p>
          </div>
          <p className="success-note">This message will close automatically...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Confirm Your Booking</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="booking-details">
            <h4>Booking Summary</h4>
            <div className="detail-row">
              <span className="detail-label">Barber:</span>
              <span className="detail-value">{barberName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Service:</span>
              <span className="detail-value">{serviceName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{bookingData?.bookingDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{formatTime(bookingData?.startTime)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">{bookingData?.service?.duration} minutes</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Price:</span>
              <span className="detail-value">{bookingData?.service?.price} Birr</span>
            </div>
          </div>

          <div className="booking-note">
            <label htmlFor="note">Add a note (optional):</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special requests or instructions..."
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="confirm-btn" 
              onClick={handleConfirm}
              disabled={loading || !bookingData}
            >
              {loading ? 'Processing...' : 'Create Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;