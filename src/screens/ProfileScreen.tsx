import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
    const { signOut, user, profile } = useAuthStore();

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.email}>{profile?.display_name || 'No Name'}</Text>
                <Text style={styles.subText}>{user?.email || 'Guest'}</Text>
                {profile?.uid_code && <Text style={styles.codeText}>My Code: {profile.uid_code}</Text>}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NEON_THEME.colors.background,
        padding: NEON_THEME.spacing.large,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: NEON_THEME.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: NEON_THEME.colors.primary,
        marginBottom: 16,
        ...NEON_THEME.neonGlow,
    },
    avatarText: {
        fontSize: 40,
        color: NEON_THEME.colors.primary,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 24,
        fontWeight: 'bold',
        color: NEON_THEME.colors.text.primary,
        marginBottom: 4,
    },
    subText: {
        fontSize: 16,
        color: NEON_THEME.colors.text.secondary,
        marginBottom: 12,
    },
    codeText: {
        fontSize: 18,
        color: NEON_THEME.colors.secondary,
        fontWeight: '600',
        backgroundColor: NEON_THEME.colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        overflow: 'hidden',
    },
    logoutButton: {
        backgroundColor: NEON_THEME.colors.surface,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: NEON_THEME.colors.error,
    },
    logoutText: {
        color: NEON_THEME.colors.error,
        fontWeight: 'bold',
    },
});
