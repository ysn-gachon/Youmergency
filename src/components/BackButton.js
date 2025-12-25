import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NEON_THEME } from '../constants/theme';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
      <Text style={styles.text}>← Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  text: {
    color: NEON_THEME.colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BackButton;
