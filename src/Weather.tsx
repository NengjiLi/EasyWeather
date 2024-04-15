import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute,RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

// Define the type for your stack navigation parameters
export type RootStackParamList = {
    Home: undefined;
    Weather: { city: string };  // Assuming 'Weather' route expects a 'city' parameter
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Define the navigation prop type based on the navigation stack
type WeatherScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Weather'>;
type WeatherRouteProp = RouteProp<RootStackParamList, 'Weather'>;

interface CurrentWeather {
  temp_c: number;
  condition: {
    text: string;
  };
  humidity: number;
  wind_dir: string;
  wind_kph: number;
  pressure_mb: number;
  vis_km: number;
  uv: number;
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
    };
  };
}

interface WeatherData {
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
}

const getWeatherImage = (condition: string): string => {
  switch (condition) {
    case 'Sunny':
      return "https://media.istockphoto.com/id/1451511201/photo/bright-sun-with-beautiful-beams-in-a-blue-sky.webp?b=1&s=170667a&w=0&k=20&c=TzjXLTy7H4151syuyHDhcMXBvE-hp7IRTRW3eyxHOn8=";
    case 'Cloudy':
      return "https://media.istockphoto.com/id/1156400081/photo/threatening-storm-clouds-over-farmland.webp?b=1&s=170667a&w=0&k=20&c=akqoTEoK3ABoFgeuLUUtI4qkGLrImK3NINq8Wg7al9M=";
    case 'Rain':
      return "https://media.istockphoto.com/id/1458311785/photo/rain-rainy-season-sky.webp?b=1&s=170667a&w=0&k=20&c=TDzHDCbYlQu6voaM4CxCemh3eqITd7jVLxJRCpmPal0=";
    case 'Snow':
      return "https://media.istockphoto.com/id/621983566/photo/snowy-landscape.webp?b=1&s=170667a&w=0&k=20&c=pjWi3uhccze5r4qwYmN6cSo-uSh-AfEyxbXH5E3XK8w=";
    default:
      return "https://media.istockphoto.com/id/1156400081/photo/threatening-storm-clouds-over-farmland.webp?b=1&s=170667a&w=0&k=20&c=akqoTEoK3ABoFgeuLUUtI4qkGLrImK3NINq8Wg7al9M=";
  }
};

const Weather = () => {
  const navigation = useNavigation<WeatherScreenNavigationProp>();
  const route = useRoute<WeatherRouteProp>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const API_KEY = '9c301423fa39416c8f151651241104';
      const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${route.params.city}&days=6`);
      setWeatherData(response.data);
    };

    fetchWeatherData();
  }, [route.params.city]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.cityText}>{route.params.city}</Text>
      {weatherData && (
        <>
          <Text style={styles.title}>Current Weather</Text>
          <Text style={styles.weatherText}>Temperature: {weatherData.current.temp_c} °C</Text>
          <Text style={styles.weatherText}>Condition: {weatherData.current.condition.text}</Text>
          <Text style={styles.title}>5-Day Forecast</Text>
          {weatherData.forecast.forecastday.map((day, index) => (
            <ImageBackground
              key={index}
              source={{ uri: getWeatherImage(day.day.condition.text) }}
              style={styles.forecastContainer}
              imageStyle={styles.backgroundImage}
            >
              <Text style={styles.weatherText}>{day.date}</Text>
              <Text style={styles.weatherText}>Max: {day.day.maxtemp_c} °C</Text>
              <Text style={styles.weatherText}>Min: {day.day.mintemp_c} °C</Text>
              <Text style={styles.weatherText}>Condition: {day.day.condition.text}</Text>
            </ImageBackground>
          ))}
          <View style={styles.summaryContainer}>
            <Text style={styles.title}>Summary</Text>
            <Text style={styles.summaryText}>Current Temperature: {weatherData.current.temp_c} °C</Text>
            <Text style={styles.summaryText}>Humidity: {weatherData.current.humidity}%</Text>
            <Text style={styles.summaryText}>Wind Direction: {weatherData.current.wind_dir}</Text>
            <Text style={styles.summaryText}>Wind Speed: {weatherData.current.wind_kph} kph</Text>
            <Text style={styles.summaryText}>Pressure: {weatherData.current.pressure_mb} mb</Text>
            <Text style={styles.summaryText}>Visibility: {weatherData.current.vis_km} km</Text>
            <Text style={styles.summaryText}>UV Index: {weatherData.current.uv}</Text>
          </View>
        </>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cityText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background for text for better readability
  },
  forecastContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center', // Center content vertically
    height: 200, // Set a fixed height for background image
  },
  backgroundImage: {
    borderRadius: 10, // Ensure the corners are rounded
    opacity: 0.8, // Slightly see-through
  },
  summaryContainer: { 
    marginTop: 20,
  },
  summaryText: { 
    fontSize: 18,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Weather;
