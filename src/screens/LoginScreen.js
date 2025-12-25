import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import useStore from '../store/useStore';

const LoginScreen = ({ navigation }) => {
  const setUser = useStore((state) => state.setUser);

  const handleLogin = () => {
    // Mock login
    setUser({ id: '1', display_name: 'Test User', email: 'test@example.com' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WakeMate</Text>
      <Text style={styles.subtitle}>Never sleep through again.</Text>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEON_THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: NEON_THEME.spacing.large,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: NEON_THEME.colors.primary,
    marginBottom: 10,
    textShadowColor: NEON_THEME.colors.primary,
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 18,
    color: NEON_THEME.colors.text.secondary,
    marginBottom: 50,
  },
  loginButton: {
    backgroundColor: NEON_THEME.colors.surface,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: NEON_THEME.colors.primary,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: NEON_THEME.colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
