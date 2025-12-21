class AuthService {
  static normalizeUser(userData) {
    // If response has data property (from getMe endpoint)
    if (userData.data) {
      userData = userData.data;
    }

    // Ensure user has required fields
    const normalized = { ...userData };
    
    // Map id to _id if needed
    if (normalized.id && !normalized._id) {
      normalized._id = normalized.id;
    }
    
    // For barbers, ensure barberId exists
    if (normalized.role === 'barber' && !normalized.barberId && normalized._id) {
      normalized.barberId = normalized._id;
    }
    
    console.log('🔍 Normalized user:', normalized);
    return normalized;
  }

  static isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  static getUser() {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    try {
      const parsed = JSON.parse(user);
      return this.normalizeUser(parsed);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static login(userData, token) {
    const normalizedUser = this.normalizeUser(userData);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', token);
    console.log('✅ User saved to localStorage:', normalizedUser);
    return normalizedUser;
  }

  static logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('🚪 User logged out');
  }

  static updateUser(userData) {
    const normalizedUser = this.normalizeUser(userData);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  }

  static getRole() {
    const user = this.getUser();
    return user?.role || null;
  }

  static isAdmin() {
    return this.getRole() === 'admin';
  }

  static isBarber() {
    return this.getRole() === 'barber';
  }

  static isClient() {
    return this.getRole() === 'client';
  }

  static getBarberId() {
    const user = this.getUser();
    return user?.barberId || user?._id;
  }
}

export default AuthService;