import { Audio } from 'expo-av';

let soundObject: Audio.Sound | null = null;

export const playAlarmSound = async () => {
    try {
        // 이미 재생 중이면 중단
        if (soundObject) {
            await stopAlarmSound();
        }

        // 오디오 모드 설정 (무음 모드에서도 소리 나게)
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
            // 기본 경보음 (Expo 기본 애셋 사용 또는 원격 URL)
            // 실제 앱에서는 로컬 파일을 require('./assets/alarm.mp3')로 사용 권장
            // 여기서는 테스트를 위해 온라인 효과음 URL 사용 (또는 기본 딩동 소리)
            { uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
            { shouldPlay: true, isLooping: true, volume: 1.0 }
        );

        soundObject = sound;
        console.log('Alarm Playing...');
    } catch (error) {
        console.error('Failed to play alarm sound:', error);
    }
};

export const stopAlarmSound = async () => {
    try {
        if (soundObject) {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
            soundObject = null;
            console.log('Alarm Stopped');
        }
    } catch (error) {
        console.error('Failed to stop alarm sound:', error);
    }
};
