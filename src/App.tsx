import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, SafeAreaView,ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';

interface WeatherData {
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
    }
  ];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const backgroundImage = { uri: 'https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFuZHNjYXBlfGVufDB8fDB8fHww' };

const App = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const API_KEY = '63fd14740af783b2c5be8a0635113834';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const getWeatherData = async (city: string): Promise<WeatherData> => {
    try {
      const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch weather data');
    }
  };

  const handleGetWeather = async () => {
    try {
      const data = await getWeatherData(city);
      setWeather(data);
      navigation.navigate('Weather', { city, weatherData: data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.header}>
          <Text style={styles.headerText}>EasyWeather</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            placeholderTextColor="#ced4da"
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity style={styles.button} onPress={handleGetWeather}>
            <Text style={styles.buttonText}>GET</Text>
          </TouchableOpacity>
        </View>

        {weather && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Temperature: {weather.main.temp} °C{'\n'}
              Weather: {weather.weather[0].description}
            </Text>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3498db', 
  },
  
  backgroundImage: {
    flex: 1, 
    justifyContent: 'space-between', 
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontStyle: 'italic', 
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  menu: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  footer: {
    width: '100%',
    backgroundColor: '#3498db',
    padding: 10,
  },
  footerText: {
   
  },
});

export default App;