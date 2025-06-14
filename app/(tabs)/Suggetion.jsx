import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const getRecommendations = (aqi) => {
  if (aqi <= 50) {
    return [
      { icon: 'run-fast', title: 'Outdoor Activities', desc: 'No restrictions' },
      { icon: 'face-mask', title: 'Mask', desc: 'Not needed' },
      { icon: 'window-open', title: 'Room Ventilation', desc: 'Good to ventilate' },
      { icon: 'air-purifier', title: 'Air Purifier', desc: 'Not required' },
      { icon: 'medical-bag', title: 'Medical Advisory', desc: 'No special advisory' },
    ];
  } else if (aqi <= 100) {
    return [
      { icon: 'run-fast', title: 'Outdoor Activities', desc: 'Reduce at peak day time' },
      { icon: 'face-mask', title: 'Mask', desc: 'No need at this time' },
      { icon: 'window-open', title: 'Room Ventilation', desc: 'Reduce' },
      { icon: 'air-purifier', title: 'Air Purifier', desc: 'Not required. Might need later' },
      { icon: 'medical-bag', title: 'Medical Advisory', desc: 'Needed only for chronic disease history' },
    ];
  } else if (aqi <= 200) {
    return [
      { icon: 'run-fast', title: 'Outdoor Activities', desc: 'Avoid prolonged activity' },
      { icon: 'face-mask', title: 'Mask', desc: 'Recommended during outdoor activity' },
      { icon: 'window-open', title: 'Room Ventilation', desc: 'Minimize opening windows' },
      { icon: 'air-purifier', title: 'Air Purifier', desc: 'Use recommended' },
      { icon: 'medical-bag', title: 'Medical Advisory', desc: 'Advised for sensitive individuals' },
    ];
  } else if (aqi <= 300) {
    return [
      { icon: 'run-fast', title: 'Outdoor Activities', desc: 'Avoid outdoor activities' },
      { icon: 'face-mask', title: 'Mask', desc: 'Use N95/KN95 masks' },
      { icon: 'window-open', title: 'Room Ventilation', desc: 'Keep windows closed' },
      { icon: 'air-purifier', title: 'Air Purifier', desc: 'Strongly recommended' },
      { icon: 'medical-bag', title: 'Medical Advisory', desc: 'Consult doctor for chronic cases' },
    ];
  } else {
    return [
      { icon: 'run-fast', title: 'Outdoor Activities', desc: 'Strictly avoid' },
      { icon: 'face-mask', title: 'Mask', desc: 'Must wear anti-pollution mask' },
      { icon: 'window-open', title: 'Room Ventilation', desc: 'Seal windows, use air filters' },
      { icon: 'air-purifier', title: 'Air Purifier', desc: 'Must have' },
      { icon: 'medical-bag', title: 'Medical Advisory', desc: 'Emergency advice for affected' },
    ];
  }
};

export default function NearbyAQISuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError(true);
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const res = await axios.get('http://YOUR-IPV4-ADDREESS:3000/api/data');
        const dataset = res.data;

        const nearest = dataset.reduce((prev, curr) => {
          const distPrev = Math.hypot(prev['State__City__Station__@latitude'] - latitude, prev['State__City__Station__@longitude'] - longitude);
          const distCurr = Math.hypot(curr['State__City__Station__@latitude'] - latitude, curr['State__City__Station__@longitude'] - longitude);
          return distCurr < distPrev ? curr : prev;
        });

        const aqi = parseInt(nearest['State__City__Station__Air_Quality_Index__@Value']);
        const recs = getRecommendations(aqi);
        setSuggestions(recs);
      } catch (error) {
        console.error(error);
        setLocationError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2f6e" />
        <Text style={styles.loadingText}>Fetching recommendations based on your location...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to access location or fetch data. Please check permissions and try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Recommendations for You</Text>
      <View style={styles.card}>
        {suggestions.map((item, index) => (
          <View key={index} style={styles.item}>
            <MaterialCommunityIcons name={item.icon} size={36} color="#000" style={styles.icon} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      paddingHorizontal: 20,
      backgroundColor: '#002655',
      flexGrow: 1,
    },
    heading: {
      backgroundColor: '#3175E2',
      color: 'white',
      fontSize: 20,
      fontWeight: '600',
      padding: 12,
      borderRadius: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    card: {
      backgroundColor: '#D4D4F8',
      borderRadius: 30,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    icon: {
      marginRight: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111',
      flexShrink: 1, // Ensures text doesn't overflow
      flex: 1, // Allows text to take remaining space
    },
    desc: {
      color: '#444',
      flexShrink: 1, // Ensures text doesn't overflow
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#e9e3ee',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#fdecea',
    },
    errorText: {
      fontSize: 16,
      color: '#b00020',
      textAlign: 'center',
    },
  });
  