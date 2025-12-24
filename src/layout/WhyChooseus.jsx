const WhyChooseus = () => {
  const features = [
    {
      title: "Traditional Expertise",
      description: "Our barbers are trained in traditional Ethiopian hair styling techniques passed down through generations.",
      icon: "✂️"
    },
    {
      title: "Modern Equipment",
      description: "We use state-of-the-art tools and hygiene standards for your comfort and safety.",
      icon: "💈"
    },
    {
      title: "Personalized Service",
      description: "Every haircut is customized to match your personality and style preferences.",
      icon: "👤"
    },
    {
      title: "Community Focused",
      description: "We're more than a barbershop - we're a community gathering space.",
      icon: "🤝"
    }
  ];

  return (
    <section className="why-choose-us" id="why-choose">
      <h2 className="section-title">Why Choose Habesha Barbers</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseus;