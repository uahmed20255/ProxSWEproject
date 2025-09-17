import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function GroceryListScreen({ navigation }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [groceryList, setGroceryList] = useState([]);

  const addItem = () => {
    if (!itemName.trim() || !quantity.trim()) {
      Alert.alert("Error", "Please enter item name and quantity");
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      qty: quantity,
    };
    setGroceryList([...groceryList, newItem]);
    setItemName("");
    setQuantity("");
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Grocery List</Text>

      {/* ✅ Sign Out button always visible at top */}
      <View style={{ marginBottom: 20 }}>
        <Button title="Sign Out" color="red" onPress={handleSignOut} />
      </View>

      <TextInput
        placeholder="Item name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />

      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={groceryList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.qty} × {item.name}</Text>
        )}
        style={{ marginVertical: 20 }}
      />

      <Button
        title="Find Best Prices"
        onPress={() => navigation.navigate("PriceComparison", { groceryList })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
n
