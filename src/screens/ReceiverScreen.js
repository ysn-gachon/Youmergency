import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { NEON_THEME } from '../constants/theme';

const ReceiverScreen = ({ navigation }) => {
  const [bgColor, setBgColor] = useState(new Animated.Value(0));

  useEffect(() => {
    // Blinking effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgColor, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(bgColor, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [NEON_THEME.colors.background, NEON_THEME.colors.error],
  });

  const handleDismiss = () => {
    // Stop sound logic here
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.alarmText}>WAKE UP!</Text>
      <Text style={styles.subText}>Someone is trying to wake you up.</Text>

      <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
        <Text style={styles.dismissText}>I'M AWAKE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: NEON_THEME.spacing.large,
  },
  alarmText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: NEON_THEME.colors.text.primary,
    marginBottom: 20,
  },
  subText: {
    fontSize: 18,
    color: NEON_THEME.colors.text.primary,
    marginBottom: 50,
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: NEON_THEME.colors.surface, // Or white for contrast as per spec
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dismissText: {
    color: NEON_THEME.colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ReceiverScreen;
