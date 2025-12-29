import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      text: "With Experienced and Special Barbers we can Make whatever Style you want",
      buttonText: "Book Now",
      buttonAction: () => {
        document.getElementById('barbersList').scrollIntoView({ behavior: 'smooth' });
      },
      imageClass: "slide-1"
    },
    {
      text: "Better Check out What our client would Say by our Service",
      buttonText: "Check Testimonial",
      buttonAction: () => {
        document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' });
      },
      imageClass: "slide-2"
    },
    {
      text: "Precision Haircuts with Traditional Ethiopian Flair",
      buttonText: "View Styles",
       buttonAction: () => {
        document.getElementById('barbersList').scrollIntoView({ behavior: 'smooth' });
      },
      imageClass: "slide-3"
    },
    {
      text: "Walk in as a Customer, Walk out as Royalty",
      buttonText: "Our Services",
       buttonAction: () => {
        document.getElementById('barbersList').scrollIntoView({ behavior: 'smooth' });
      },
      imageClass: "slide-4"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`slide ${slide.imageClass} ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h2 className="slide-text">{slide.text}</h2>
            <button className="slide-btn" onClick={slide.buttonAction}>
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;