import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import BackButton from '../components/BackButton';

const ControllerScreen = ({ route, navigation }) => {
  const { friendId } = route.params || {};
  const [isTTS, setIsTTS] = useState(false);

  const sendAlarm = () => {
    console.log(`Sending alarm to ${friendId} with TTS: ${isTTS}`);
    // Logic to send alarm via Supabase/FCM
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Wake Up Friend!</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Alarm Type</Text>
        <View style={styles.row}>
          <Text style={styles.optionText}>Standard</Text>
          <Switch 
            value={isTTS} 
            onValueChange={setIsTTS}
            trackColor={{ false: '#767577', true: NEON_THEME.colors.secondary }}
            thumbColor={isTTS ? '#f4f3f4' : '#f4f3f4'}
          />
          <Text style={styles.optionText}>TTS Voice</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={sendAlarm}>
        <Text style={styles.sendButtonText}>SEND ALARM NOW</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEON_THEME.colors.background,
    padding: NEON_THEME.spacing.medium,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: NEON_THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: NEON_THEME.colors.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  label: {
    color: NEON_THEME.colors.text.secondary,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    color: NEON_THEME.colors.text.primary,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: NEON_THEME.colors.primary,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    ...NEON_THEME.neonGlow,
  },
  sendButtonText: {
    color: NEON_THEME.colors.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ControllerScreen;
