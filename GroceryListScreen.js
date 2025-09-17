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
  const [sortBy, setSortBy] = useState("created"); // default sort

  // Fetch logged-in user (skip for guests)
  useEffect(() => {
    if (!isGuest) fetchUser();
  }, []);

  // Filter and sort groceries
  useEffect(() => {
    filterAndSortGroceries();
  }, [search, groceries, sortBy]);

  // 1️⃣ Get current user
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      Alert.alert("Error", error?.message || "No user logged in");
      return;
    }
    setUser(data.user);
    fetchGroceries(data.user.id);
  };

  // 2️⃣ Fetch groceries for logged-in users
  const fetchGroceries = async (userId) => {
    const { data, error } = await supabase
      .from("groceries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      Alert.alert("Error fetching groceries", error.message);
    } else {
      setGroceries(data);
    }
  };

  // 3️⃣ Add grocery
  const addGrocery = async () => {
    if (!name || !qty || !category) {
      Alert.alert("Name, Quantity, and Category are required");
      return;
    }

    if (!isGuest && !user) {
      Alert.alert("User not logged in");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      size: size || null,
      qty: parseInt(qty),
      category,
    };

    // For guest: only local
    if (isGuest) {
      setGroceries([...groceries, newItem]);
    } else {
      const { error } = await supabase.from("groceries").insert([
        { user_id: user.id, ...newItem },
      ]);

      if (error) {
        Alert.alert("Error adding grocery", error.message);
        return;
      }

      fetchGroceries(user.id);
    }

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

    const { error } = await supabase.from("groceries").delete().eq("id", id);
    if (error) {
      Alert.alert("Error deleting grocery", error.message);
    } else {
      setGroceries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 5️⃣ Filter and sort groceries
  const filterAndSortGroceries = () => {
    let tempList = groceries;

    // Filter by search
    if (search) {
      tempList = tempList.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      tempList = tempList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      tempList = tempList.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredGroceries([...tempList]); // copy to trigger re-render
  };

  // 6️⃣ Sign out (only for logged-in users)
  const handleSignOut = async () => {
    if (isGuest) {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Grocery List</Text>

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
