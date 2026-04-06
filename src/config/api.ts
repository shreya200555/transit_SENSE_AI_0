// API Configuration for TransitSense Real Backend

export const API_CONFIG = {
  // RapidAPI for travel data
  RAPIDAPI: {
    BASE_URL: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
    HOST: 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
    KEY: import.meta.env.VITE_RAPIDAPI_KEY || '',
  },
  
  // Aviation Stack API for flights
  AVIATION_STACK: {
    BASE_URL: 'http://api.aviationstack.com/v1',
    KEY: import.meta.env.VITE_AVIATION_STACK_API_KEY || '',
  },
  
  // IRCTC (Indian Railways) API
  IRCTC: {
    BASE_URL: 'https://api.irctc.co.in',
    KEY: import.meta.env.VITE_IRCTC_API_KEY || '',
  },
  
  // OpenWeather API for weather data
  OPENWEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  },
  
  // Google Maps API
  GOOGLE_MAPS: {
    BASE_URL: 'https://maps.googleapis.com/maps/api',
    KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  },
  
  // Mapbox API
  MAPBOX: {
    BASE_URL: 'https://api.mapbox.com',
    TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  },
  
  // Supabase Configuration
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // Bus API (RedBus integration)
  BUS_API: {
    BASE_URL: 'https://api.bus.in',
    KEY: import.meta.env.VITE_BUS_API_KEY || '',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  FLIGHTS: {
    SEARCH: '/apiservices/browserapis/v2/FLY/BROWSE/2025/04/06',
    PLACES: '/apiservices/autosuggest/v1.0/UK/GBP/en-GB/',
    PRICING: '/apiservices/pricing/v1.0',
  },
  
  TRAINS: {
    SEARCH: '/api/v1/trains/search',
    SCHEDULE: '/api/v1/trains/schedule',
    STATIONS: '/api/v1/stations',
    LIVE_STATUS: '/api/v1/trains/live',
  },
  
  WEATHER: {
    CURRENT: '/weather',
    FORECAST: '/forecast',
    AIR_POLLUTION: '/air_pollution',
  },
  
  MAPS: {
    DISTANCE_MATRIX: '/distancematrix/json',
    GEOCODING: '/geocode/json',
    PLACES: '/place/nearbysearch/json',
  },
  
  BUSES: {
    SEARCH: '/api/v1/buses/search',
    ROUTES: '/api/v1/buses/routes',
    BOOKING: '/api/v1/buses/book',
  },
};

// Indian Cities with real coordinates
export const INDIAN_CITIES = {
  'Mumbai': { lat: 19.0760, lon: 72.8777, code: 'BOM', iata: 'BOM' },
  'Delhi': { lat: 28.7041, lon: 77.1025, code: 'DEL', iata: 'DEL' },
  'Bangalore': { lat: 12.9716, lon: 77.5946, code: 'BLR', iata: 'BLR' },
  'Kolkata': { lat: 22.5726, lon: 88.3639, code: 'CCU', iata: 'CCU' },
  'Chennai': { lat: 13.0827, lon: 80.2707, code: 'MAA', iata: 'MAA' },
  'Hyderabad': { lat: 17.3850, lon: 78.4867, code: 'HYD', iata: 'HYD' },
  'Pune': { lat: 18.5204, lon: 73.8567, code: 'PNQ', iata: 'PNQ' },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714, code: 'AMD', iata: 'AMD' },
  'Jaipur': { lat: 26.9124, lon: 75.7873, code: 'JAI', iata: 'JAI' },
  'Lucknow': { lat: 26.8467, lon: 80.9462, code: 'LKO', iata: 'LKO' },
  'Kanpur': { lat: 26.4499, lon: 80.3319, code: 'KNU', iata: 'KNU' },
  'Nagpur': { lat: 21.1458, lon: 79.0882, code: 'NAG', iata: 'NAG' },
  'Indore': { lat: 22.7196, lon: 75.8577, code: 'IDR', iata: 'IDR' },
  'Thane': { lat: 19.2183, lon: 72.9781, code: 'TNA', iata: 'TNA' },
  'Bhopal': { lat: 23.2599, lon: 77.4126, code: 'BHO', iata: 'BHO' },
  'Visakhapatnam': { lat: 17.6868, lon: 83.2185, code: 'VTZ', iata: 'VTZ' },
  'Pimpri-Chinchwad': { lat: 18.6298, lon: 73.7997, code: 'PNQ', iata: 'PNQ' },
  'Patna': { lat: 25.5941, lon: 85.1376, code: 'PAT', iata: 'PAT' },
  'Vadodara': { lat: 22.3072, lon: 73.1812, code: 'BDQ', iata: 'BDQ' },
  'Ghaziabad': { lat: 28.6692, lon: 77.4538, code: 'GZB', iata: 'GZB' },
  'Ludhiana': { lat: 30.9010, lon: 75.8573, code: 'LDH', iata: 'LUH' },
  'Agra': { lat: 27.1767, lon: 78.0081, code: 'AGR', iata: 'AGR' },
  'Nashik': { lat: 19.9975, lon: 73.7898, code: 'ISK', iata: 'ISK' },
  'Varanasi': { lat: 25.3176, lon: 82.9739, code: 'BSB', iata: 'VNS' },
  'Prayagraj': { lat: 25.4358, lon: 81.8463, code: 'PRY', iata: 'IXD' },
};

// Transport modes with real API support
export const TRANSPORT_MODES = {
  FLIGHT: 'flight',
  TRAIN: 'train',
  BUS: 'bus',
  CAR: 'car',
};

// API Rate limiting configuration
export const RATE_LIMITS = {
  RAPIDAPI: { requests: 100, window: '1min' },
  GOOGLE_MAPS: { requests: 100, window: '1min' },
  OPENWEATHER: { requests: 60, window: '1min' },
  IRCTC: { requests: 1000, window: '1day' },
};
