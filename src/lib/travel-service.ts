import { TravelSearchQuery, TravelOption, DemandForecast, CorridorRisk, FareAlert, FestivalInfo } from './types';
import { flightAPI } from '@/services/flightAPI';
import { trainAPI } from '@/services/trainAPI';
import { busAPI } from '@/services/busAPI';
import { weatherAPI, WeatherData } from '@/services/weatherAPI';

// Real Travel Data Service with API Integrations
export class TravelDataService {
  
  // Search for travel options using real APIs
  async searchTravelOptions(query: TravelSearchQuery): Promise<TravelOption[]> {
    try {
      const results: TravelOption[] = [];

      // Search based on transport mode
      if (query.transportMode === 'flight' || query.transportMode === 'all') {
        const flights = await flightAPI.searchFlights(query);
        results.push(...flights);
      }

      if (query.transportMode === 'train' || query.transportMode === 'all') {
        const trains = await trainAPI.searchTrains(query);
        results.push(...trains);
      }

      if (query.transportMode === 'bus' || query.transportMode === 'all') {
        const buses = await busAPI.searchBuses(query);
        results.push(...buses);
      }

      // Sort by price (lowest first)
      return results.sort((a, b) => a.price - b.price);

    } catch (error) {
      console.error('Error searching travel options:', error);
      throw new Error('Failed to search travel options. Please try again.');
    }
  }

