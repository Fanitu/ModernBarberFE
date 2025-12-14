import axios from 'axios';


// API Service
const apiService = axios.create({
  baseURL: 'http://localhost:5000/api',
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
    return Promise.reject(error);
  }
);

// Response interceptor
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  login: (data) => apiService.post('/auth/login', data),
  register: (data) => apiService.post('/auth/register', data),
};

export const barberAPI = {
  getAll: () => apiService.get('/barbers'),
  getAvailability: (barberId, date, serviceDuration) => 
    apiService.get(`/availability/barber/${barberId}?date=${date}&serviceDuration=${serviceDuration}`),
  validateAvailability: (data) => apiService.post('/availability/validate', data),
};

export const bookingAPI = {
  create: (data) => apiService.post('/bookings', data),
  getUserBookings: () => apiService.get('/bookings/my-bookings'),
};