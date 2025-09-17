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

export default function PriceComparisonScreen({ route }) {
  const isGuest = route?.params?.isGuest || false;
  const guestGroceries = route?.params?.groceries || [];

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

  // -------------------- Fetch Data --------------------
  const fetchPriceComparison = async () => {
    setLoading(true);
    try {
      if (isGuest && guestGroceries.length > 0) {
        // Guest mode
        let allPrices = [];
        for (const g of guestGroceries) {
          const { data, error } = await supabase
            .from("product_prices")
            .select("*")
            .ilike("product_name", g.name);

          if (!error && data.length > 0) {
            data.forEach((p) => {
              allPrices.push({
                grocery_id: g.id,
                grocery_item: g.name,
                qty: g.qty,
                size: g.size,
                retailer_name: p.retailer_name,
                price: parseFloat(p.price),
                price_size: p.size,
                total_cost: parseFloat(p.price) * g.qty,
              });
            });
          }
        }
        setResults(allPrices);
      } else {
        // Logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
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
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not fetch price comparison");
    }
    setLoading(false);
  };

  // -------------------- Basket Calculation --------------------
  function calculateBestBasket(data, maxStores) {
    const groceryMap = {};
    data.forEach((item) => {
      if (!groceryMap[item.grocery_item]) groceryMap[item.grocery_item] = [];
      groceryMap[item.grocery_item].push(item);
    });

    const allStores = [...new Set(data.map((item) => item.retailer_name))];

    if (maxStores === 1) {
      return findBestSingleStore(groceryMap, allStores);
    }

    return findBestMultipleStores(groceryMap, allStores, maxStores);
  }

  function findBestSingleStore(groceryMap, allStores) {
    let bestResult = null;
    let bestTotal = Infinity;

    allStores.forEach((store) => {
      let assignment = [];
      let total = 0;
      let valid = true;

      Object.keys(groceryMap).forEach((item) => {
        const options = groceryMap[item].filter(
          (x) => x.retailer_name === store
        );
        if (options.length === 0) valid = false;
        else {
          const cheapest = options.reduce((min, x) =>
            x.total_cost < min.total_cost ? x : min
          );
          assignment.push(cheapest);
          total += cheapest.total_cost;
        }
      });

      if (valid && total < bestTotal) {
        bestTotal = total;
        bestResult = { stores: [store], total, assignment };
      }
    });

    return bestResult;
  }

  function findBestMultipleStores(groceryMap, allStores, maxStores) {
    let bestResult = null;
    let bestTotal = Infinity;

    const combos = getCombinations(allStores, maxStores);
    combos.forEach((combo) => {
      let assignment = [];
      let total = 0;
      let valid = true;

      Object.keys(groceryMap).forEach((item) => {
        const options = groceryMap[item].filter((x) =>
          combo.includes(x.retailer_name)
        );
        if (options.length === 0) valid = false;
        else {
          const cheapest = options.reduce((min, x) =>
            x.total_cost < min.total_cost ? x : min
          );
          assignment.push(cheapest);
          total += cheapest.total_cost;
        }
      });

      if (valid && total < bestTotal) {
        bestTotal = total;
        bestResult = { stores: combo, total, assignment };
      }
    });

    return bestResult;
  }

  function getCombinations(array, size) {
    if (size === 1) return array.map((v) => [v]);
    if (size > array.length) return [];
    const combos = [];
    for (let i = 0; i <= array.length - size; i++) {
      const smaller = getCombinations(array.slice(i + 1), size - 1);
      smaller.forEach((s) => combos.push([array[i], ...s]));
    }
    return combos;
  }

  // -------------------- Render --------------------
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find Best Prices</Text>

      {/* Dropdown */}
      <View style={{ marginBottom: 15, zIndex: 1000 }}>
        <Text style={styles.label}>Shop From:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback();
            setValue(newValue);
            setMaxStores(newValue);
          }}
          setItems={setItems}
          containerStyle={{ height: 50 }}
          style={{ borderColor: "#ccc" }}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#2E86AB" />}

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
          keyExtractor={(item, idx) =>
            `${item.grocery_id}-${item.retailer_name}-${idx}`
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

