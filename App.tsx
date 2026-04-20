import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

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

/** Matches common Expo / iPhone preview width (e.g. iPhone 14). Web-only shell. */
const WEB_PHONE_WIDTH = 390;
const WEB_PHONE_MAX_HEIGHT = 844;

const webPhoneStyles = StyleSheet.create({
  /** Full-viewport backdrop; `position: fixed` avoids RN-web height/% quirks on desktop. */
  outer: {
    ...Platform.select({
      web: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E8E8EA",
        overflow: "hidden",
      },
      default: {},
    }),
  },
  inner: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderRadius: 24,
    ...Platform.select({
      web: {
        boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
      },
      default: {},
    }),
  },
  innerFill: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    maxWidth: "100%",
    minHeight: 0,
    minWidth: 0,
  },
  fontFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});

function WebPhoneShell({ children }: { children: React.ReactNode }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  // Do NOT use width: "100%" + maxWidth here — on react-native-web, % width fills the row and stays full-width.
  const frameWidth = Math.min(windowWidth, WEB_PHONE_WIDTH);
  const frameHeight = Math.min(windowHeight, WEB_PHONE_MAX_HEIGHT);

  return (
    <View style={webPhoneStyles.outer}>
      <View
        style={[
          webPhoneStyles.inner,
          { width: frameWidth, height: frameHeight },
        ]}
      >
        <View style={webPhoneStyles.innerFill}>{children}</View>
      </View>
    </View>
  );
}

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
          left: 20,
          right: 20,
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
  const [fontsLoaded, fontError] = useFonts({ ...Ionicons.font });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={webPhoneStyles.fontFallback}>
        <ActivityIndicator size="large" color="#1a6b5a" />
      </View>
    );
  }

  return (
    <WebPhoneShell>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </WebPhoneShell>
  );
}
