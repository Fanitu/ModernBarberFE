import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, barberAPI } from '../apiServece/apiService.jsx';
import DashboardLayout from '../layout/Dashboardlayout.jsx';
import BookingTable from '../common/BookingTable';
import './BarberDashboard.css'; // We'll create this CSS file

const BarberDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    confirmed: 0,
    revenue: 0,
    growth: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');
  const [activeTimeFilter, setActiveTimeFilter] = useState('today');

  useEffect(() => {
    loadDashboardData();
  }, [filter, activeTimeFilter]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (filter === 'today') {
        params.date = new Date().toISOString().split('T')[0];
      } else if (filter !== 'all') {
        params.status = filter;
      }

      const [bookingsRes, statsRes] = await Promise.all([
        bookingAPI.getBarberBookings(user.barberId || user._id, params),
        barberAPI.getBarberStats(user.barberId || user._id)
      ]);

      setBookings(bookingsRes.data.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, { status: newStatus });
      loadDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.today,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      color: "blue",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Pending Approval",
      value: stats.pending,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      color: "amber",
      change: "Requires Action",
      trend: "neutral"
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: "emerald",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.revenue),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: "violet",
      change: "+15%",
      trend: "up"
    }
  ];

  const navItems = [
    { id: 'today', label: 'Today', icon: 'calendar' },
    { id: 'pending', label: 'Pending', icon: 'alert-circle' },
    { id: 'confirmed', label: 'Confirmed', icon: 'check-circle' },
    { id: 'completed', label: 'Completed', icon: 'check' },
    { id: 'all', label: 'All Bookings', icon: 'list' }
  ];

  const timeFilters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout
      title="Barber Dashboard"
      user={user}
      onLogout={onLogout}
      navItems={navItems}
      activeNav={filter}
      onNavChange={setFilter}
      onRefresh={loadDashboardData}
    >
      <div className="barber-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="greeting">{getGreeting()}, {user?.name?.split(' ')[0] || 'Barber'}! 👋</h1>
            <p className="subtitle">Here's what's happening with your bookings today</p>
          </div>
          
         {/*  <div className="time-filter-section">
            <div className="filter-buttons">
              {timeFilters.map((timeFilter) => (
                <button
                  key={timeFilter.id}
                  className={`time-filter-btn ${activeTimeFilter === timeFilter.id ? 'active' : ''}`}
                  onClick={() => setActiveTimeFilter(timeFilter.id)}
                >
                  {timeFilter.label}
                </button>
              ))}
            </div>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-header">
                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="stat-trend">
                  {stat.trend === 'up' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                  )}
                  <span className={`trend-text ${stat.trend}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
              
              <div className="stat-progress">
                <div className={`progress-bar ${stat.color}`} style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div className="bookings-section">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">
                {filter === 'today' ? "Today's Schedule" : 
                 filter === 'all' ? 'All Bookings' : 
                 `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
              </h2>
              <p className="section-subtitle">
                {bookings.length} appointment{bookings.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="header-actions">
              <button 
                className="refresh-btn"
                onClick={loadDashboardData}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                Refresh
              </button>
              
              <button className="export-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p className="loading-text">Loading appointments...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="bookings-container">
              <BookingTable 
                bookings={bookings}
                onStatusUpdate={handleStatusUpdate}
                showActions={true}
                variant="compact"
              />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-illustration">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <h3 className="empty-title">No bookings found</h3>
              <p className="empty-description">
                {filter === 'today' ? 'You have no appointments scheduled for today. Enjoy your day!' : 
                 'No bookings match your current filter criteria.'}
              </p>
              <button 
                className="empty-action-btn"
                onClick={() => setFilter('all')}
              >
                View All Bookings
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats Bar */}
        <div className="quick-stats-bar">
          <div className="stat-item">
            <div className="stat-label">Avg. Rating</div>
            <div className="stat-value">4.8 ★</div>
          </div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-item">
            <div className="stat-label">Repeat Clients</div>
            <div className="stat-value">68%</div>
          </div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-item">
            <div className="stat-label">Busiest Time</div>
            <div className="stat-value">10 AM - 2 PM</div>
          </div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-item">
            <div className="stat-label">Available Slots</div>
            <div className="stat-value">12</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BarberDashboard;