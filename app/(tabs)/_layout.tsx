import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            index: focused ? 'home' : 'home-outline',
            budget: focused ? 'cash' : 'cash-outline',
            chat: focused ? 'chatbox' : 'chatbox-outline',
            profile: focused ? 'person' : 'person-outline',
          };

          return (
            <Ionicons
              name={iconMap[route.name] || 'home-outline'} 
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    />
  );
}
