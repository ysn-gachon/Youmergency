import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import useStore from '../store/useStore';

const HomeScreen = ({ navigation }) => {
  const { user, friends } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WakeMate</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.friendCard}
              onPress={() => navigation.navigate('Controller', { friendId: item.id })}
            >
              <Text style={styles.friendName}>{item.display_name}</Text>
              <View style={[styles.statusIndicator, item.isAwake && styles.awake]} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No friends added yet.</Text>}
        />
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => console.log('Add Friend')}
      >
        <Text style={styles.buttonText}>+ Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEON_THEME.colors.background,
    padding: NEON_THEME.spacing.medium,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NEON_THEME.colors.primary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    textShadowColor: NEON_THEME.colors.primary,
    textShadowRadius: 10,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    color: NEON_THEME.colors.text.primary,
    marginBottom: 10,
  },
  friendCard: {
    backgroundColor: NEON_THEME.colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendName: {
    color: NEON_THEME.colors.text.primary,
    fontSize: 16,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: NEON_THEME.colors.text.secondary,
  },
  awake: {
    backgroundColor: NEON_THEME.colors.secondary,
    ...NEON_THEME.neonGlow,
  },
  emptyText: {
    color: NEON_THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: NEON_THEME.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    ...NEON_THEME.neonGlow,
  },
  buttonText: {
    color: NEON_THEME.colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
