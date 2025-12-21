import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  Calendar,
  List,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Check,
  RefreshCw
} from 'lucide-react';

const DashboardLayout = ({ 
  children, 
  title, 
  user, 
  onLogout, 
  navItems = [], 
  activeNav, 
  onNavChange,
  onRefresh
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const iconMap = {
    'home': Home,
    'calendar': Calendar,
    'list': List,
    'bar-chart-3': BarChart3,
    'users': Users,
    'dollar-sign': DollarSign,
    'alert-circle': AlertCircle,
    'check-circle': CheckCircle,
    'check': Check
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="sidebar-toggle mobile-only"
            >
              <Menu size={24} />
            </button>
            <div className="dashboard-brand">
              <div className="dashboard-logo">
                {title.charAt(0)}
              </div>
              <div>
                <h1 className="dashboard-title">{title}</h1>
                <p className="dashboard-subtitle">
                  Welcome back, <span className="user-highlight">{user?.name}</span>!
                </p>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button 
              onClick={onRefresh}
              className="action-btn"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
            <button className="action-btn notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-dropdown">
              <button className="user-btn">
                <div className="user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-role capitalize">{user?.role}</p>
                </div>
              </button>
              
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="dropdown-item signout"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Navigation</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="sidebar-close mobile-only"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon] || Home;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`nav-btn ${activeNav === item.id ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span className="nav-label">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="nav-badge">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <div className="earnings-card">
                <div className="earnings-header">
                  <span className="earnings-label">Today's Earnings</span>
                  <DollarSign size={16} className="earnings-icon" />
                </div>
                <p className="earnings-amount">$1,240</p>
                <p className="earnings-change">+12% from yesterday</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-content">
          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;