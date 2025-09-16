// screens/PriceComparisonScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { supabase } from "../lib/supabase";

export default function PriceComparisonScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxStores, setMaxStores] = useState(1);
  const [bestBasket, setBestBasket] = useState(null);

  // Dropdown picker state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(maxStores);
  const [items, setItems] = useState([
    { label: "1 Store", value: 1 },
    { label: "2 Stores", value: 2 },
    { label: "3 Stores", value: 3 },
    { label: "4 Stores", value: 4 },
    { label: "5 Stores", value: 5 },
  ]);

  // Define colors for stores
  const storeColors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6A4C93", "#FF8C42"];

  useEffect(() => {
    fetchPriceComparison();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      const basket = calculateBestBasket(results, maxStores);
      setBestBasket(basket);
    }
  }, [results, maxStores]);

  const fetchPriceComparison = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert("Error", "No logged-in user found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("grocery_price_comparison")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        Alert.alert("Error fetching prices", error.message);
        setLoading(false);
        return;
      }

      setResults(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not fetch price comparison");
    }
    setLoading(false);
  };

  // Improved calculateBestBasket for multi-store distribution
  function calculateBestBasket(data, maxStores) {
    const allStores = [...new Set(data.map((item) => item.retailer_name))];
    const storesToUse = allStores.slice(0, maxStores);

    let assignment = [];
    let usedStores = new Set();

    // Group items by grocery_id
    const groceryMap = {};
    data.forEach((item) => {
      if (storesToUse.includes(item.retailer_name)) {
        if (!groceryMap[item.grocery_id]) groceryMap[item.grocery_id] = [];
        groceryMap[item.grocery_id].push(item);
      }
    });

    Object.values(groceryMap).forEach((items) => {
      items.sort((a, b) => a.total_cost - b.total_cost);
      let chosen = items.find(item => !usedStores.has(item.retailer_name));
      if (!chosen) chosen = items[0];

      assignment.push(chosen);
      usedStores.add(chosen.retailer_name);
      if (usedStores.size > maxStores) usedStores.clear();
    });

    const total = assignment.reduce((sum, item) => sum + item.total_cost, 0);
    const stores = [...new Set(assignment.map(item => item.retailer_name))];

    return { stores, total, assignment };
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find Best Prices</Text>

      {/* Max Stores Dropdown */}
      <View style={{ marginBottom: 15, zIndex: 1000 }}>
        <Text style={styles.label}>Shop From:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={(val) => {
            setValue(val());
            setMaxStores(val());
          }}
          setItems={setItems}
          containerStyle={{ height: 50 }}
          style={{ borderColor: "#ccc" }}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#2E86AB"
          style={{ marginTop: 50 }}
        />
      )}

      {!loading && bestBasket && (
        <View style={styles.summaryWrapper}>
          <Text style={styles.summaryText}>
            🛒 Best Stores: {bestBasket.stores.join(", ")}
          </Text>
          <Text style={styles.summaryText}>
            💰 Total Basket Cost: ${bestBasket.total.toFixed(2)}
          </Text>
        </View>
      )}

      {!loading && bestBasket && (
        <FlatList
          data={bestBasket.assignment}
          keyExtractor={(item, index) =>
            `${item.grocery_id}-${item.retailer_name}-${index}`
          }
          renderItem={({ item }) => {
            const color =
              storeColors[
                bestBasket.stores.indexOf(item.retailer_name) % storeColors.length
              ];
            return (
              <View style={styles.card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.itemName}>{item.grocery_item}</Text>
                  <View
                    style={[styles.storeBadge, { backgroundColor: color }]}
                  >
                    <Text style={styles.badgeText}>{item.retailer_name}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Unit Price:</Text>
                  <Text style={styles.value}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Qty:</Text>
                  <Text style={styles.value}>{item.qty}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Size:</Text>
                  <Text style={styles.value}>{item.price_size}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Total:</Text>
                  <Text style={[styles.value, styles.total]}>
                    ${item.total_cost.toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {!loading && !bestBasket && (
        <Text style={styles.noData}>
          No price data available for your groceries.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 15, color: "#2E86AB" },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5 },

  summaryWrapper: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryText: { fontSize: 16, fontWeight: "600", color: "#1B4F72" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#d1d1d1",
    borderWidth: 1,
  },
  itemName: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#34495E" },
  storeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: "#fff", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  value: { fontWeight: "500", color: "#2E4053" },
  total: { fontWeight: "bold", color: "#2E86AB" },
  noData: { marginTop: 20, fontSize: 16, color: "gray", textAlign: "center" },
});
