import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ltekvapttpnxvlaoamdj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWt2YXB0dHBueHZsYW9hbWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MzU4MzEsImV4cCI6MjA4MjIxMTgzMX0.XqlmVG5SpV178eL7mJEeB86Ys7Es5Foz8YOakL-VmCQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
