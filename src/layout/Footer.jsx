
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>HABESHA BARBERS</h3>
          <p>Traditional Ethiopian Haircare with Modern Excellence</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#why-choose">Why Choose Us</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📍 GOMO 1 Near Medhin Alem Church, Addis Ababa</p>
          <p>📞 +251 907268809</p>
          <p>✉️ info@habeshabarbers.com</p>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Telegram">✈️</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Habesha Barbers. All rights reserved.</p>
      </div>
    </footer>
  );
};


export default Footer;