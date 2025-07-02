const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    card: '#f8f8f8',
    border: '#eee',
    inputBackground: '#f9f9f9',
    textSecondary: '#666',
    buttonDanger: '#DC3545',
    buttonSuccess: '#28A745',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    card: '#1e1e1e',
    border: '#333',
    inputBackground: '#2a2a2a',
    textSecondary: '#a0a0a0',
    buttonDanger: '#e57373',
    buttonSuccess: '#81c784',
  },
};

// Utility function to get contrasting text color for tint background
export function getContrastingTextColor(colorScheme: 'light' | 'dark'): string {
  return colorScheme === 'dark' ? '#000' : '#fff';
}
