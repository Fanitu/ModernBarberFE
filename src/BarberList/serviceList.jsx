 
 import React from 'react'
 
 const serviceList = ({setSelectBarber,selectBarber,onSelectBarber}) => {
   return (
    <div className="selected-barber">
          <button 
            className="back-btn"
            onClick={() => setSelectBarber(null)}
          >
            ← Back to All Barbers
          </button>
          <div className="barber-detail">
            <div className="barber-detail-image"></div>
            <div className="barber-detail-info">
              <h3>{selectBarber.user.name}</h3>
              <p>{selectBarber.specialization}</p>
              <div className="services-list">
                {selectBarber.services?.map((service, index) => {
                  return <div key={index} className="service-item">
                    <strong><span>{service.name}</span></strong>-----
                    <strong><span>{service.duration} min</span></strong>---
                    <strong><span>{service.price} Birr</span></strong>                    
                    <button 
                      className="book-service-btn"
                      onClick={() => onSelectBarber(selectBarber, service)}
                    >
                      View Service times
                    </button>
                  </div>
})}
              </div>
            </div>
          </div>
        </div>

     
   )
 }

export default serviceList;