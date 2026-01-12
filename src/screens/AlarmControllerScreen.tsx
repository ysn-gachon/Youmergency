import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function AlarmControllerScreen() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSendAlarm = async () => {
        if (!user) {
            Alert.alert('Error', '로그인이 필요합니다.');
            return;
        }

        try {
            setLoading(true);

            const receiverId = user.id;

            const { error } = await supabase.from('alarms').insert({
                sender_id: user.id,
                receiver_id: receiverId,
                trigger_time: new Date().toISOString(),
                message: '일어나!!!',
                message_type: 'default',
                status: 'pending'
            });

            if (error) throw error;

            Alert.alert('Success', '알람을 전송했습니다!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wake Up Call</Text>

            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>Now</Text>
                <Text style={styles.subText}>즉시 알람 보내기 (Test)</Text>
            </View>

            <TouchableOpacity
                style={[styles.sendButton, loading && { opacity: 0.7 }]}
                onPress={handleSendAlarm}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <>
                        <Feather name="bell" color="#FFF" size={24} style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>내 폰 테스트 (Self)</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NEON_THEME.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: NEON_THEME.spacing.large,
    },
    title: {
        fontSize: 24,
        color: NEON_THEME.colors.text.primary,
        marginBottom: 40,
    },
    timeContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: NEON_THEME.colors.primary,
        ...NEON_THEME.neonGlow,
    },
    subText: {
        color: NEON_THEME.colors.text.secondary,
        marginTop: 10,
        fontSize: 16,
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: NEON_THEME.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
        ...NEON_THEME.neonGlow,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
