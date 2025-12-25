import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  friends: [],
  alarms: [],
  isPro: false,
  
  setUser: (user) => set({ user }),
  setFriends: (friends) => set({ friends }),
  setAlarms: (alarms) => set({ alarms }),
  setIsPro: (isPro) => set({ isPro }),
  
  // Actions
  addAlarm: (alarm) => set((state) => ({ alarms: [...state.alarms, alarm] })),
  removeAlarm: (alarmId) => set((state) => ({ alarms: state.alarms.filter(a => a.id !== alarmId) })),
}));

export default useStore;
