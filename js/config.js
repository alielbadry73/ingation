// API Configuration
// This file determines which backend URL to use based on the environment

// Local development URL only
const LOCAL_BACKEND_URL = 'http://localhost:3000';

// Always use local development
const ENVIRONMENT = 'development';

// Export the appropriate base URL
const API_BASE_URL = LOCAL_BACKEND_URL;

// Export configuration
window.API_CONFIG = {
    baseURL: API_BASE_URL,
    apiURL: `${API_BASE_URL}/api`,
    environment: ENVIRONMENT
};

console.log(`🌐 API Configuration: Using ${ENVIRONMENT} environment`);
console.log(`🔗 Backend URL: ${API_BASE_URL}`);



