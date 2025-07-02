import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderRadius: 20,
          marginHorizontal: 10,
          marginBottom: 40,
          position: 'absolute',
          height: 60,
          paddingBottom: 5,
          shadowColor: colors.text,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 5,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="active/index"
        options={{
          title: 'Ativos',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="check" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inactive/index"
        options={{
          title: 'Inativos',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="times" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="register/index"
        options={{
          title: 'Cadastrar',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
