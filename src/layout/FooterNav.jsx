

const FooterNav = ({ activeView, onChangeView, onAccountClick }) => {
  return (
    <nav className="footer-nav">
      <button 
        className={`nav-btn ${activeView === 'home' ? 'active' : ''}`}
        onClick={() => onChangeView('home')}
      >
        🏠 Home
      </button>
      <button 
        className={`nav-btn ${activeView === 'barbers' ? 'active' : ''}`}
        onClick={() => onChangeView('barbers')}
      >
        💈 Barbers
      </button>
      <button 
        className="nav-btn"
        onClick={onAccountClick}
      >
        👤 My Account
      </button>
    </nav>
  );
};

export default FooterNav;