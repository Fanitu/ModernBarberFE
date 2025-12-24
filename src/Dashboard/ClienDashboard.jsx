import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, barberAPI } from '../apiServece/apiService';
import DashboardLayout from '../common/DashboardLayout';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  Calendar, 
  Clock, 
  Scissors, 
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Phone
} from 'lucide-react';

const ClientDashboard = ({user,onLogout}) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadClientBookings();
  }, [activeTab]);

  const loadClientBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      const allBookings = response.data.data || [];
      
      // Filter bookings based on active tab
      let filteredBookings = [];
      switch (activeTab) {
        case 'upcoming':
          filteredBookings = allBookings.filter(b => 
            ['pending', 'confirmed'].includes(b.status)
          );
          break;
        case 'past':
          filteredBookings = allBookings.filter(b => 
            ['completed', 'cancelled', 'no-show'].includes(b.status)
          );
          break;
        default:
          filteredBookings = allBookings;
      }
      
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(bookingId, { reason: 'Cancelled by client' });
        loadClientBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const navItems = [
    { id: 'upcoming', label: 'Upcoming', icon: 'calendar' },
    { id: 'past', label: 'Past Bookings', icon: 'list' },
    { id: 'all', label: 'All Bookings', icon: 'list' },
    { id: 'profile', label: 'My Profile', icon: 'user' }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout
      title="My Bookings"
      user={user}
      onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }}
      navItems={navItems}
      activeNav={activeTab}
      onNavChange={setActiveTab}
      onRefresh={loadClientBookings}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'upcoming' ? 'Upcoming Appointments' : 
               activeTab === 'past' ? 'Past Bookings' : 'All Bookings'}
            </h2>
            <p className="text-gray-600">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="text-gray-600 mt-2">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming appointments"
                  : "You don't have any past bookings"}
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {booking.barber?.user?.photo ? (
                            <img 
                              src={booking.barber.user.photo} 
                              alt={booking.barber.user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {booking.barber?.user?.name?.charAt(0) || 'B'}
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {booking.barber?.user?.name || 'Barber Name'}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Scissors className="h-3 w-3 mr-1" />
                                {booking.service?.name}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {booking.service?.duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-2">
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {new Date(booking.bookingDate || booking.bookingdate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <span className="font-medium">${booking.totalAmount}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.paymentStatus || 'pending'}
                          </span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">Note: {booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;