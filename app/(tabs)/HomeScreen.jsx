import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, Alert,
  Image, TextInput, ScrollView, TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const getEarthImage = (aqi) => {
  const val = parseFloat(aqi);
  if (val <= 50) return require('../src/screens/Earth1-removebg-preview.png');
  if (val <= 100) return require('../src/screens/Earth2-removebg-preview.png');
  if (val <= 150) return require('../src/screens/Earth3-removebg-preview.png');
  if (val <= 200) return require('../src/screens/Earth4.png-removebg-preview.png');
  if (val <= 300) return require('../src/screens/Earth5-removebg-preview.png');
  return require('../src/screens/Earth5-removebg-preview.png');
};

const getAQIStatus = (aqi) => {
  const val = parseFloat(aqi);
  if (val <= 50) return 'Good';
  if (val <= 100) return 'Moderate';
  if (val <= 150) return 'Sensitive';
  if (val <= 200) return 'Unhealthy';
  if (val <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const AQIScreen = () => {
  const [aqiData, setAqiData] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAQIData = async () => {
    try {
      const response = await fetch('http://YOUR-IPV4-ADDREESS:3000/api/data');
      const data = await response.json();
      const flatData = data.map(entry => ({
        city: entry["State__City__@id"],
        station: entry["State__City__Station__@id"],
        latitude: parseFloat(entry["State__City__Station__@latitude"]),
        longitude: parseFloat(entry["State__City__Station__@longitude"]),
        aqi: entry["State__City__Station__Air_Quality_Index__@Value"] || '0',
        pollutants: {
          CO: '1.02 ppb', NO2: '10.72 ppb', SO2: '9.23 ppb',
          PM10: '4.85 mpmc', O3: '48.37 ppb', NH3: '33.52 ppb'
        },
      }));
      setAqiData(flatData);
    } catch (error) {
      console.error('Error fetching AQI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => { fetchAQIData(); }, []);

  useEffect(() => {
    const locate = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Location required');

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      let nearest = null;
      let minDist = Infinity;
      aqiData.forEach(st => {
        const d = getDistance(latitude, longitude, st.latitude, st.longitude);
        if (d < minDist) {
          minDist = d;
          nearest = st;
        }
      });
      setNearestStation(nearest);
    };

    if (aqiData.length) locate();
  }, [aqiData]);

  if (loading || !nearestStation) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text style={{ marginTop: 10 }}>Loading AQI data...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#D4D4F8', '#AFEDFA']} style={styles.container}>
      <Text style={styles.capitalText}>📍 Nearest Station: {nearestStation.station} ({nearestStation.city})</Text>

      

      <View style={styles.card}>
        <Image source={getEarthImage(nearestStation.aqi)} style={styles.earthImage} />
        <Text style={styles.dateText}>{new Date().toLocaleString()}</Text>
        <Text style={styles.cityText}>{nearestStation.city}</Text>
        <Text style={styles.aqiText}>
          {nearestStation.aqi} AQI ({getAQIStatus(nearestStation.aqi)})
        </Text>

        <View style={styles.pollutantSection}>
  <Text style={styles.sectionTitle}>Gaseous Pollutants</Text>
  <View style={styles.pollutantGroup}>
    {['CO', 'NO2', 'SO2', 'O3'].map(label => (
      <View key={label} style={styles.pollutantBox}>
        <Text style={styles.pollutantLabel}>{label}</Text>
        <Text style={styles.pollutantValue}>{nearestStation.pollutants[label]}</Text>
      </View>
    ))}
  </View>

  <Text style={styles.sectionTitle}>Particulate Matter</Text>
  <View style={styles.pollutantGroup}>
    {['PM10', 'NH3'].map(label => (
      <View key={label} style={styles.pollutantBox}>
        <Text style={styles.pollutantLabel}>{label}</Text>
        <Text style={styles.pollutantValue}>{nearestStation.pollutants[label]}</Text>
      </View>
    ))}
  </View>
</View>


        
      </View>

      <View style={styles.aqiScale}>
        {['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023'].map(color => (
          <View key={color} style={[styles.scaleBlock, { backgroundColor: color }]} />
        ))}
        <Text style={styles.aqiMarker}>{nearestStation.aqi}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  capitalText: {  fontWeight: 'bold', marginBottom: 25, marginTop:25 },
  capitalText: { fontSize: 18, color: '#F8FAF9',textAlign: 'center', },
  
  card: {
    backgroundColor: '#002655', borderRadius: 16, padding: 20,
    elevation: 4, marginBottom: 20, alignItems: 'center',marginTop:25
  },
  earthImage: { width: 130, height: 135, marginBottom: 10 },
  dateText: { color: '#ffff', marginBottom: 4 },
  cityText: { fontSize: 18, fontWeight: 'bold' },
  aqiText: {
    fontSize: 20, fontWeight: 'bold',
    color: '#FFD700', marginBottom: 10,
  },
  pollutantSection: {
    width: '100%', marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '600', marginBottom: 6,
    color: '#333',
  },
  pollutantGroup: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', marginBottom: 12,
  },
  pollutantBox: {
    width: '48%', backgroundColor: '#F8FAF9',
    borderRadius: 10, padding: 12, marginBottom: 8,
  },
  pollutantLabel: {
    fontSize: 14, fontWeight: '500', color: '#555',
  },
  pollutantValue: {
    fontSize: 16, fontWeight: 'bold', color: '#222',
  },
  
  mapButton: {
    backgroundColor: '#7265E3', paddingVertical: 10,
    paddingHorizontal: 30, borderRadius: 10, marginTop: 10,
  },
  mapButtonText: { color: 'white', fontWeight: 'bold' },
  aqiScale: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', position: 'relative',
  },
  scaleBlock: {
    width: 40, height: 20, marginHorizontal: 1,
  },
  aqiMarker: {
    position: 'absolute', top: 25, fontSize: 12,
    fontWeight: 'bold', backgroundColor: 'white',
    paddingHorizontal: 4, borderRadius: 4,
  },
});

export default AQIScreen;
