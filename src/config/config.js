// src/config.js
const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'barbershop-production-7443.up.railway.app',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Debug logging
console.log('📋 App Configuration:', {
  backendUrl: config.backendUrl,
  nodeEnv: process.env.NODE_ENV,
  allReactEnvVars: Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((obj, key) => {
      obj[key] = process.env[key];
      return obj;
    }, {})
});

export default config;