import React from 'react'
import './ServiceList.css'

const ServiceList = ({ setSelectBarber, selectBarber, onSelectBarber }) => {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${minutes}m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB'
    }).format(price);
  };

  return (
    <div className="service-list-container">
      <div className="service-header">
        <button 
          className="back-to-barbers-btn"
          onClick={() => setSelectBarber(null)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Barbers
        </button>
        
        <div className="barber-profile-card">
          <div className="barber-avatar-large">
            <span>{selectBarber?.user?.name?.charAt(0) || 'B'}</span>
          </div>
          <div className="barber-profile-info">
            <h2>{selectBarber?.user?.name || 'Barber Name'}</h2>
            <div className="specialization-badge">
              {selectBarber?.specialization || 'Hair Stylist'}
            </div>
            <div className="barber-stats">
              <div className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span>{selectBarber?.rating || '5.0'}</span>
              </div>
              <div className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{selectBarber?.experience || '3'} years experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services-section">
        <div className="section-title-container">
          <h3 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
            </svg>
            Available Services
          </h3>
          <p className="section-subtitle">
            Choose a service to see available time slots
          </p>
        </div>

        {selectBarber?.services?.length === 0 ? (
          <div className="no-services-card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <h4>No Services Available</h4>
            <p>This barber doesn't have any services listed yet.</p>
          </div>
        ) : (
          <div className="services-grid">
            {selectBarber?.services?.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
                    </svg>
                  </div>
                  <div className="service-title-wrapper">
                    <h4 className="service-name">{service.name}</h4>
                    <div className="service-category">Premium Service</div>
                  </div>
                </div>
                
                <div className="service-details">
                  <p className="service-description">
                    Professional {service.name.toLowerCase()} service by {selectBarber?.user?.name}
                  </p>
                  
                  <div className="service-meta-grid">
                    <div className="meta-item">
                      <div className="meta-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Duration
                      </div>
                      <div className="meta-value">{formatTime(service.duration)}</div>
                    </div>
                    
                    <div className="meta-item">
                      <div className="meta-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        Price
                      </div>
                      <div className="meta-value">{formatPrice(service.price)}</div>
                    </div>
                    
                    <div className="meta-item">
                      <div className="meta-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        Availability
                      </div>
                      <div className="meta-value available">Available Today</div>
                    </div>
                  </div>
                </div>
                
                <div className="service-card-footer">
                  <button 
                    className="book-service-btn"
                    onClick={() => onSelectBarber(selectBarber, service)}
                  >
                    <span>Book This Service</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="booking-info-card">
        <div className="info-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="info-content">
          <h4>Booking Information</h4>
          <p>Select a service to see available time slots. You'll be able to choose your preferred date and time in the next step.</p>
        </div>
      </div>
    </div>
  )
}

export default ServiceList