import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
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
