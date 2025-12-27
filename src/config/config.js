// src/config.js
const config = {
  backendUrl: import.meta.env.BACKEND_URL || 'https://barbershop-production-7443.up.railway.app/',
  isDevelopment:import.meta.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Debug logging
console.log('📋 App Configuration:', {
  backendUrl: config.backendUrl,
  nodeEnv: process.env.NODE_ENV,
  allReactEnvVars: Object.keys(import.meta.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((obj, key) => {
      obj[key] = import.meta.env[key];
      return obj;
    }, {})
});

export default config;