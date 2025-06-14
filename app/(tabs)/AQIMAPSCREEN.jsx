import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function AQIMapScreen() {
  const [location, setLocation] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Ask for location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setLoading(false);
        return;
      }

      // Get current GPS location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Fetch AQI from Open-Meteo API
      const { latitude, longitude } = currentLocation.coords;
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const currentHour = new Date().getHours();
        const index = data.hourly.time.findIndex(
          (t) => new Date(t).getHours() === currentHour
        );

        if (index !== -1) {
          setAqi({
            pm2_5: data.hourly.pm2_5[index],
            pm10: data.hourly.pm10[index],
            co: data.hourly.carbon_monoxide[index],
            no2: data.hourly.nitrogen_dioxide[index],
            so2: data.hourly.sulphur_dioxide[index],
            o3: data.hourly.ozone[index],
          });
        } else {
          setAqi(null);
        }
      } catch (error) {
        console.error('Error fetching AQI:', error);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Fetching location & AQI...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Unable to get location.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Current Location"
          description={
            aqi
              ? `PM2.5: ${aqi.pm2_5}, PM10: ${aqi.pm10}`
              : 'AQI data not available'
          }
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
