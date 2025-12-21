// Header.jsx - Updated with user display
import React from 'react';

const Header = ({ toggleTheme, theme, onSignIn, onSignUp, user, onSignOut }) => {
  return (
    <header className={`header ${theme}`}>
      <div className="header-container">
        <div className="logo">
          <h1>HABESHA BARBERS</h1>
        </div>
        
        <div className="theme-toggle">
          {/* <button 
            onClick={toggleTheme}
            className="theme-btn"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button> */}
        </div>
        
        <div className="auth-buttons">
          {user ? (
            <>
              <span className="user-name">Hello, {user.name}</span>
              <button className="btn-signout" onClick={onSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="btn-signin" onClick={onSignIn}>
                Sign In
              </button>
              <button className="btn-signup" onClick={onSignUp}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;