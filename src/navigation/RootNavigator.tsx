import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { NEON_THEME } from '../constants/theme';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import FriendListScreen from '../screens/FriendListScreen';
import AlarmControllerScreen from '../screens/AlarmControllerScreen';
import AlarmReceiverScreen from '../screens/AlarmReceiverScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GlobalAlarmListener from '../components/GlobalAlarmListener';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 메인 탭 (친구, 알람, 지도, 프로필)
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: NEON_THEME.colors.surface,
                    borderTopColor: NEON_THEME.colors.border,
                },
                tabBarActiveTintColor: NEON_THEME.colors.primary,
                tabBarInactiveTintColor: NEON_THEME.colors.text.secondary,
            }}
        >
            <Tab.Screen
                name="Friends"
                component={FriendListScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Alarm"
                component={AlarmControllerScreen} // Or Receiver depending on context
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="bell" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="map" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    const { session, initialize, loading } = useAuthStore();

    useEffect(() => {
        console.log('RootNavigator Mounted');
        initialize();
    }, []);

    console.log('RootNavigator Render. Loading:', loading, 'Session:', !!session);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={NEON_THEME.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {session && <GlobalAlarmListener />}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {session ? (
                    <Stack.Screen name="Main" component={MainTabNavigator} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: NEON_THEME.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
