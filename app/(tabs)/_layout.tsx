import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
        <Tabs.Screen
        name="History"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-histogram" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Details',
          tabBarIcon: ({ color }) => <MaterialIcons name="details" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="AQIMAPSCREEN"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <FontAwesome5 name="map-marked-alt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Suggetion"
        options={{
          title: 'Reccomendation',
          
          tabBarIcon: ({ color }) => <MaterialIcons name="health-and-safety" size={24} color={color}/>,
        }}
      />
    </Tabs>
  );
}
