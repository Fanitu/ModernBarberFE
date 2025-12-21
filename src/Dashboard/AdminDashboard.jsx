import React, { useState, useEffect } from 'react';
import { adminAPI, bookingAPI } from '../apiServece/apiService.jsx';
import DashboardLayout from '../layout/Dashboardlayout.jsx';
import StatsCards from '../common/StatsCards.jsx';
import AnalyticsChart from '../common/AnalyticsChart.jsx';
import BookingTable from '../common/BookingTable.jsx';
import './admin.css'
import { 
  Users, 
  Scissors, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  Filter,
  Calendar,
  TrendingDown,
  PieChart
} from 'lucide-react';

// Add this UserTable component
const UserTable = ({ users, onRoleUpdate }) => {
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, { role: newRole });
      if (onRoleUpdate) onRoleUpdate();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'barber':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role || 'client'}
                    onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)} border-0 focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="client">Client</option>
                    <option value="barber">Barber</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                    {user.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => console.log('Edit user:', user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to ${user.status === 'active' ? 'suspend' : 'activate'} this user?`)) {
                        // Add suspend/activate functionality here
                      }
                    }}
                    className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = ({user, onLogout}) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeBarbers: 0,
    activeClients: 0,
    todayBookings: 0,
    pendingBookings: 0,
    revenueGrowth: 0,
    bookingGrowth: 0
  });
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('daily');
  const [users,setUsers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab, timeframe, revenuePeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const [dashboardRes, bookingsRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          bookingAPI.getAllBookings({ date: new Date().toISOString().split('T')[0] })
        ]);
        setStats(dashboardRes.data.data);
        setBookings(bookingsRes.data.data || []);
      } 
      else if (activeTab === 'analytics') {
        let statsRes;
        switch (timeframe) {
          case 'daily':
            statsRes = await bookingAPI.getDailyStats();
            break;
          case 'weekly':
            statsRes = await bookingAPI.getWeeklyStats();
            break;
          default:
            statsRes = await bookingAPI.getMonthlyStats();
        }
        setAnalytics(statsRes.data || []);
        //analytics endpoint for future with all the needed endpoints
      }
      else if (activeTab === 'revenue') {
        try {
          const revenueRes = await adminAPI.getRevenueStats({ period: revenuePeriod });
          console.log(revenueRes.data)
          setRevenueData(revenueRes.data.revenueStats || []);
        } catch (error) {
          console.error('Error loading revenue data:', error);
          // Generate sample revenue data if API fails
          setRevenueData(generateSampleRevenueData(revenuePeriod));
        }
      }
      else if (activeTab === 'bookings') {
        const bookingsRes = await bookingAPI.getAllBookings({});
        setBookings(bookingsRes.data.data || []);
      }else if (activeTab === 'users'){
        const userRes = await adminAPI.getAllUsers();
        console.log('User Data',userRes.data)
        setUsers(userRes.data.data);
      }
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

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <Scissors className="h-6 w-6" />,
      color: "indigo",
      change: `${stats.bookingGrowth}%`,
      trend: stats.bookingGrowth >= 0 ? 'up' : 'down'
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: "green",
      change: `${stats.revenueGrowth}%`,
      trend: stats.revenueGrowth >= 0 ? 'up' : 'down'
    },
    {
      title: "Active Barbers",
      value: stats.activeBarbers,
      icon: <Users className="h-6 w-6" />,
      color: "blue",
      change: "+2",
      trend: 'up'
    },
    {
      title: "Today's Orders",
      value: stats.todayBookings,
      icon: <BarChart3 className="h-6 w-6" />,
      color: "purple"
    }
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'bookings', label: 'All Bookings', icon: 'list' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
    { id: 'users', label: 'Users', icon: 'users' }
  ];

  // Revenue summary statistics
  const revenueStats = {
    totalRevenue: revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0),
    averageRevenue: revenueData.length > 0 
      ? revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0) / revenueData.length 
      : 0,
    peakRevenue: Math.max(...revenueData.map(item => item.revenue || 0)),
    totalBookings: revenueData.reduce((sum, item) => sum + (item.bookings || 0), 0)
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      user={user}
      onLogout={onLogout}
      navItems={navItems}
      activeNav={activeTab}
      onNavChange={setActiveTab}
      onRefresh={loadDashboardData}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <StatsCards stats={statCards} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Bookings</h3>
                  {bookings.length > 0 ? (
                    <BookingTable 
                      bookings={bookings.slice(0, 5)}
                      onStatusUpdate={handleStatusUpdate}
                      showActions={true}
                    />
                  ) : (
                    <p className="text-gray-600 text-center py-8">No bookings today</p>
                  )}
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Booking Trends</h3>
                    <select 
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <AnalyticsChart data={analytics} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="chart-container">
                <div className="chart-header">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Booking Analytics</h2>
                      <p className="text-gray-600">Detailed analysis of all bookings</p>
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => setTimeframe('daily')}
                        className={`px-4 py-2 rounded-lg ${timeframe === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                      >
                        Daily
                      </button>
                      <button 
                        onClick={() => setTimeframe('weekly')}
                        className={`px-4 py-2 rounded-lg ${timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                      >
                        Weekly
                      </button>
                      <button 
                        onClick={() => setTimeframe('monthly')}
                        className={`px-4 py-2 rounded-lg ${timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                </div>
                
                <AnalyticsChart 
                  data={analytics} 
                  type={timeframe === 'monthly' ? 'bar' : 'line'}
                  detailed={true}
                  title={`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Trends`}
                />
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
                  <p className="text-gray-600">Total: {bookings.length} bookings</p>
                </div>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Filter className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={loadDashboardData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              <BookingTable 
                bookings={bookings}
                onStatusUpdate={handleStatusUpdate}
                showActions={true}
                paginated={true}
              />
            </div>
          )}

         {activeTab === 'users' && (
  <div className="space-y-6 fade-in">
    <div className="users-table-container">
      <div className="users-table-header">
        <div>
          <h2 className="users-table-title">User Management</h2>
          <p className="users-table-subtitle">Manage all system users ({users.length} total)</p>
        </div>
        <div className="users-table-controls">
          <button className="small-btn">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
          <button className="primary-btn">
            <Users className="h-5 w-5 mr-2" />
            Add New User
          </button>
          <button 
            onClick={loadDashboardData}
            className="small-btn"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {/* User stats summary */}
      <div className="p-6">
        <div className="users-stats-grid">
          <div className="user-stat-card user-stat-total">
            <div className="user-stat-icon">
              <Users className="h-5 w-5" />
            </div>
            <div className="user-stat-value">{users.length}</div>
            <div className="user-stat-label">Total Users</div>
          </div>
          <div className="user-stat-card user-stat-active">
            <div className="user-stat-icon">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="user-stat-value">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="user-stat-label">Active Users</div>
          </div>
          <div className="user-stat-card user-stat-barber">
            <div className="user-stat-icon">
              <Scissors className="h-5 w-5" />
            </div>
            <div className="user-stat-value">
              {users.filter(u => u.role === 'barber').length}
            </div>
            <div className="user-stat-label">Barbers</div>
          </div>
          <div className="user-stat-card user-stat-admin">
            <div className="user-stat-icon">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="user-stat-value">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="user-stat-label">Admins</div>
          </div>
        </div>
      </div>
      
      {/* User table */}
      <div className="overflow-x-auto">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id || user.id || index}>
                  <td>
                    <div className="user-avatar-cell">
                      <div className={`user-table-avatar ${!user.name ? 'user-avatar-fallback' : ''}`}>
                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name || 'N/A'}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                    {user.address && (
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {user.address}
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      value={user.role || 'client'}
                      onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                      className={`role-badge role-${user.role || 'client'}`}
                      style={{ appearance: 'none', padding: '6px 12px', cursor: 'pointer' }}
                    >
                      <option value="client" className="role-client">Client</option>
                      <option value="barber" className="role-barber">Barber</option>
                      <option value="admin" className="role-admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge status-${user.status?.toLowerCase() || 'active'}`}>
                      {user.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        onClick={() => console.log('Edit user:', user)}
                        className="action-btn action-edit"
                        title="Edit User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to ${user.status === 'active' ? 'suspend' : 'activate'} ${user.name || 'this user'}?`)) {
                            // Add suspend/activate functionality here
                          }
                        }}
                        className={`action-btn ${user.status === 'active' ? 'action-suspend' : 'action-activate'}`}
                        title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                      >
                        {user.status === 'active' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="users-empty-state">
                    <Users className="users-empty-icon" />
                    <h3>No Users Found</h3>
                    <p>There are no users in the system yet. Add your first user to get started.</p>
                    <button className="primary-btn mt-4">
                      <Users className="h-5 w-5 mr-2" />
                      Add First User
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (if needed) */}
      {users.length > 0 && (
        <div className="users-pagination">
          <div className="pagination-info">
            Showing {Math.min(10, users.length)} of {users.length} users
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              ← Previous
            </button>
            <div className="pagination-pages">
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
            </div>
            <button className="pagination-btn">
              Next →
            </button>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="quick-actions-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-btn quick-action-export">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Users CSV
          </button>
          <button className="quick-action-btn quick-action-email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Send Bulk Email
          </button>
          <button className="quick-action-btn quick-action-delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete Inactive Users
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        </>
      )}
    </DashboardLayout>
  );
};

// Helper function to generate sample revenue data
const generateSampleRevenueData = (period) => {
  const labels = {
    daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  };

  const data = labels[period] || labels.monthly;
  
  return data.map((label, index) => ({
    name: label,
    revenue: Math.floor(Math.random() * 10000) + 5000,
    bookings: Math.floor(Math.random() * 50) + 20,
    profit: Math.floor(Math.random() * 4000) + 2000
  }));
};

export default AdminDashboard;