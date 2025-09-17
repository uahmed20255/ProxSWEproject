// screens/GroceryListScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Picker } from "@react-native-picker/picker";

export default function GroceryListScreen({ navigation, route }) {
  const isGuest = route.params?.guest || false;

  const [user, setUser] = useState(null);
  const [groceries, setGroceries] = useState([]);
  const [filteredGroceries, setFilteredGroceries] = useState([]);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState("");
  const [category, setCategory] = useState("produce");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [loading, setLoading] = useState(false);

  // Fetch user (skip for guests)
  useEffect(() => {
    if (!isGuest) fetchUser();
  }, []);

  // Filter and sort groceries whenever list, search, or sort changes
  useEffect(() => {
    filterAndSortGroceries();
  }, [search, groceries, sortBy]);

  // 1️⃣ Get current logged-in user
  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        Alert.alert("Error", error?.message || "No user logged in");
        setLoading(false);
        return;
      }
      setUser(data.user);
      fetchGroceries(data.user.id);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not fetch user");
    }
    setLoading(false);
  };

  // 2️⃣ Fetch groceries for logged-in users
  const fetchGroceries = async (userId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("groceries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setGroceries(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error fetching groceries", err.message);
    }
    setLoading(false);
  };

  // 3️⃣ Add grocery
  const addGrocery = async () => {
    if (!name || !qty || !category) {
      Alert.alert("Error", "Name, Quantity, and Category are required");
      return;
    }

    if (!isGuest && (!user || !user.id)) {
      Alert.alert("Error", "User not logged in or invalid ID");
      return;
    }

    const newItem = {
      id: Date.now().toString(), // local id for FlatList
      name,
      size: size || null,
      qty: parseInt(qty),
      category,
    };

    if (isGuest) {
      setGroceries([...groceries, newItem]);
    } else {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("groceries").insert([
          {
            user_id: user.id, // must be valid UUID
            name: newItem.name,
            size: newItem.size,
            qty: newItem.qty,
            category: newItem.category,
          },
        ]);
        if (error) throw error;
        fetchGroceries(user.id);
      } catch (err) {
        console.error("Insert error:", err);
        Alert.alert("Error adding grocery", err.message);
      }
      setLoading(false);
    }

    // Clear form
    setName("");
    setSize("");
    setQty("");
    setCategory("produce");
  };

  // 4️⃣ Delete grocery
  const deleteGrocery = async (id) => {
    if (isGuest) {
      setGroceries((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("groceries").delete().eq("id", id);
      if (error) throw error;
      setGroceries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      Alert.alert("Error deleting grocery", err.message);
    }
    setLoading(false);
  };

  // 5️⃣ Filter and sort groceries
  const filterAndSortGroceries = () => {
    let tempList = groceries;

    if (search) {
      tempList = tempList.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "name") {
      tempList = tempList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      tempList = tempList.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredGroceries([...tempList]);
  };

  // 6️⃣ Sign out
  const handleSignOut = async () => {
    if (isGuest) {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      console.error(err);
      Alert.alert("Error signing out", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Grocery List</Text>

      {loading && <ActivityIndicator size="large" color="#2E86AB" style={{ marginVertical: 20 }} />}

      {/* Search */}
      <TextInput
        style={styles.input}
        placeholder="Search groceries..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Add Grocery Form */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Size (optional)"
        value={size}
        onChangeText={setSize}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
      />

      <View style={Platform.OS === "android" ? styles.pickerAndroid : styles.picker}>
        <Picker selectedValue={category} onValueChange={(value) => setCategory(value)}>
          <Picker.Item label="Produce" value="produce" />
          <Picker.Item label="Protein" value="protein" />
          <Picker.Item label="Snacks" value="snacks" />
          <Picker.Item label="Pantry" value="pantry" />
          <Picker.Item label="Household" value="household" />
        </Picker>
      </View>

      <Button title="Add Grocery" onPress={addGrocery} />

      {/* Sorting Buttons */}
      <View style={styles.sortContainer}>
        <Text style={{ marginRight: 10 }}>Sort by:</Text>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortBy("name")}>
          <Text>A-Z</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortBy("category")}>
          <Text>Category</Text>
        </TouchableOpacity>
      </View>

      {/* Grocery List */}
      <FlatList
        data={filteredGroceries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            {item.size ? <Text>Size: {item.size}</Text> : null}
            <Text>Qty: {item.qty}</Text>
            <Text>Category: {item.category}</Text>
            <Button title="Delete" color="red" onPress={() => deleteGrocery(item.id)} />
          </View>
        )}
      />

      <Button
        title="Find Best Prices"
        onPress={() =>
          navigation.navigate("PriceComparison", { groceries: filteredGroceries, isGuest })
        }
        disabled={filteredGroceries.length === 0}
      />

      {/* Sign Out */}
      <View style={{ marginTop: 20 }}>
        <Button title="Sign Out" color="red" onPress={handleSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontWeight: "bold" },
  sortContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sortButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 5,
    borderRadius: 5,
  },
});
