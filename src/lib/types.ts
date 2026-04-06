// Travel Search Types
export interface TravelSearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  transportMode: 'flight' | 'train' | 'bus' | 'car' | 'all';
  passengers?: number;
}

export interface RealTimeData {
  // Flight specific
  flightNumber?: string;
  gate?: string;
  terminal?: number;
  status?: string;
  delay?: number;
  
  // Train specific
  trainNumber?: string;
  trainName?: string;
  platform?: string;
  currentStation?: string;
  speed?: number;
  
  // Bus specific
  busNumber?: string;
  busType?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: string;
}

export interface TravelOption {
  id: string;
  provider: string;
  mode: 'flight' | 'train' | 'bus' | 'car';
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
  seats: number;
  crowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  amenities: string[];
  bookingUrl: string;
  realTimeData?: RealTimeData;
}

export interface DemandForecast {
  date: string;
  demandScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors?: {
    weather: string;
    weekend: boolean;
    festival: boolean;
    priceTrend: 'increasing' | 'stable' | 'decreasing';
  };
  recommendations?: string[];
  forecastSeries?: Array<{
    hour: number;
    demand: number;
  }>;
}

export interface CorridorRisk {
  id: string;
  origin: string;
  destination: string;
  transportMode: 'flight' | 'train' | 'bus';
  riskScore: number;
  demandLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  incidents: number;
  averageDelay: number;
  lastUpdated: string;
}

export interface FareAlert {
  id: string;
  route: string;
  currentFare: number;
  baseFare: number;
  fairPriceCeiling: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  recommendation: 'BOOK' | 'WAIT' | 'MONITOR';
  validUntil: string;
  historicalPrices?: number[];
}

export interface FestivalInfo {
  id: string;
  name: string;
  dates: string;
  affectedCities: string[];
  impactLevel: 'LOW' | 'MODERATE' | 'HIGH';
  description: string;
  travelAdvisory: string;
}

// Weather Types
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
  conditions: 'CLEAR' | 'CLOUDY' | 'RAIN' | 'STORM' | 'FOG' | 'SNOW';
  travelImpact: 'GOOD' | 'MODERATE' | 'POOR' | 'SEVERE';
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: any;
}

// Booking Types
export interface BookingRequest {
  travelOptionId: string;
  passengerInfo: {
    name: string;
    email: string;
    phone: string;
    age: number;
  };
  specialRequests?: string[];
}

export interface BookingConfirmation {
  id: string;
  pnr: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDetails: TravelOption;
  passengerInfo: any;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
}

// Notification Types
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  priceAlerts: boolean;
  delayAlerts: boolean;
  weatherAlerts: boolean;
}

export interface AlertSubscription {
  id: string;
  email: string;
  route: string;
  preferences: NotificationPreferences;
  createdAt: string;
  isActive: boolean;
}
