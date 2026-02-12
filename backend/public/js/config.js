// API Configuration for Backend Public Files
// This file determines which backend URL to use based on the environment

// Render deployment URL - Your live Render backend
const RENDER_BACKEND_URL = 'https://your-render-app-name.onrender.com'; // Replace with your actual Render URL

// Local development URL
const LOCAL_BACKEND_URL = 'http://localhost:3000';

// Determine which URL to use
// Set this to 'production' when deploying to Render, or 'development' for local testing
const ENVIRONMENT = 'production'; // Use production mode for Render deployment

// Export the appropriate base URL
const API_BASE_URL = ENVIRONMENT === 'production' 
    ? RENDER_BACKEND_URL 
    : LOCAL_BACKEND_URL;

// Export configuration
window.API_CONFIG = {
    baseURL: API_BASE_URL,
    apiURL: `${API_BASE_URL}/api`,
    environment: ENVIRONMENT
};

console.log(`🌐 BACKEND config.js - Using ${ENVIRONMENT} environment`);
console.log(`🔗 Backend URL: ${API_BASE_URL}`);



