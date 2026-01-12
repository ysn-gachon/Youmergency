import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Expo WebBrowser for Google Auth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { initialize } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const redirectUri = makeRedirectUri({
                scheme: 'wakemate',
                path: 'auth/callback',
            });

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUri,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
                if (result.type === 'success') {
                    // Session is handled by Supabase URL listener (we might need to manually check session)
                    initialize();
                }
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        try {
            setLoading(true);
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                Alert.alert('Success', 'Check your email for confirmation!');
            }
            initialize();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>WakeMate</Text>
                <Text style={styles.subtitle}>Neon Night Edition</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={NEON_THEME.colors.text.secondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={NEON_THEME.colors.text.secondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleEmailAuth} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={NEON_THEME.colors.text.primary} />
                    ) : (
                        <Text style={styles.buttonText}>{isLogin ? '로그인' : '회원가입'}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
                    <Text style={styles.switchText}>
                        {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin} disabled={loading}>
                    <Text style={styles.buttonText}>Google로 시작하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NEON_THEME.colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: NEON_THEME.spacing.large,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: NEON_THEME.colors.primary,
        marginBottom: NEON_THEME.spacing.small,
        ...NEON_THEME.neonGlow,
    },
    subtitle: {
        fontSize: 18,
        color: NEON_THEME.colors.text.secondary,
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: NEON_THEME.colors.surface,
        color: NEON_THEME.colors.text.primary,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: NEON_THEME.colors.border,
    },
    button: {
        backgroundColor: NEON_THEME.colors.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 16,
        ...NEON_THEME.neonGlow,
    },
    googleButton: {
        backgroundColor: NEON_THEME.colors.surface,
        borderColor: NEON_THEME.colors.primary,
        borderWidth: 1,
    },
    buttonText: {
        color: NEON_THEME.colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    switchButton: {
        marginBottom: 24,
    },
    switchText: {
        color: NEON_THEME.colors.text.secondary,
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: NEON_THEME.colors.border,
    },
    orText: {
        color: NEON_THEME.colors.text.secondary,
        marginHorizontal: 16,
    },
});
