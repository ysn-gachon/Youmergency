import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
    session: Session | null;
    user: User | null;
    profile: any | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
    fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    profile: null,
    loading: true,
    setSession: (session) => {
        set({ session, user: session?.user ?? null, loading: false });
        if (session?.user) {
            get().fetchProfile(session.user.id);
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, profile: null });
    },
    initialize: async () => {
        console.log('[AuthStore] initialize start');
        set({ loading: true });
        try {
            console.log('[AuthStore] getting session');
            const { data: { session } } = await supabase.auth.getSession();
            console.log('[AuthStore] session retrieved:', !!session);
            set({ session, user: session?.user ?? null });

            if (session?.user) {
                console.log('[AuthStore] fetching profile');
                await get().fetchProfile(session.user.id);
            }
        } catch (e) {
            console.error('[AuthStore] initialize error:', e);
        } finally {
            console.log('[AuthStore] initialize failed or done, setting loading false');
            set({ loading: false });
        }

        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null });
            if (session?.user) {
                get().fetchProfile(session.user.id);
            } else {
                set({ profile: null });
            }
        });
    },
    fetchProfile: async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.log('Error fetching profile:', error);
            } else {
                set({ profile: data });
            }
        } catch (e) {
            console.error(e);
        }
    },
}));
