import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { playAlarmSound, stopAlarmSound } from '../lib/audio';

export default function GlobalAlarmListener() {
    const { user } = useAuthStore();
    const [incomingAlarm, setIncomingAlarm] = useState<any>(null);

    useEffect(() => {
        if (!user) return;

        // 1. 초기 로드: Pending 상태인 알람 확인
        const checkPendingAlarms = async () => {
            const { data } = await supabase
                .from('alarms')
                .select('*')
                .eq('receiver_id', user.id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                triggerAlarm(data);
            }
        };

        checkPendingAlarms();

        // 2. 실시간 구독
        const channel = supabase
            .channel('global:alarms')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'alarms',
                    filter: `receiver_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.new.status === 'pending') {
                        triggerAlarm(payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            stopAlarmSound();
        };
    }, [user]);

    const triggerAlarm = (alarmData: any) => {
        setIncomingAlarm(alarmData);
        playAlarmSound();
    };

    const handleDismiss = async () => {
        if (!incomingAlarm) return;

        try {
            await stopAlarmSound();

            await supabase
                .from('alarms')
                .update({ status: 'success' })
                .eq('id', incomingAlarm.id);

            setIncomingAlarm(null);
            Alert.alert('기상 완료', '성공적으로 일어났습니다!');
        } catch (error) {
            console.error(error);
        }
    };

    if (!incomingAlarm) return null;

    return (
        <Modal visible={true} transparent={false} animationType="slide">
            <View style={[styles.container, styles.alarmActive]}>
                <Text style={styles.alarmTitle}>WAKE UP!</Text>
                <Text style={styles.message}>"{incomingAlarm.message}"</Text>

                <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
                    <Text style={styles.dismissText}>알람 해제 (Swipe up)</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alarmActive: {
        backgroundColor: NEON_THEME.colors.error,
    },
    alarmTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    message: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 60,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    dismissButton: {
        backgroundColor: '#FFF',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 50,
        elevation: 10,
    },
    dismissText: {
        color: NEON_THEME.colors.error,
        fontSize: 20,
        fontWeight: 'bold',
    },
});
