import axios from 'axios';

const apiService = axios.create({
  baseURL: `${process.env.Backend_ur}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - FIXED
apiService.interceptors.response.use(
  (response) => {
    // Return the full response including data
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      // Only redirect if it's not a booking validation request
    /*   if (!error.config?.url?.includes('/availability/validate')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      } */ 
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => apiService.post('/auth/login', data),
  register: (data) => apiService.post('/auth/register', data),
  getProfile: () => apiService.get('/auth/me'),
  updateProfile: (data) => apiService.put('/auth/profile', data),
};

// Barber API
export const barberAPI = {
  getAll: () => apiService.get('/barbers'),
  getById: (id) => apiService.get(`/barbers/${id}`),
  getAvailability: (barberId, date, serviceDuration) => 
    apiService.get(`/availability/barber/${barberId}?date=${date}&serviceDuration=${serviceDuration}`),
  validateAvailability: (data) => apiService.post('/availability/validate', data),
  getBarberStats: (barberId) => apiService.get(`/barbers/${barberId}/stats`),
  updateBarberProfile: (barberId, data) => apiService.patch(`/barbers/${barberId}`, data),
};

// Booking API - UPDATED with proper error handling
export const bookingAPI = {
  create: (data) => {
    console.log('📦 Sending booking data:', data);
    return apiService.post('/bookings', data);
  },
  getUserBookings: () => apiService.get('/bookings/my-bookings'),
  getBarberBookings: (barberId, params) => 
    apiService.get(`/bookings/barber/${barberId}`, { params }),
  updateStatus: (bookingId, data) => apiService.put(`/bookings/${bookingId}/status`, data),
  cancelBooking: (bookingId, data) => apiService.put(`/bookings/${bookingId}/cancel`, data),
  getAllBookings: (params) => apiService.get('/bookings/all', { params }),
  getBookingStats: (params) => apiService.get('/bookings/stats', { params }),
  getDailyStats: () => apiService.get('/bookings/stats/daily'),
  getWeeklyStats: () => apiService.get('/bookings/stats/weekly'),
  getMonthlyStats: () => apiService.get('/bookings/stats/monthly'),
};

// Admin API
// In your ApiService.js, update the adminAPI section:

// Admin API
export const adminAPI = {
  getDashboardStats: () => apiService.get('/admin/dashboard'),
  getAllUsers: (params) => apiService.get('/admin/users', { params }),
  updateUserRole: (userId, data) => apiService.put(`/admin/users/${userId}/role`, data),
  getRevenueStats: (params) => apiService.get('/admin/revenue', { params }),
  
  // New methods for specific revenue periods
  getDailyRevenue: () => apiService.get('/admin/revenue?period=daily'),
  getWeeklyRevenue: () => apiService.get('/admin/revenue?period=weekly'),
  getMonthlyRevenue: () => apiService.get('/admin/revenue?period=monthly'),
  
  // Method to get barber performance stats
  getBarberPerformance: () => apiService.get('/admin/revenue?includeBarbers=true'),
  
  // Method to get revenue comparison
  getRevenueComparison: (startDate, endDate) => 
    apiService.get(`/admin/revenue/compare?start=${startDate}&end=${endDate}`)
};

export default apiService;