import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { playAlarmSound, stopAlarmSound } from '../lib/audio';

export default function AlarmReceiverScreen() {
    const { user } = useAuthStore();
    const [incomingAlarm, setIncomingAlarm] = useState<any>(null);

    useEffect(() => {
        if (!user) return;

        // 1. 초기 로드: Pending 상태인 알람이 있는지 확인
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

        // 2. 실시간 구독: 새로운 알람 감지
        const channel = supabase
            .channel('public:alarms')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'alarms',
                    filter: `receiver_id=eq.${user.id}`, // 내게 온 알람만 필터링
                },
                (payload) => {
                    console.log('New Alarm Received!', payload.new);
                    if (payload.new.status === 'pending') {
                        triggerAlarm(payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            stopAlarmSound(); // 컴포넌트 언마운트 시 소리 중단
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

            // 알람 상태 업데이트
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

    if (incomingAlarm) {
        return (
            <View style={[styles.container, styles.alarmActive]}>
                <Text style={styles.alarmTitle}>WAKE UP!</Text>
                <Text style={styles.message}>"{incomingAlarm.message}"</Text>

                <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
                    <Text style={styles.dismissText}>알람 해제 (Swipe up)</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>대기 중...</Text>
            <Text style={styles.subText}>친구의 알람을 기다리고 있습니다.</Text>
            <Text style={styles.debugText}>ID: {user?.id?.slice(0, 8)}...</Text>
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
    alarmActive: {
        backgroundColor: NEON_THEME.colors.error, // 시각적 긴급함
    },
    statusText: {
        fontSize: 32,
        color: NEON_THEME.colors.text.secondary,
        marginBottom: 16,
    },
    subText: {
        color: NEON_THEME.colors.text.secondary,
        fontSize: 16,
    },
    debugText: {
        color: NEON_THEME.colors.text.secondary,
        fontSize: 12,
        marginTop: 20,
        opacity: 0.5,
    },
    alarmTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
        marginTop: 60,
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
