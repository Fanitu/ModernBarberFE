// App.jsx - Updated with AuthModal integration
import React, { useState, useEffect } from 'react';
import Header from './layout/Header.jsx';
import HeroSlider from './layout/HeroSlider.jsx';
import WhyChooseUs from './layout/WhyChooseus.jsx';
import Testimonials from './layout/Testimonial.jsx';
import ContactForm from './layout/ContractForm.jsx';
import BarbersList from './BarberList/BarberList.jsx';
import Availability from './BarberList/Availability.jsx';
import BookingModal from './BarberList/BookingModal.jsx';
import MyAccountSidebar from './BarberList/MyAccountSidebar.jsx';
import FooterNav from './layout/FooterNav.jsx';
import Footer from './layout/Footer.jsx';
import AuthModal from './authmodal/AuthModal.jsx';
import './index.css';
import { authAPI, barberAPI, bookingAPI } from './apiServece/apiService.jsx';

// Theme Context
const ThemeContext = React.createContext();

// Main App Component
const App = () => {
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home');
  const [showAccountSidebar, setShowAccountSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Fetch barbers data
    const fetchBarbers = async () => {
      try {
        const response = await barberAPI.getAll();
        setBarbers(response.data);
      } catch (error) {
        console.error('Error fetching barbers:', error);
      }
    };
    fetchBarbers();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleViewSchedule = (barber) => {
    setSelectedBarber(barber);
    setCurrentView('barber-detail');
  };

  const handleServiceSelect = (barber, service) => {
    setSelectedBarber(barber);
    setSelectedService(service);
    setCurrentView('availability');
  };

  const handleBookTime = async (data) => {
    // Check if user is authenticated before proceeding with booking
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Show auth modal in signup mode (you can show login mode too)
      setAuthMode('login');
      setShowAuthModal(true);
      // Store booking data to resume after authentication
      setBookingData(data);
      return;
    }
    
    // User is authenticated, proceed with booking
    setBookingData(data);
    setShowBookingModal(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    
    // If there's pending booking data, show booking modal
    if (bookingData) {
      setShowBookingModal(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowAccountSidebar(false);
  };

  const handleBookingConfirm = async () => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    try {
      await bookingAPI.create(bookingData);
      setShowBookingModal(false);
      setCurrentView('home');
      alert('Booking confirmed successfully!');
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired or invalid, show auth modal
        setAuthMode('login');
        setShowAuthModal(true);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    }
  };

  const translations = {
    english: {},
    amharic: {
      // Add Amharic translations here
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme} ${language}`}>
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onSignIn={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
          onSignUp={() => {
            setAuthMode('register');
            setShowAuthModal(true);
          }}
          onSignOut={handleSignOut}
        />

        <main className="main-content">
          {currentView === 'home' && (
            <>
              <HeroSlider />
              <WhyChooseUs />
              <Testimonials />
              <ContactForm />
            </>
          )}

          {currentView === 'barbers' && (
            <BarbersList 
              barbers={barbers}
              onSelectBarber={handleServiceSelect}
              onViewSchedule={handleViewSchedule}
            />
          )}

          {currentView === 'availability' && selectedBarber && selectedService && (
            <Availability 
              barber={selectedBarber}
              service={selectedService}
              onBook={handleBookTime}
            />
          )}
        </main>

        <Footer />

        <FooterNav 
          activeView={currentView}
          onChangeView={setCurrentView}
          onAccountClick={() => setShowAccountSidebar(true)}
          user={user}
        />

        <MyAccountSidebar 
          isOpen={showAccountSidebar}
          onClose={() => setShowAccountSidebar(false)}
          onLanguageChange={setLanguage}
          user={user}
          onSignOut={handleSignOut}
        />

        {showBookingModal && (
          <BookingModal 
            bookingData={bookingData}
            onClose={() => setShowBookingModal(false)}
            onConfirm={handleBookingConfirm}
          />
        )}

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setBookingData(null); // Clear pending booking data if modal closed
          }}
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;