import React,{useState,useEffect} from "react";
import { bookingAPI,barberAPI } from "../apiServece/apiService.jsx"

const Availability = ({ barber, service, onBook }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (barber && service) {
      fetchAvailability();
    }
  }, [barber, service]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await barberAPI.getAvailability(
        barber._id,
        today,
        service.duration
      );
      console.log(response.data);
      console.log(response.data.data.availableTimes)
      setAvailableSlots(response.data.data.availableTimes || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    
    try {
      const validationData = {
        barberId: barber._id,
        date: new Date().toISOString().split('T')[0],
        startTime: selectedSlot.startTime,
        serviceDuration: service.duration
      };
      
      await barberAPI.validateAvailability(validationData);
      onBook(validationData);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="availability">
      <h3>Available Times for {service.name}</h3>
      {loading ? (
        <div className="loading">Loading available slots...</div>
      ) : (
        <div className="time-slots">
          {availableSlots.map((slot, index) => (
            <div 
              key={index}
              className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
              onClick={() => setSelectedSlot(slot)}
            >
              <span>{slot.startTime} - {slot.endTime}</span>
              <button 
                className="book-slot-btn"
                onClick={() => setSelectedSlot(slot)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedSlot && (
        <button className="confirm-booking-btn" onClick={handleBook}>
          Confirm Booking
        </button>
      )}
    </div>
  );
};

export default Availability;