import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS, INDIAN_CITIES } from '@/config/api';

// Weather conditions for travel
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

// Real Weather API Service (OpenWeatherMap)
class WeatherAPIService {
  private weatherApi: AxiosInstance;

  constructor() {
    // OpenWeatherMap API Client
    this.weatherApi = axios.create({
      baseURL: API_CONFIG.OPENWEATHER.BASE_URL,
      params: {
        appid: API_CONFIG.OPENWEATHER.KEY,
        units: 'metric', // Celsius
      },
    });
  }

  // Get current weather for a city
  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const cityData = INDIAN_CITIES[city as keyof typeof INDIAN_CITIES];
      if (!cityData) {
        throw new Error('City not found');
      }

      const response = await this.weatherApi.get(API_ENDPOINTS.WEATHER.CURRENT, {
        params: {
          lat: cityData.lat,
          lon: cityData.lon,
        },
      });

      return this.processWeatherData(response.data);

    } catch (error) {
      console.error('Current weather error:', error);
      // Fallback to realistic mock data
      return this.getFallbackWeatherData(city);
    }
  }

  // Get weather forecast for a city
  async getWeatherForecast(city: string, days: number = 5): Promise<WeatherData[]> {
    try {
      const cityData = INDIAN_CITIES[city as keyof typeof INDIAN_CITIES];
      if (!cityData) {
        throw new Error('City not found');
      }

      const response = await this.weatherApi.get(API_ENDPOINTS.WEATHER.FORECAST, {
        params: {
          lat: cityData.lat,
          lon: cityData.lon,
          cnt: days * 8, // 8 forecasts per day (3-hour intervals)
        },
      });

      return this.processForecastData(response.data);

    } catch (error) {
      console.error('Weather forecast error:', error);
      // Fallback to mock forecast data
      return this.getFallbackForecastData(city, days);
    }
  }

  // Get weather along a route (origin to destination)
  async getRouteWeather(origin: string, destination: string): Promise<{
    origin: WeatherData;
    destination: WeatherData;
    routeConditions: 'GOOD' | 'MODERATE' | 'POOR' | 'SEVERE';
    recommendations: string[];
  }> {
    try {
      const [originWeather, destWeather] = await Promise.all([
        this.getCurrentWeather(origin),
        this.getCurrentWeather(destination)
      ]);

      // Determine route conditions based on both cities
      const routeConditions = this.determineRouteConditions(originWeather, destWeather);
      const recommendations = this.getTravelRecommendations(originWeather, destWeather, routeConditions);

      return {
        origin: originWeather,
        destination: destWeather,
        routeConditions,
        recommendations
      };

    } catch (error) {
      console.error('Route weather error:', error);
      throw error;
    }
  }

  // Get air pollution data
  async getAirPollution(city: string): Promise<any> {
    try {
      const cityData = INDIAN_CITIES[city as keyof typeof INDIAN_CITIES];
      if (!cityData) {
        throw new Error('City not found');
      }

      const response = await this.weatherApi.get(API_ENDPOINTS.WEATHER.AIR_POLLUTION, {
        params: {
          lat: cityData.lat,
          lon: cityData.lon,
        },
      });

      return response.data;

    } catch (error) {
      console.error('Air pollution error:', error);
      throw error;
    }
  }

  // Process weather data from API response
  private processWeatherData(data: any): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility / 1000, // Convert to km
      pressure: data.main.pressure,
      conditions: this.mapWeatherConditions(data.weather[0].main),
      travelImpact: this.determineTravelImpact(data.weather[0].main, data.wind.speed, data.visibility),
    };
  }

  // Process forecast data
  private processForecastData(data: any): WeatherData[] {
    const forecasts: WeatherData[] = [];
    
    // Get daily forecasts (one per day, at noon)
    const dailyForecasts = data.list.filter((item: any) => 
      new Date(item.dt * 1000).getHours() === 12
    ).slice(0, 5);

    dailyForecasts.forEach((item: any) => {
      forecasts.push(this.processWeatherData(item));
    });

    return forecasts;
  }

  // Map weather conditions
  private mapWeatherConditions(main: string): 'CLEAR' | 'CLOUDY' | 'RAIN' | 'STORM' | 'FOG' | 'SNOW' {
    switch (main.toLowerCase()) {
      case 'clear':
        return 'CLEAR';
      case 'clouds':
        return 'CLOUDY';
      case 'rain':
      case 'drizzle':
        return 'RAIN';
      case 'thunderstorm':
        return 'STORM';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'FOG';
      case 'snow':
        return 'SNOW';
      default:
        return 'CLEAR';
    }
  }

  // Determine travel impact based on weather
  private determineTravelImpact(weather: string, windSpeed: number, visibility: number): 'GOOD' | 'MODERATE' | 'POOR' | 'SEVERE' {
    if (weather === 'thunderstorm' || weather === 'snow' || visibility < 1) {
      return 'SEVERE';
    }
    if (weather === 'rain' || windSpeed > 10 || visibility < 3) {
      return 'POOR';
    }
    if (weather === 'clouds' || windSpeed > 5 || visibility < 5) {
      return 'MODERATE';
    }
    return 'GOOD';
  }

  // Determine route conditions
  private determineRouteConditions(origin: WeatherData, destination: WeatherData): 'GOOD' | 'MODERATE' | 'POOR' | 'SEVERE' {
    const impacts = [origin.travelImpact, destination.travelImpact];
    
    if (impacts.includes('SEVERE')) return 'SEVERE';
    if (impacts.includes('POOR')) return 'POOR';
    if (impacts.includes('MODERATE')) return 'MODERATE';
    return 'GOOD';
  }

  // Get travel recommendations based on weather
  private getTravelRecommendations(origin: WeatherData, destination: WeatherData, routeConditions: string): string[] {
    const recommendations: string[] = [];

    if (routeConditions === 'SEVERE') {
      recommendations.push('Consider postponing travel due to severe weather conditions');
      recommendations.push('If travel is essential, allow extra time and drive carefully');
    } else if (routeConditions === 'POOR') {
      recommendations.push('Weather conditions may cause delays');
      recommendations.push('Check for updates before departure');
    } else if (routeConditions === 'MODERATE') {
      recommendations.push('Weather conditions are acceptable for travel');
      recommendations.push('Monitor weather updates during journey');
    } else {
      recommendations.push('Weather conditions are favorable for travel');
    }

    // Specific recommendations based on conditions
    if (origin.conditions === 'RAIN' || destination.conditions === 'RAIN') {
      recommendations.push('Carry umbrella and rain gear');
      recommendations.push('Expect possible delays due to rain');
    }

    if (origin.conditions === 'FOG' || destination.conditions === 'FOG') {
      recommendations.push('Drive slowly in foggy conditions');
      recommendations.push('Use fog lights if available');
    }

    if (origin.temperature > 35 || destination.temperature > 35) {
      recommendations.push('Stay hydrated during hot weather');
      recommendations.push('Plan rest stops during long journeys');
    }

    if (origin.temperature < 10 || destination.temperature < 10) {
      recommendations.push('Carry warm clothing for cold weather');
    }

    return recommendations;
  }

  // Fallback weather data when API is unavailable
  private getFallbackWeatherData(city: string): WeatherData {
    const baseTemp = 25 + Math.random() * 10; // 25-35°C typical for Indian cities
    const conditions = ['CLEAR', 'CLOUDY', 'RAIN', 'FOG'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temperature: Math.round(baseTemp),
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.random() * 15 + 5, // 5-20 km/h
      description: this.getWeatherDescription(randomCondition),
      icon: this.getWeatherIcon(randomCondition),
      visibility: Math.random() * 5 + 5, // 5-10 km
      pressure: Math.floor(Math.random() * 20) + 1000, // 1000-1020 hPa
      conditions: randomCondition as any,
      travelImpact: this.determineTravelImpact(randomCondition.toLowerCase(), 10, 8) as any,
    };
  }

  // Fallback forecast data
  private getFallbackForecastData(city: string, days: number): WeatherData[] {
    const forecasts: WeatherData[] = [];
    
    for (let i = 0; i < days; i++) {
      forecasts.push(this.getFallbackWeatherData(city));
    }

    return forecasts;
  }

  // Get weather description
  private getWeatherDescription(condition: string): string {
    const descriptions: { [key: string]: string } = {
      'CLEAR': 'Clear sky',
      'CLOUDY': 'Partly cloudy',
      'RAIN': 'Light rain',
      'STORM': 'Thunderstorm',
      'FOG': 'Foggy conditions',
      'SNOW': 'Light snow',
    };
    return descriptions[condition] || 'Clear sky';
  }

  // Get weather icon
  private getWeatherIcon(condition: string): string {
    const icons: { [key: string]: string } = {
      'CLEAR': '01d',
      'CLOUDY': '02d',
      'RAIN': '10d',
      'STORM': '11d',
      'FOG': '50d',
      'SNOW': '13d',
    };
    return icons[condition] || '01d';
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPIService();
export default weatherAPI;
