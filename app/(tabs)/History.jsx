
import React, { useEffect, useState, useMemo } from 'react';
import { View,Button, Text, FlatList, TextInput, ActivityIndicator, StyleSheet, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

// Map of Indian states to their capital cities
const stateCapitals = {
  "Andhra Pradesh": "Amaravati",
  "Arunachal Pradesh": "Itanagar",
  "Assam": "Dispur",
  "Bihar": "Patna",
  "Chhattisgarh": "Raipur",
  "Goa": "Panaji",
  "Gujarat": "Gandhinagar",
  "Haryana": "Chandigarh",
  "Himachal Pradesh": "Shimla",
  "Jharkhand": "Ranchi",
  "Karnataka": "Bengaluru",
  "Kerala": "Thiruvananthapuram",
  "Madhya Pradesh": "Bhopal",
  "Maharashtra": "Mumbai",
  "Manipur": "Imphal",
  "Meghalaya": "Shillong",
  "Mizoram": "Aizawl",
  "Nagaland": "Kohima",
  "Odisha": "Bhubaneswar",
  "Punjab": "Chandigarh",
  "Rajasthan": "Jaipur",
  "Sikkim": "Gangtok",
  "Tamil Nadu": "Chennai",
  "Telangana": "Hyderabad",
  "Tripura": "Agartala",
  "Uttar Pradesh": "Lucknow",
  "Uttarakhand": "Dehradun",
  "West Bengal": "Kolkata",
  "Delhi": "New Delhi"
};

const History = () => {
  const [aqiData, setAqiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredCityData, setFilteredCityData] = useState([]);
  const [locationCity, setLocationCity] = useState(null);

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await fetch('http://YOUR-IPV4-ADDREESS:8000/api/aqi');
        const data = await response.json();
        setAqiData(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAQIData();
  }, []);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (geocode.length > 0) {
          const state = geocode[0].region;
          const capital = stateCapitals[state];

          if (capital) {
            setSearch(capital);
            setLocationCity(capital);
          } else {
            Alert.alert("Capital Not Found", `Couldn't find a capital for state: ${state}`);
          }
        }
      } catch (error) {
        console.error('Location error:', error);
      }
    };
    getCurrentLocation();
  }, [aqiData]);

  useEffect(() => {
    const filterCityData = () => {
      const cityData = aqiData.filter(item =>
        item.City.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCityData(cityData.slice(-4)); // last 5 records
    };
    filterCityData();
  }, [search, aqiData]);

  const getAqiColor = useMemo(() => {
    return (aqi) => {
      const value = parseFloat(aqi);
      if (value <= 50) return '#00e400';
      if (value <= 100) return '#ffff00';
      if (value <= 150) return '#ff7e00';
      if (value <= 200) return '#ff0000';
      if (value <= 300) return '#8f3f97';
      return '#7e0023';
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text>Loading AQI data...</Text>
      </View>
    );
  }

  return (
    
    <View style={{ flex: 1,backgroundColor: '#002655' }}>
      {locationCity && (
        <Text style={styles.locationText}> 📍State Capital Detected: {locationCity}</Text>
      )}

      <TextInput
        placeholder="Search by city..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {filteredCityData.length > 0 ? (
        <LineChart
          data={{
            labels: filteredCityData.map(item => item.Date),
            datasets: [{
              data: filteredCityData.map(item => parseFloat(item.AQI) || 0),
            }],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: () => '#000'
          }}
          style={{ margin: 10, borderRadius: 10 }}
        />
      ) : (
        <Text style={styles.center}>No AQI data found for this city.</Text>
      )}

      <FlatList
        data={filteredCityData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: getAqiColor(item.AQI), borderLeftWidth: 6 }]} >
            <Text style={styles.title}>City: {item.City}</Text>
            <Text>AQI: {item.AQI}</Text>
            <Text>Date: {item.Date}</Text>
          </View>
        )}
      />
      <View style={styles.container}>
      

      
    </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  locationText: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffff',
    marginTop:50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3C7F1',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EEEEEE'
  },
  card: {
    backgroundColor: '#DADCE5',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default History;
