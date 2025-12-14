const Testimonials = () => {
  const testimonials = [
    {
      name: "Mikael Tesfaye",
      text: "Best haircut experience in Addis! They truly understand traditional styles.",
      role: "Regular Customer",
      imageClass: "testimonial-1"
    },
    {
      name: "Samuel Kebede",
      text: "The attention to detail is incredible. I always leave feeling like a king!",
      role: "Business Executive",
      imageClass: "testimonial-2"
    },
    {
      name: "Yohannes Girma",
      text: "Perfect blend of traditional Ethiopian and modern styles. Highly recommended!",
      role: "University Student",
      imageClass: "testimonial-3"
    },
    {
      name: "Tewodros Abebe",
      text: "Friendly service, professional cuts. This is my go-to barbershop.",
      role: "Local Artist",
      imageClass: "testimonial-4"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <h2 className="section-title">What Our Clients Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className={`testimonial-image ${testimonial.imageClass}`}></div>
            <div className="testimonial-content">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


export default Testimonials;