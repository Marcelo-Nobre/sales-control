import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Editar Revendedor',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack>
  );
}
