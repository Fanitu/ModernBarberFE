import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './Header';
import HeroSlider from './HeroSlider';
import WhyChooseUs from './WhyChooseus';
import Footer from './Footer'
import Testimonials from './Testimonial';
import ContactForm from './ContractForm';
import BarbersList from '../BarberList/BarberList';
import Availability from '../BarberList/Availability';
import BookingModal from '../BarberList/BookingModal';
import AuthModal from '../authmodal/AuthModal';
import { barberAPI } from '../apiServece/apiService';

// UPDATE: Add props here
const PublicLayout = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await barberAPI.getAll();
      setBarbers(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  };

  const handleServiceSelect = (barber, service) => {
    setSelectedBarber(barber);
    setSelectedService(service);
    setCurrentView('availability');
  };

  const handleBookTime = (data) => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      setBookingData(data);
      return;
    }
    setBookingData(data);
    setShowBookingModal(true);
  };

  const handleAuthSuccess = (userData, token) => {
    // Call onLogin from props
    onLogin(userData, token);
    
   
    
    // If there's pending booking data, show booking modal
    if (bookingData) {
      setShowBookingModal(true);
    }
  };

  // If user is logged in and not a client, redirect to dashboard
  // REMOVE: Don't use Navigate here, let the router handle it
  if (user && user.role !== 'client') {
    return null; // Let the router redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* UPDATE: Pass onLogout to Header */}
      <Header 
        onSignIn={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }} 
        onSignUp={() => {
          setAuthMode('register');
          setShowAuthModal(true);
        }} 
        user={user}
        onSignOut={onLogout}
      />
      
      <main className="pb-20">
        <Routes>
          <Route path="/" element={
            currentView === 'home' ? (
              <>
                <HeroSlider />
                <WhyChooseUs />
                <BarbersList 
                  barbers={barbers}
                  onSelectBarber={handleServiceSelect}
                />
                <Testimonials />
                <ContactForm />
                <Footer/>
              </>
            ) : currentView === 'availability' && selectedBarber && selectedService ? (
              <Availability 
                barber={selectedBarber}
                service={selectedService}
                onBook={handleBookTime}
                onBack={() => setCurrentView('home')}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </main>

      {showBookingModal && bookingData && (
        <BookingModal
          bookingData={bookingData}
          onClose={() => {
            setShowBookingModal(false);
            setBookingData(null);
          }}
          onConfirm={() => {
            // Handle booking confirmation
            setShowBookingModal(false);
          }}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={()=>{
          setShowAuthModal(false)
        }} 
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
};

export default PublicLayout;