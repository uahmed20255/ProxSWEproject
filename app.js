import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, Button, Image, TextInput, Alert } from "react-native";
import { supabase } from "./lib/supabase";  

// screens
import GroceryListScreen from "./screens/GroceryListScreen";
import PriceComparisonScreen from "./screens/PriceComparisonScreen";

const Stack = createNativeStackNavigator();

// --- Home Screen ---
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" }}
        style={styles.logo}
      />
      <Text style={styles.title}>Prox</Text>
      <Text style={styles.tagline}>Smart shopping made simple</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <View style={{ height: 10 }} />
      <Button
        title="Continue as Guest"
        onPress={() => navigation.navigate("GroceryList", { guest: true })}
      />
    </View>
  );
}

// --- Login Screen ---
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert("Error", error.message);
    else Alert.alert("Success", "Check your email for confirmation link!");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Error", error.message);
    else navigation.navigate("GroceryList");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <View style={{ height: 10 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

// --- Main App ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="GroceryList" component={GroceryListScreen} />
        <Stack.Screen name="PriceComparison" component={PriceComparisonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: "bold", color: "#2E86AB" },
  tagline: { fontSize: 18, color: "#555", marginTop: 8, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, width: "80%", marginVertical: 8, borderRadius: 5 }
});
