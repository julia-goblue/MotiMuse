import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Dashboard from "./Dashboard";
import Timer from "./Timer";
import Store from "./Store";
import Profile from "./Profile";
import { LoginScreen, SignUpScreen } from "./AuthScreens";
import {
  ProfileInfoScreen,
  WelcomeScreen,
  PracticeMinutesScreen,
} from "./OnboardingFlow";
import PostPractice from "./PostPractice";
import PracticeIntro from "./PracticeIntro";
import Egg from "./Egg";
import FirstTimer from "./FirstTimer";
import Streak from "./Streak";
import Avatar from "./avatar";
import Hatching from "./Hatching";
import { FLOATING_TAB_BAR } from "./tabBarMetrics";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: FLOATING_TAB_BAR.positionBottom,
          left: "7%",
          right: "7%",
          height: FLOATING_TAB_BAR.height,
          borderRadius: 36,
          backgroundColor: "#EAFBB1",
          paddingHorizontal: 26,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Dashboard") {
            iconName = "home-outline";
          } else if (route.name === "PracticeIntro") {
            iconName = "musical-notes-outline";
          } else if (route.name === "Store") {
            iconName = "cube-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#1a6b5a" : "transparent",
              }}
            >
              <Ionicons
                name={iconName}
                size={26}
                color={focused ? "#EAFBB1" : "#1a6b5a"}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen
        name="PracticeIntro"
        component={PracticeIntro}
        options={{
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen name="Store" component={Store} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="PracticeMinutes" component={PracticeMinutesScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PracticeIntro" component={PracticeIntro} />
        <Stack.Screen name="Timer" component={Timer} />
        <Stack.Screen name="PostPractice" component={PostPractice} />
        <Stack.Screen name="Streak" component={Streak} />
        <Stack.Screen name="Egg" component={Egg} />
        <Stack.Screen name="FirstTimer" component={FirstTimer} />
        <Stack.Screen name="Avatar" component={Avatar} />
        <Stack.Screen name="Hatching" component={Hatching} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
