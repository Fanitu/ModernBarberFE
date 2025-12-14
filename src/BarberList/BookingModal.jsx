import React, { useState } from 'react';
import { bookingAPI } from '../apiServece/apiService.jsx';

const BookingModal = ({ bookingData, onClose, onConfirm }) => {
  const [paymentUrl, setPaymentUrl] = useState('');

  const handleConfirm = async () => {
    try {
      const booking = {
        ...bookingData,
        paymentUrl,
        status: 'pending'
      };
      const response = await bookingAPI.create(booking);
      console.log(response);
      if(response.status === 201){
        onConfirm();
        console.log('Booking created successfully:', response.data);
      }
      
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Complete Your Booking</h3>
        <div className="form-group">
          <label>Payment Receipt URL</label>
          <input
            type="url"
            value={paymentUrl}
            onChange={(e) => setPaymentUrl(e.target.value)}
            placeholder="https://your-payment-receipt.com"
          />
        </div>
        <button className="modal-confirm-btn" onClick={handleConfirm}>
          Create Booking
        </button>
      </div>
    </div>
  );
};

export default BookingModal;