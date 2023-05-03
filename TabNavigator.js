import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import PeoplesScreen from "./src/screens/PeoplesScreen";
import PersonChatScreen from "./src/screens/PersonChatScreen";
import GroupChatScreen from "./src/screens/GroupChatScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import PuzzleScreen from "./src/screens/PuzzleScreen";
import UserSearch from './src/screens/UserSearch'
import RankScreen from "./src/screens/RankScreen";

const Stack = createNativeStackNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="peoples" component={PeoplesScreen} />
        <Stack.Screen name="notification" component={NotificationScreen} />
        <Stack.Screen name="puzzle" component={PuzzleScreen} />
        <Stack.Screen name="users" component={UserSearch} />
        <Stack.Screen name="person-chat" component={PersonChatScreen} />
        <Stack.Screen name="group-chat" component={GroupChatScreen} />
        <Stack.Screen name="rank" component={RankScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
