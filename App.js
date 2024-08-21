import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "./src/screen/CameraScreen";
import GreenTitanScreen from "./src/screen/HomeScreen";
import { Entypo, AntDesign } from "@expo/vector-icons";
import AnalyzeScreen from "./src/screen/AnalyzeScreen";


const Stack = createStackNavigator();

function CustomTabBar({ focusedTab, setFocusedTab }) {
  const navigation = useNavigation();

  const handlePress = (screenName) => {
    setFocusedTab(screenName);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          focusedTab === "Home" && styles.iconFocused,
        ]}
        onPress={() => handlePress("Home")}
      >
        <Entypo
          name="home"
          size={25}
          color={focusedTab === "Home" ? "#fff" : "#000"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          focusedTab === "Camera" && styles.iconFocused,
        ]}
        onPress={() => handlePress("Camera")}
      >
        <AntDesign
          name="camera"
          size={25}
          color={focusedTab === "Camera" ? "#fff" : "#000"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          focusedTab === "Settings" && styles.iconFocused,
        ]}
        onPress={() => handlePress("Settings")}
      >
        <Entypo
          name="menu"
          size={25}
          color={focusedTab === "Settings" ? "#fff" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [focusedTab, setFocusedTab] = useState("Home");
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={GreenTitanScreen} />
        <Stack.Screen
          name="Camera"
          children={() => <CameraScreen setFocusedTab={setFocusedTab} />}
        />
        <Stack.Screen name="Settings" component={GreenTitanScreen} />
        <Stack.Screen
          name="Analyze"
          children={() => <AnalyzeScreen setFocusedTab={setFocusedTab} />}
        />
      </Stack.Navigator>
      {focusedTab !== "Camera" && focusedTab !== "Analyze" && (
        <CustomTabBar focusedTab={focusedTab} setFocusedTab={setFocusedTab} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    left: "10%", // Adjusts the left margin to center the tabBar
    minHeight: 80,
    bottom: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 50,
    height: 50,
  },
  iconFocused: {
    backgroundColor: "#228B22",
  },
});
