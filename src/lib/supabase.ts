import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// .env 파일이 제대로 로드되지 않았을 때를 대비한 안전 장치
// https://dummy-url.supabase.co 와 같은 유효하지 않은 URL이라도 형식이 맞으면 
// createClient 자체는 터지지 않고 요청 보낼 때 에러가 남.
// 빈 문자열이면 createClient가 바로 에러를 뱉음.

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('---------------------------------------------------------');
    console.error('[FATAL ERROR] Supabase Environment Variables are missing!');
    console.error('Make sure you have a .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
    console.error('And restart the bundler with: npx expo start -c');
    console.error('Current URL:', SUPABASE_URL);
    console.error('---------------------------------------------------------');
}

// 크래시 방지를 위한 Fallback (실제 요청은 실패함)
const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(url, key, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
