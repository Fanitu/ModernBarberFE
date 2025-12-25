import React, { useState, useEffect } from 'react';
import { 
  Home, 
  List, 
  BarChart3, 
  Users, 
  Calendar,
  User as UserIcon,
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ 
  title, 
  subtitle,
  user, 
  onLogout,
  navItems = [],
  activeNav = 'overview',
  onNavChange,
  onRefresh,
  children 
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Get icon component based on icon name
  const getIcon = (iconName) => {
    const iconProps = { className: "nav-link-icon", size: 18 };
    switch (iconName) {
      case 'home': return <Home {...iconProps} />;
      case 'list': return <List {...iconProps} />;
      case 'bar-chart-3': return <BarChart3 {...iconProps} />;
      case 'users': return <Users {...iconProps} />;
      case 'calendar': return <Calendar {...iconProps} />;
      case 'user': return <UserIcon {...iconProps} />;
      case 'bell': return <Bell {...iconProps} />;
      case 'settings': return <Settings {...iconProps} />;
      default: return <Home {...iconProps} />;
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  // Handle notification click
  const handleNotificationClick = () => {
    // Implement notification logic
    console.log('Notifications clicked');
  };

  // Handle user logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="dashboard-layout">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          {/* Brand Section */}
          <div className="nav-main">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="nav-brand">
              <svg 
                className="nav-logo-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="nav-brand-text">BarberShop Pro</span>
              <span className="nav-admin-badge">ADMIN</span>
            </div>

            {/* Navigation Links */}
            <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav-link ${activeNav === item.id ? 'nav-link-active' : ''}`}
                  onClick={() => {
                    onNavChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {getIcon(item.icon)}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="nav-actions">
            {/* Search (Desktop only) */}
            <div className="search-box desktop-only">
              <form onSubmit={handleSearch} className="search-form">
                <Search className="search-icon" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Notifications */}
            <button 
              className="nav-action-btn notification-btn"
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {/* Refresh */}
            <button 
              className="nav-action-btn"
              onClick={onRefresh}
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>

            {/* User Dropdown */}
            <div className="user-dropdown">
              <button 
                className="user-profile-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <div className="user-avatar">
                  {user?.photo ? (
                    <img 
                      src={user.photo} 
                      alt={user.name}
                      className="user-avatar-img"
                    />
                  ) : (
                    <div className="user-avatar-fallback">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                
                <div className="user-info">
                  <span className="user-name">
                    {user?.name || 'User'}
                  </span>
                  <span className="user-role">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </span>
                </div>
                
                <ChevronDown 
                  className={`dropdown-arrow ${isUserDropdownOpen ? 'rotate' : ''}`} 
                  size={16}
                />
              </button>

              {isUserDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item">
                    <UserIcon size={18} />
                    My Profile
                  </button>
                  <button className="dropdown-item">
                    <Settings size={18} />
                    Settings
                  </button>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">{title}</h1>
              {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
            </div>
            
            <div className="header-actions">
              {/* Search (Mobile only) */}
              <div className="search-box mobile-only">
                <form onSubmit={handleSearch} className="search-form">
                  <Search className="search-icon" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              
              <button className="primary-btn">
                <Calendar size={20} />
                Book Now
              </button>
            </div>
          </div>

          {/* Page Content */}
          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </main>

      {/* Close dropdown when clicking outside */}
      {isUserDropdownOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;