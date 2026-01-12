import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NEON_THEME } from '../constants/theme';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Web Map Not Supported Yet</Text>
            <Text style={styles.subText}>Create a native build to view Google Maps</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NEON_THEME.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: NEON_THEME.colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        ...NEON_THEME.neonGlow,
    },
    subText: {
        color: NEON_THEME.colors.text.secondary,
        fontSize: 16,
    },
});
