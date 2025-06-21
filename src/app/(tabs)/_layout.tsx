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
          backgroundColor: colors.background,
          borderRadius: 20,
          marginHorizontal: 10,
          marginBottom: 10,
          position: 'absolute',
          height: 60,
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
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
