import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NEON_THEME } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ControllerScreen from '../screens/ControllerScreen';
import ReceiverScreen from '../screens/ReceiverScreen';
import MapScreen from '../screens/MapScreen';
import useStore from '../store/useStore';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const user = useStore((state) => state.user);

  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: NEON_THEME.colors.primary,
        background: NEON_THEME.colors.background,
        card: NEON_THEME.colors.surface,
        text: NEON_THEME.colors.text.primary,
        border: NEON_THEME.colors.border,
        notification: NEON_THEME.colors.secondary,
      }
    }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Controller" component={ControllerScreen} />
            <Stack.Screen name="Receiver" component={ReceiverScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
