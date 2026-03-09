import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./Dashboard";
import Timer from "./Timer";
import Store from "./Store";
import { LoginScreen, SignUpScreen } from "./AuthScreens";
import {
  ProfileInfoScreen,
  WelcomeScreen,
  PracticeMinutesScreen,
} from "./OnboardingFlow";
import PostPractice from "./PostPractice";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Timer" component={Timer} />
         <Stack.Screen name="PostPractice" component={PostPractice} />
        <Stack.Screen name="Store" component={Store} />
        <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="PracticeMinutes" component={PracticeMinutesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