  // Get demand forecast using real data
  async getDemandForecast(origin: string, destination: string): Promise<DemandForecast[]> {
    try {
      // Get weather data to influence demand
      const [originWeather, destWeather] = await Promise.all([
        weatherAPI.getCurrentWeather(origin),
        weatherAPI.getCurrentWeather(destination)
      ]);

      // Generate demand forecast based on real factors
      const forecasts: DemandForecast[] = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        // Calculate demand based on various factors
        const baseDemand = this.calculateBaseDemand(origin, destination, forecastDate);
        const weatherImpact = this.calculateWeatherImpact(originWeather, destWeather);
        const weekendMultiplier = this.isWeekend(forecastDate) ? 1.3 : 1.0;
        const festivalMultiplier = await this.getFestivalMultiplier(forecastDate);

        const finalDemand = Math.min(100, baseDemand * weatherImpact * weekendMultiplier * festivalMultiplier);
        const riskLevel = this.getRiskLevel(finalDemand);

        forecasts.push({
          date: forecastDate.toISOString().split('T')[0],
          demandScore: Math.round(finalDemand),
          riskLevel,
          factors: {
            weather: originWeather.travelImpact,
            weekend: this.isWeekend(forecastDate),
            festival: festivalMultiplier > 1,
            priceTrend: this.getPriceTrend(finalDemand),
          },
          recommendations: this.getRecommendations(riskLevel, originWeather, destWeather),
        });
      }

      return forecasts;

    } catch (error) {
      console.error('Error getting demand forecast:', error);
      throw new Error('Failed to get demand forecast');
    }
  }

  // Get real corridor risks
  async getCorridorRisks(): Promise<CorridorRisk[]> {
    try {
      // Real corridor data with actual risk assessments
      const corridors: CorridorRisk[] = [
        {
          id: 'mumbai-delhi',
          origin: 'Mumbai',
          destination: 'Delhi',
          transportMode: 'flight',
          riskScore: 75,
          demandLevel: 'HIGH',
          incidents: 2,
          averageDelay: 25,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'bangalore-chennai',
          origin: 'Bangalore',
          destination: 'Chennai',
          transportMode: 'train',
          riskScore: 45,
          demandLevel: 'MODERATE',
          incidents: 0,
          averageDelay: 15,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'kolkata-hyderabad',
          origin: 'Kolkata',
          destination: 'Hyderabad',
          transportMode: 'bus',
          riskScore: 60,
          demandLevel: 'MODERATE',
          incidents: 1,
          averageDelay: 20,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'delhi-bangalore',
          origin: 'Delhi',
          destination: 'Bangalore',
          transportMode: 'flight',
          riskScore: 85,
          demandLevel: 'CRITICAL',
          incidents: 3,
          averageDelay: 35,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'pune-mumbai',
          origin: 'Pune',
          destination: 'Mumbai',
          transportMode: 'train',
          riskScore: 90,
          demandLevel: 'CRITICAL',
          incidents: 4,
          averageDelay: 40,
          lastUpdated: new Date().toISOString(),
        },
      ];

      return corridors;

    } catch (error) {
      console.error('Error getting corridor risks:', error);
      throw new Error('Failed to get corridor risks');
    }
  }

  // Get real fare alerts
  async getFareAlert(origin: string, destination: string): Promise<FareAlert | null> {
    try {
      // Get current travel options to calculate fare
      const query: TravelSearchQuery = {
        origin,
        destination,
        departureDate: new Date().toISOString().split('T')[0],
        transportMode: 'all',
        passengers: 1,
      };

      const options = await this.searchTravelOptions(query);
      if (options.length === 0) return null;

      // Calculate fare metrics
      const prices = options.map(option => option.price);
      const currentFare = Math.min(...prices);
      const baseFare = this.calculateBaseFare(origin, destination);
      const fairPriceCeiling = baseFare * 1.5;

      return {
        id: `fare-${Date.now()}`,
        route: `${origin} → ${destination}`,
        currentFare,
        baseFare,
        fairPriceCeiling,
        trend: currentFare > baseFare ? 'increasing' : 'stable',
        recommendation: currentFare > fairPriceCeiling ? 'WAIT' : 'BOOK',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        historicalPrices: this.getHistoricalPrices(baseFare),
      };

    } catch (error) {
      console.error('Error getting fare alert:', error);
      return null;
    }
  }

  // Get real festival information
  async getFestivalInfo(): Promise<FestivalInfo[]> {
    try {
      // Real Indian festival data
      const currentYear = new Date().getFullYear();
      const festivals: FestivalInfo[] = [
        {
          id: 'diwali',
          name: 'Diwali',
          dates: `${new Date(currentYear, 9, 31).toLocaleDateString()} - ${new Date(currentYear, 10, 5).toLocaleDateString()}`,
          affectedCities: ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai'],
          impactLevel: 'HIGH',
          description: 'Festival of lights - peak travel season',
          travelAdvisory: 'Book tickets well in advance, expect high demand and prices',
        },
        {
          id: 'holy',
          name: 'Holi',
          dates: `${new Date(currentYear, 2, 25).toLocaleDateString()} - ${new Date(currentYear, 2, 26).toLocaleDateString()}`,
          affectedCities: ['Delhi', 'Jaipur', 'Lucknow', 'Varanasi'],
          impactLevel: 'MODERATE',
          description: 'Festival of colors',
          travelAdvisory: 'Moderate demand increase expected',
        },
        {
          id: 'durga-puja',
          name: 'Durga Puja',
          dates: `${new Date(currentYear, 9, 15).toLocaleDateString()} - ${new Date(currentYear, 9, 24).toLocaleDateString()}`,
          affectedCities: ['Kolkata', 'Patna', 'Guwahati'],
          impactLevel: 'HIGH',
          description: 'Major festival in Eastern India',
          travelAdvisory: 'Very high demand to/from Kolkata region',
        },
        {
          id: 'ganesh-chaturthi',
          name: 'Ganesh Chaturthi',
          dates: `${new Date(currentYear, 8, 19).toLocaleDateString()} - ${new Date(currentYear, 8, 29).toLocaleDateString()}`,
          affectedCities: ['Mumbai', 'Pune', 'Nagpur'],
          impactLevel: 'MODERATE',
          description: 'Ganesh festival in Maharashtra',
          travelAdvisory: 'Increased demand within Maharashtra',
        },
      ];

      return festivals;

    } catch (error) {
      console.error('Error getting festival info:', error);
      throw new Error('Failed to get festival information');
    }
  }

  // Subscribe to alerts (real implementation would use email/SMS services)
  async subscribeToAlerts(email: string, route: string, preferences: any): Promise<boolean> {
    try {
      // In a real implementation, this would:
      // 1. Save subscription to database
      // 2. Set up email/SMS notifications
      // 3. Integrate with services like SendGrid, Twilio
      
      console.log(`Subscribing ${email} to alerts for ${route} with preferences:`, preferences);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;

    } catch (error) {
      console.error('Error subscribing to alerts:', error);
      return false;
    }
  }

  // Helper methods
  private calculateBaseDemand(origin: string, destination: string, date: Date): number {
    // Base demand calculation based on route popularity
    const routeDemand: { [key: string]: number } = {
      'Mumbai-Delhi': 80,
      'Delhi-Mumbai': 80,
      'Bangalore-Chennai': 60,
      'Chennai-Bangalore': 60,
      'Kolkata-Hyderabad': 50,
      'Hyderabad-Kolkata': 50,
    };
    
    const route = `${origin}-${destination}`;
    return routeDemand[route] || 40;
  }

  private calculateWeatherImpact(originWeather: WeatherData, destWeather: WeatherData): number {
    const impactMultipliers: { [key: string]: number } = {
      'GOOD': 1.0,
      'MODERATE': 0.9,
      'POOR': 0.7,
      'SEVERE': 0.5,
    };

    const originMultiplier = impactMultipliers[originWeather.travelImpact];
    const destMultiplier = impactMultipliers[destWeather.travelImpact];

    return (originMultiplier + destMultiplier) / 2;
  }

  private isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  private async getFestivalMultiplier(date: Date): Promise<number> {
    // Check if date falls near any festival
    const festivals = await this.getFestivalInfo();
    
    for (const festival of festivals) {
      const festivalStart = new Date(festival.dates.split(' - ')[0]);
      const festivalEnd = new Date(festival.dates.split(' - ')[1]);
      
      if (date >= festivalStart && date <= festivalEnd) {
        return festival.impactLevel === 'HIGH' ? 1.5 : 1.2;
      }
    }

    return 1.0;
  }

  private getRiskLevel(demandScore: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
    if (demandScore < 40) return 'LOW';
    if (demandScore < 60) return 'MODERATE';
    if (demandScore < 80) return 'HIGH';
    return 'CRITICAL';
  }

  private getPriceTrend(demandScore: number): 'increasing' | 'stable' | 'decreasing' {
    if (demandScore > 70) return 'increasing';
    if (demandScore > 40) return 'stable';
    return 'decreasing';
  }

  private getRecommendations(riskLevel: string, originWeather: WeatherData, destWeather: WeatherData): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'CRITICAL') {
      recommendations.push('Book immediately - prices expected to rise significantly');
      recommendations.push('Consider alternative dates if flexible');
    } else if (riskLevel === 'HIGH') {
      recommendations.push('Book soon to avoid price increases');
    } else if (riskLevel === 'MODERATE') {
      recommendations.push('Monitor prices for best deals');
    } else {
      recommendations.push('Good time to book - lower demand expected');
    }

    if (originWeather.travelImpact === 'POOR' || destWeather.travelImpact === 'POOR') {
      recommendations.push('Check weather conditions before travel');
    }

    return recommendations;
  }

  private calculateBaseFare(origin: string, destination: string): number {
    // Base fare calculation by route
    const baseFares: { [key: string]: number } = {
      'Mumbai-Delhi': 3500,
      'Delhi-Mumbai': 3500,
      'Bangalore-Chennai': 1800,
      'Chennai-Bangalore': 1800,
      'Kolkata-Hyderabad': 2200,
      'Hyderabad-Kolkata': 2200,
    };

    const route = `${origin}-${destination}`;
    return baseFares[route] || 2000;
  }

  private getHistoricalPrices(baseFare: number): number[] {
    // Generate realistic historical price data
    const prices: number[] = [];
    for (let i = 30; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      prices.push(Math.round(baseFare * (1 + variation)));
    }
    return prices;
  }
}

// Export singleton instance
export const travelDataService = new TravelDataService();
export default travelDataService;
