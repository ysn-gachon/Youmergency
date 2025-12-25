export const NEON_THEME = {
  colors: {
    background: '#121212', // Deep Charcoal
    surface: '#1E1E1E',    // Surface Grey
    primary: '#BB86FC',    // Electric Purple
    secondary: '#03DAC6',  // Neon Mint
    error: '#CF6679',      // Hot Pink
    text: {
      primary: '#FFFFFF',  // White High
      secondary: '#B0B0B0',// White Medium
    },
    border: '#2C2C2C',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  // 네온 효과 스타일 미리 정의
  neonGlow: {
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // Android
  }
};
