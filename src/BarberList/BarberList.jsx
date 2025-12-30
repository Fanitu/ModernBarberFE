import React, { useState } from 'react';
import ServiceList from './serviceList.jsx';
import { getBarberImage } from '../../utils/barberImages.js'; 

const BarbersList = ({ barbers, onSelectBarber, onViewSchedule}) => {

  const [selectBarber, setSelectBarber] = useState(null);

  const handleViewSchedule = (barber) => {
    console.log(barber)
    setSelectBarber(barber);
  }; 
  

  return (
    <div className="barbers-list" id="barbersList">
      <h2 className="section-title">Our Professional Barbers</h2>
      {selectBarber ? (
       <ServiceList setSelectBarber={setSelectBarber} selectBarber={selectBarber} onSelectBarber={onSelectBarber}/>
      ) : (
        <div className="barbers-grid">
          {barbers.map((barber, index) => (
            <div key={index} className="barber-card">
              <div className="barber-image">
                  <img src={getBarberImage(barber.user.name)} alt={`${barber.user.name}-${barber.specialization}`} loading="lazy" onError={(e)=>{

                e.target.onerror = null;
                e.target.src=require('../assets/default.jpg')}}
                width="100%"
                height="85%"
                />
              </div>
              <div className="barber-info">
                <h3>{barber.user.name}</h3>
                <p>{barber.specialization}</p>
                <p>⭐ {barber.rating} • {barber.experience} years</p>
              </div>
              <button 
                className="view-schedule-btn"
                onClick={() => handleViewSchedule(barber)}
              >
                View Schedule
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default BarbersList;