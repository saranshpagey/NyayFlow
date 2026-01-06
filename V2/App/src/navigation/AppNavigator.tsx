import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ResearchScreen from '../screens/ResearchScreen';
import DrafterScreen from '../screens/DrafterScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#18181b', // zinc-950
                    borderTopColor: '#27272a', // zinc-800
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#71717a', // zinc-500
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginBottom: 5,
                    fontWeight: '600'
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Research') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Drafter') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Research" component={ResearchScreen} />
            <Tab.Screen name="Drafter" component={DrafterScreen} />
        </Tab.Navigator>
    );
}
